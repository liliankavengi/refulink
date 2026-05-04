#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{BytesN, Env};

fn setup() -> (Env, VouchContractClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VouchContract);
    let client = VouchContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let ambassador_two = Address::generate(&env);

    client.init(&admin);
    client.add_ambassador(&admin, &ambassador_two);

    (env, client, admin, ambassador_two)
}

#[test]
fn test_allowlisted_ambassadors_can_vouch() {
    let (env, client, admin, ambassador_two) = setup();
    let refugee = Address::generate(&env);
    let hashed_rin: BytesN<32> = BytesN::from_array(&env, &[0xabu8; 32]);

    assert_eq!(client.get_vouch_count(&refugee), 0);
    assert!(!client.is_vouched(&refugee));

    client.vouch(&admin, &refugee, &hashed_rin);
    client.vouch(&ambassador_two, &refugee, &hashed_rin);

    assert!(client.is_vouched(&refugee));
    assert_eq!(client.get_vouch_count(&refugee), 2);

    let first = client.get_vouch(&refugee, &admin);
    let second = client.get_vouch(&refugee, &ambassador_two);

    assert_eq!(first.ambassador, admin);
    assert_eq!(second.ambassador, ambassador_two);
    assert_eq!(first.hashed_rin, hashed_rin);
    assert_eq!(second.hashed_rin, hashed_rin);
}

#[test]
#[should_panic(expected = "unauthorized")]
fn test_non_allowlisted_ambassador_panics() {
    let (env, client, _admin, _ambassador_two) = setup();
    let impostor = Address::generate(&env);
    let refugee = Address::generate(&env);
    let hashed_rin: BytesN<32> = BytesN::from_array(&env, &[1u8; 32]);

    client.vouch(&impostor, &refugee, &hashed_rin);
}

#[test]
#[should_panic(expected = "already vouched by this ambassador")]
fn test_duplicate_vouch_by_same_ambassador_panics() {
    let (env, client, admin, _ambassador_two) = setup();
    let refugee = Address::generate(&env);
    let hashed_rin: BytesN<32> = BytesN::from_array(&env, &[2u8; 32]);

    client.vouch(&admin, &refugee, &hashed_rin);
    client.vouch(&admin, &refugee, &hashed_rin);
}

#[test]
#[should_panic(expected = "unauthorized")]
fn test_only_admin_can_manage_allowlist() {
    let (env, client, _admin, _ambassador_two) = setup();
    let impostor = Address::generate(&env);
    let extra = Address::generate(&env);

    client.add_ambassador(&impostor, &extra);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_double_init_panics() {
    let (env, client, admin, _ambassador_two) = setup();
    client.init(&admin);
}

#[test]
#[should_panic(expected = "not vouched")]
fn test_get_vouch_not_found_panics() {
    let (env, client, _admin, _ambassador_two) = setup();
    let stranger = Address::generate(&env);
    let some_ambassador = Address::generate(&env);
    client.get_vouch(&stranger, &some_ambassador);
}

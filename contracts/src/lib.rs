#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, BytesN, Env,
};

#[contracttype]
enum DataKey {
    Admin,
    Ambassador(Address),
    Identity(Address),
    Vouch(Address, Address),
    VouchCount(Address),
    Initialized,
}

#[contracttype]
#[derive(Clone)]
pub struct VouchRecord {
    pub ambassador: Address,
    pub target: Address,
    pub hashed_rin: BytesN<32>,
    pub vouched_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct IdentityRecord {
    pub hashed_rin: BytesN<32>,
    pub verified: bool,
    pub registered_at: u64,
}

#[contract]
pub struct VouchContract;

const TTL_THRESHOLD: u32 = 100;
const TTL_EXTEND: u32 = 6_307_200;

fn assert_initialized(env: &Env) {
    if !env.storage().instance().has(&DataKey::Initialized) {
        panic!("not initialized");
    }
}

fn assert_admin(env: &Env, caller: &Address) {
    let admin: Address = env
        .storage()
        .instance()
        .get(&DataKey::Admin)
        .expect("not initialized");
    if &admin != caller {
        panic!("unauthorized");
    }
}

fn assert_ambassador(env: &Env, caller: &Address) {
    if !env.storage().instance().has(&DataKey::Ambassador(caller.clone())) {
        panic!("unauthorized");
    }
}

fn bump_vouch_count(env: &Env, target: &Address) {
    let key = DataKey::VouchCount(target.clone());
    let current = env
        .storage()
        .persistent()
        .get::<DataKey, u32>(&key)
        .unwrap_or(0);
    let next = current + 1;

    env.storage().persistent().set(&key, &next);
    env.storage()
        .persistent()
        .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);
}

#[contractimpl]
impl VouchContract {
    pub fn init(env: Env, ambassador: Address) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("already initialized");
        }

        env.storage().instance().set(&DataKey::Admin, &ambassador);
        env.storage()
            .instance()
            .set(&DataKey::Ambassador(ambassador.clone()), &true);
        env.storage().instance().set(&DataKey::Initialized, &true);
    }

    pub fn add_ambassador(env: Env, admin: Address, ambassador: Address) {
        admin.require_auth();
        assert_initialized(&env);
        assert_admin(&env, &admin);

        env.storage()
            .instance()
            .set(&DataKey::Ambassador(ambassador), &true);
    }

    pub fn remove_ambassador(env: Env, admin: Address, ambassador: Address) {
        admin.require_auth();
        assert_initialized(&env);
        assert_admin(&env, &admin);

        if ambassador == admin {
            panic!("cannot remove admin");
        }

        env.storage()
            .instance()
            .remove(&DataKey::Ambassador(ambassador));
    }

    pub fn is_ambassador(env: Env, ambassador: Address) -> bool {
        env.storage()
            .instance()
            .has(&DataKey::Ambassador(ambassador))
    }

    pub fn register_identity(
        env: Env,
        ambassador: Address,
        target: Address,
        hashed_rin: BytesN<32>,
    ) {
        ambassador.require_auth();
        assert_initialized(&env);
        assert_ambassador(&env, &ambassador);

        let record = IdentityRecord {
            hashed_rin,
            verified: false,
            registered_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Identity(target.clone()), &record);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Identity(target), TTL_THRESHOLD, TTL_EXTEND);
    }

    pub fn set_verified(env: Env, ambassador: Address, target: Address, verified: bool) {
        ambassador.require_auth();
        assert_initialized(&env);
        assert_ambassador(&env, &ambassador);

        let mut record: IdentityRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Identity(target.clone()))
            .expect("not registered");

        record.verified = verified;

        env.storage()
            .persistent()
            .set(&DataKey::Identity(target.clone()), &record);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Identity(target), TTL_THRESHOLD, TTL_EXTEND);
    }

    pub fn is_verified(env: Env, target: Address) -> bool {
        env.storage()
            .persistent()
            .get::<DataKey, IdentityRecord>(&DataKey::Identity(target))
            .map(|r| r.verified)
            .unwrap_or(false)
    }

    pub fn get_identity(env: Env, target: Address) -> IdentityRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Identity(target))
            .expect("not registered")
    }

    pub fn vouch(env: Env, ambassador: Address, target: Address, hashed_rin: BytesN<32>) {
        ambassador.require_auth();
        assert_initialized(&env);
        assert_ambassador(&env, &ambassador);

        let key = DataKey::Vouch(target.clone(), ambassador.clone());
        if env.storage().persistent().has(&key) {
            panic!("already vouched by this ambassador");
        }

        let record = VouchRecord {
            ambassador: ambassador.clone(),
            target: target.clone(),
            hashed_rin,
            vouched_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);

        bump_vouch_count(&env, &target);
    }

    pub fn is_vouched(env: Env, target: Address) -> bool {
        Self::get_vouch_count(env, target) > 0
    }

    pub fn get_vouch_count(env: Env, target: Address) -> u32 {
        env.storage()
            .persistent()
            .get::<DataKey, u32>(&DataKey::VouchCount(target))
            .unwrap_or(0)
    }

    pub fn get_vouch(env: Env, target: Address, ambassador: Address) -> VouchRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Vouch(target, ambassador))
            .expect("not vouched")
    }
}

mod test;
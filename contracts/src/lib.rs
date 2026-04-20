#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct RefulinkContract;

#[contractimpl]
impl RefulinkContract {
    pub fn hello(env: Env, to: Symbol) -> Symbol {
        // Simple hello world for testing the setup
        Symbol::new(&env, "hello")
    }
}

mod test;

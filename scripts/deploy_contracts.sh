#!/bin/bash
# Deploy Soroban contracts to testnet

echo "Building contracts..."
cd contracts
cargo build --target wasm32-unknown-unknown --release

echo "Deploying..."
# Example command:
# soroban contract deploy --wasm target/wasm32-unknown-unknown/release/refulink_contracts.wasm --source dev-account --network testnet

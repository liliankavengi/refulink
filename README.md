# Refulink

Refulink is a monorepo project integrating Django, React Native, and Soroban (Stellar) smart contracts.

## Project Structure

- `backend/`: Django API (Identity, Wallet, Stellar Integration, M-Pesa).
- `frontend/`: React Native mobile application.
- `contracts/`: Soroban smart contracts (Rust).
- `docs/`: Project documentation.
- `scripts/`: Development and deployment scripts.

## Getting Started

1. Clone the repository.
2. Copy `.env.example` to `.env` and configure accordingly.
3. Check `docs/setup.md` for specific environment instructions.

## CI/CD

Workflows are located in `.github/workflows/`.

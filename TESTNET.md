# Reproduce the baseline and evidence channels

Contract `CDX54N62Q34SAVIWGQWDUDHEHKQWWU2MG5SLCA5JAA425RB2X2JSNPVZ`

P29 baseline Wasm SHA-256 `15971188b3a19ddbcb40ebf197c1c1e4f9063544169c62ee1c84a49d9c62c66b` (545 optimized bytes). Initial build: CLI 28.1.0, Rust 1.97.1, SDK 29.0.1.

- Upload Ed25519 baseline: `9df7e0d7b37bb73d5402b726d1286764ae824c690c2a35ffbdf88d816c655ac1` — confirmed SUCCESS
- Deploy Ed25519 baseline: `677ade4e79b740d98d7957228f7dec0f21b0c0c23780115e5f47a13794647e3d` — confirmed SUCCESS
- Verify Ed25519 baseline: `d9b592c1a1308db9f21839a651cda8b228ba100b45b730cedab9783f3d6229e9` — confirmed SUCCESS

The deployment exports only `ed`. One valid signature verification was submitted and confirmed. Separate RPC simulations retain a positive Ed25519 resource observation and a changed-message rejection. The observed network protocol was 29, so no ML-DSA testnet run was attempted. ML-DSA verification and default host-budget observations are from the local SDK 30.0.0-rc.1 / host 30.0.0; offline microseconds are from Node crypto/OpenSSL. Neither is a network measurement.

```sh
stellar contract build --locked --manifest-path quantumbench-contracts/Cargo.toml --out-dir build
QUANTUMBENCH_ALLOW_TESTNET=1 \
QUANTUMBENCH_PILOT_DIR=/absolute/private/path/outside/backend \
QUANTUMBENCH_WASM=/absolute/path/build/quantumbench_verifier.wasm \
node quantumbench-backend/pilot-testnet.mjs
node quantumbench-backend/verify-testnet.mjs
```

The pilot is opt-in, uses Friendbot testnet identities and updates public evidence/specimen files. Never publish its private directory. `verify-testnet.mjs` checks public receipt success, currently available deployed Wasm and retained XDR consistency, then reruns local conformance. It does not authenticate historical RPC transcripts or independently certify the cryptography.

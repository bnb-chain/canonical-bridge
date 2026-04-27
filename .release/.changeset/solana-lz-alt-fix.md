---
"@bnb-chain/canonical-bridge-sdk": patch
---

Fix Solana → EVM LayerZero CAKE transfer failing with `VersionedTransaction too large: 1684 bytes (max: 1232)`. The LayerZero OFT send instruction on Solana references many protocol accounts (Endpoint / Send Library / Executor / DVNs / Treasury); after a recent LayerZero-side update to the pathway's security stack, the cumulative account list pushed the serialized transaction over Solana's 1232-byte limit. The adapter now attaches LayerZero's default Solana mainnet Address Lookup Table (`AokBxha6VMLLgf97B5VYHEtqztamWmYERBmmFvjuTzJB`) via `setAddressLookupTables` in the UMI transaction builder, compressing each referenced account from 32 bytes to a 1-byte index and bringing the transaction comfortably under the limit.

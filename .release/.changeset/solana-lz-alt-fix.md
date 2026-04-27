---
"@bnb-chain/canonical-bridge-sdk": patch
---

Fix LayerZero Solana → EVM transfers (e.g. CAKE) failing with `VersionedTransaction too large` on Solana. The OFT send instruction references many protocol accounts (Endpoint, Send Library, Executor, DVNs, Treasury), and recent LayerZero security-stack updates pushed the serialized transaction past Solana's 1232-byte limit. The adapter now attaches LayerZero's official Solana mainnet Address Lookup Table via `setAddressLookupTables` in the UMI transaction builder, shrinking each referenced account from 32 bytes to a 1-byte index and keeping the transaction within the limit.

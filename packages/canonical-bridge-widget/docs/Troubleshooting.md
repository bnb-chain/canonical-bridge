# Troubleshooting

This document records non-obvious incidents and fixes that affected the canonical bridge in production. Each entry should explain the symptom, the root cause, and the fix, so that future maintainers can recognize a recurrence quickly.

## Solana → EVM LayerZero transfer fails with "VersionedTransaction too large"

**Affected packages:** `@bnb-chain/canonical-bridge-sdk` (LayerZero adapter)
**Affected pathway:** Solana → EVM LayerZero OFT (CAKE)
**Reported:** 2026-04-25

### Symptom

When sending CAKE from Solana to an EVM chain via LayerZero, the transaction fails at simulation with:

```
Error: Failed to send Solana token: Error: Simulation failed.
Message: base64 encoded solana_transaction::versioned::VersionedTransaction too large:
1684 bytes (max: encoded/raw 1644/1232).
```

The same flow worked previously without any code change on our side.

### Root cause

Solana enforces a hard 1232-byte limit on the raw size of a single transaction. The LayerZero OFT `send` instruction has to reference many protocol-side accounts: Endpoint, Send Library, Executor, the configured DVNs, Treasury, and so on. Each account address takes 32 bytes when written directly into the transaction.

LayerZero periodically updates the pathway's security stack (e.g., adding a new DVN or rotating the executor). Each additional account adds 32 bytes. The previous SDK build did **not** apply an Address Lookup Table (ALT) when building the Solana transaction, so as long as the account list stayed small enough the transaction fit under 1232 bytes. After a recent LayerZero-side update to the pathway, the cumulative account list crossed that threshold and every send failed at serialization — even though nothing on our side had changed. This is the regression mode behind this incident.

### Fix

LayerZero publishes an official default Address Lookup Table on Solana mainnet:

```
AokBxha6VMLLgf97B5VYHEtqztamWmYERBmmFvjuTzJB
```

It already contains all of the protocol accounts that the OFT send instruction references. Once the ALT is attached to the transaction, each referenced account is compressed from 32 bytes to a 1-byte index, bringing the transaction comfortably back under the 1232-byte limit.

The fix is in `packages/canonical-bridge-sdk/src/adapters/layerZero/index.ts`, inside `LayerZero.sendSolana`:

```ts
const lookupTable = await fetchAddressLookupTable(
  umi,
  toUmiPublicKey(LZ_SOLANA_MAINNET_LOOKUP_TABLE),
);

const transaction = transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1000n }))
  .add(setComputeUnitLimit(umi, { units: 500000 }))
  .add([instruction])
  .setAddressLookupTables([
    { publicKey: lookupTable.publicKey, addresses: lookupTable.addresses },
  ]);
```

Note: the umi `publicKey` helper is imported as `toUmiPublicKey` to avoid shadowing by the local `publicKey` variable destructured from `getSolanaPublicKeys` inside `sendSolana`.

### Verification

Successful Solana → EVM CAKE transfer with the patched build:

https://layerzeroscan.com/tx/3Vc5ZaFf2ksg61e4GknNWFtTharomoYJsEnEQPjioJgDqix4uFLA3a5yKzX7T2F3o5TKWC1Ph6UYfTzCAk3PPkoy

### Future-proofing notes

- If we ever support **Solana devnet**, add the testnet ALT (`9thqPdbR27A1yLWw2spwJLySemiGMXxPnEvfmXVk4KuK`) and pick by endpoint id. The constant currently hardcodes mainnet only.
- LayerZero's official `oft.quote` accepts `lookupTableAddresses` as a 6th argument. Passing it there as well brings the quote path in line with the official sample. Not strictly required to fix the size error, but worth doing for parity.
- For more accurate compute-unit pricing on a congested network, follow LayerZero's `addComputeUnitInstructions` pattern (read recent prioritization fees, simulate to estimate CU, then scale). The current values (`microLamports: 1000n`, `units: 500000`) are static.

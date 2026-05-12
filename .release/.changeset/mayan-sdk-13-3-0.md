---
"@bnb-chain/canonical-bridge-sdk": patch
"@bnb-chain/canonical-bridge-widget": patch
---

Upgrade `@mayanfinance/swap-sdk` from `~10.6.1` to `~13.3.0`. The only reachable breaking change is that `getSwapFromEvmTxPayload` is now async, so the EVM swap path in the Mayan adapter now `await`s the tx payload before sending. New chains (`hypercore`, `sonic`, `hyperevm`, `fogo`, `ton`, `monad`) and quote types (`MONO_CHAIN`) added by the SDK are forward-compatible without code changes.

# multichain-bridge


## Release steps

A complete development cycle is shown in the following steps:

1. Create a new branch out of `main` branch
2. Make some changes, fix bugs or add new features
3. Run `pnpm changeset` to create a new changeset for publishing a new version
4. Commit the code and create a new PR to the `main branch` (`alpha branch` for alpha version), after code review, merge this PR
5. Then [github action](https://github.com/bnb-chain/multichain-bridge/actions) will automatically execute
   and create a new [release PR](https://github.com/bnb-chain/multichain-bridge/pulls), merge this PR, a new
   version will be released

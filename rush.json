{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush.schema.json",
  "rushVersion": "5.124.0",
  "pnpmVersion": "9.3.0",
  "pnpmOptions": {
    "useWorkspaces": true
  },
  "nodeSupportedVersionRange": ">=14.15.0 <17.0.0 || >18.0.0 <21.0.0",
  "gitPolicy": {},
  "repository": {
    "url": "https://github.com/bnb-chain/canonical-bridge",
    "defaultBranch": "main",
    "defaultRemote": "origin"
  },
  "eventHooks": {
    "preRushInstall": [],
    "postRushInstall": [
      "node common/scripts/post-rush-install.js",
      "find ./common -name node_gyp_bins -type d -exec rm -r '{}' \\;",
      "cd .release && npm install && cd -"
    ],
    "preRushBuild": [],
    "postRushBuild": []
  },
  "projects": [
    {
      "packageName": "@bnb-chain/eslint-config",
      "projectFolder": "packages/eslint-config"
    },
    {
      "packageName": "@bnb-chain/prettier-config",
      "projectFolder": "packages/prettier-config"
    },
    {
      "packageName": "@bnb-chain/icons",
      "projectFolder": "packages/icons"
    },
    {
      "packageName": "@bnb-chain/space",
      "projectFolder": "packages/space"
    },
    {
      "packageName": "@bnb-chain/canonical-bridge-sdk",
      "projectFolder": "packages/canonical-bridge-sdk"
    },
    {
      "packageName": "@bnb-chain/canonical-bridge-widget",
      "projectFolder": "packages/canonical-bridge-widget"
    },
    {
      "packageName": "canonical-bridge-server",
      "projectFolder": "apps/canonical-bridge-server"
    },
    {
      "packageName": "canonical-bridge-ui",
      "projectFolder": "apps/canonical-bridge-ui"
    }
  ]
}

![](https://github.com/fission-suite/PROJECTNAME/raw/master/assets/logo.png?sanitize=true)

# Ghost Storage Adapter for InterPlanetary File System (IPFS)

A storage adapter for the Ghost blogging platform, so that files and images are stored on IPFS.

Meant to work alongside [heroku-ipfs-ghost](https://github.com/fission-suite/heroku-ipfs-ghost).

See the [Fission Talk Forum for background](https://talk.fission.codes/t/fission-ipfs-storage-adapter-for-ghost-blog/88)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/fission-suite/blob/master/LICENSE)
[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes)
[![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq)
[![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)


# Config:
1. Place the storage adapter into `content/adapters/storage/ghost-storage-adapter-ipfs/`
2. Add the following to your Ghost config file

```json
{
    "storage": {
        "active": "ghost-storage-adapter-ipfs",
        "ghost-storage-adapter-ipfs": {
            "username": "fission-user",
            "password": "fission-user-pass"
        }
    }
}
```
3. Provide optional arguments
 * `apiURL` String: Fission Web API compatible URL (default deferred to fission-suite/client),
 * `gatewayURL` String: IPFS gateway compatible URL (defaults to https://ipfs.io/ipfs)

That's it, you should be ready to start storing your Ghost images on IPFS!
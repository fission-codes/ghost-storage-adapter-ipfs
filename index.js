'use strict';

const BaseAdapter = require("ghost-storage-base");
const { readFile, authenticate, normalizeURL } = require("./utils");

const DEFAULT_IPFS_GATEWAY = "https://ipfs.io/ipfs";

class FissionStorageAdapter extends BaseAdapter{
  constructor(options) {
    const { username, password, apiURL, gatewayURL } = options;
    super();
    
    this.fissionUser = authenticate(username, password, apiURL);
    
    if(typeof gatewayURL === "string") {
      this.gatewayURL = normalizeGatewayURL(gatewayURL);
    } else {
      this.gatewayURL = DEFAULT_IPFS_GATEWAY;
    }
  }

  save(image) {
    return new Promise(async (resolve, reject) => {
      try {
        const bytes = await readFile(image.path);
        const cid = await this.fissionUser.add(bytes);
        await this.fissionUser.pin(cid);
        resolve(`${this.gatewayURL}/${cid}`);
      } catch(err) {
        reject(err);
      }
    });
  }

  serve() {
    return (req, res, next) => {
      next();
    }
  }

  exists() {
    return Promise.reject('FissionStorageAdapter.exists() not yet implemented');
  }

  delete() {
    return Promise.reject('FissionStorageAdapter.delete() not yet implemented');
  }
  
  read() {
    return Promise.reject('FissionStorageAdapter.read() not yet implemented');
  }
}

module.exports = FissionStorageAdapter;
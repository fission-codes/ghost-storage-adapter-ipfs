'use strict';

const BaseAdapter = require("ghost-storage-base");
const { readFile, authenticate } = require("./utils");

class FissionStorageAdapter extends BaseAdapter{
  constructor(options) {
    const { username, password, baseURL } = options;
    super();
    this.fissionUser = authenticate(username, password, baseURL);
  }

  save(image) {
    return new Promise(async (resolve, reject) => {
      try {
        const bytes = await readFile(image.path);
        const cid = await this.fissionUser.add(bytes);
        await this.fissionUser.pin(cid);
        resolve(this.fissionUser.url(cid));
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
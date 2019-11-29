'use strict';

const Fission = require("@fission-suite/client");
const BaseAdapter = require("ghost-storage-base");
const path = require("path");
const fs = require("fs");

const username = process.env.FISSION_USERNAME;
const password = process.env.FISSION_PASSWORD;

if(!username) {
  throw new Error("Missing Environment Variable: FISSION_USERNAME");
}

if(!password) {
  throw new Error("Missing Environment Variable: FISSION_PASSWORD");
}

const fission = new Fission();
const fissionUser = new Fission.FissionUser(username, password);

let cids;
(async () => {
  try {
    cids = await fissionUser.cids();
    console.log(cids);
  } catch (err) {
    throw new Error("Authentication Error\n" + JSON.stringify(err,null,"  "));
  }
})();

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, bytes) => {
      if(err) {
        reject(err);
      } else {
        resolve(bytes);
      }
    });
  });
}

class FissionStorageAdapter extends BaseAdapter{
  constructor() {
    super();
  }
  
  exists(fileName, targetDir) {
    console.log(fileName);
    console.log(targetDir);
    return Promise.reject('exists not implemented');
    // Only relevant if double pinning is problematic?
  }

  /**
   * Saves the image to storage (the file system)
   * - image is the express image object
   * - returns a promise which ultimately returns the full url to the uploaded image
   *
   * @param image
   * @param targetDir
   * @returns {*}
   */
  save(image, targetDir) {
    return new Promise(async (resolve, reject) => {
      let bytes;
      try {
        const filePath = path.join(image.path,targetDir);
        bytes = await readFile(filePath);
      } catch {
        reject(err);
      }
      
      try {
        const cid = await fissionUser.add(bytes);
        await fissionUser.pin(cid);
        resolve(fission.url(cid));
      } catch(err) {
        reject(err);
      }
    })
  }

  serve() {
    return function customServe(req, res, next) {
      next();
    }
  }

  delete(fileName, targetDir) {
    console.log(fileName);
    console.log(targetDir);
    return Promise.reject('delete not implemented');
    // How to access from fileName/targetDir
    // return fissionUser.remove(cid);
  }

  read(options) {
    const cid = options.path.split("/").pop();
    return fission.content(cid);
  }
}

module.exports = FissionStorageAdapter;
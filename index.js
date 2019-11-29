'use strict';

const Fission = require("@fission-suite/client");
const BaseAdapter = require("ghost-storage-base");
const fs = require("fs");

const username = process.env.FISSION_USERNAME;
const password = process.env.FISSION_PASSWORD;

if(!username) {
  throw new Error("Missing Environment Variable: FISSION_USERNAME");
}

if(!password) {
  throw new Error("Missing Environment Variable: FISSION_PASSWORD");
}

const fission = new Fission.default();
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
  constructor(options) {
    super(options);
    this.options = options || {};
  }
  
  exists(fileName, targetDir) {
    console.log(fileName);
    console.log(targetDir);
    return Promise.reject('exists not implemented');
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
    console.log(JSON.stringify(image,null," "));
    console.log(JSON.stringify(targetDir,null," "));
    
    return new Promise(async (resolve, reject) => {
      try {
        const bytes = await readFile(image.path);
        const cid = await fissionUser.add(bytes);
        await fissionUser.pin(cid);
        resolve(fission.url(cid));
      } catch(err) {
        reject(err);
      }
    });
  }
  
  serve() {
    return function customServe(req, res, next) {
      console.log(JSON.stringify(req,null," "));
      next();
    }
  }
  
  delete(fileName, targetDir) {
    console.log(fileName);
    console.log(targetDir);
    return Promise.reject('delete not implemented');
  }
  
  read(options) {
    console.log(JSON.stringify(options,null," "));

    const cid = options.path.split("/").pop();
    return fission.content(cid);
  }
}

module.exports = FissionStorageAdapter;
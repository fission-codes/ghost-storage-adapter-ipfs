'use strict';

const Fission = require("@fission-suite/client");
const fs = require("fs");

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

const connectionSuccessMessage = (username, numFiles) => {
  console.log(`
Fission Storage Adapter: Successfully Connected
  * Logged in as ${username}
  * Currently hosting ${numFiles} files
  `);
}
  
const authenticate = (username, password, baseURL) => {
  let fissionUser;
  if(!username) {
    throw new Error("Missing Environment Variable: FISSION_USERNAME");
  }
  
  if(!password) {
    throw new Error("Missing Environment Variable: FISSION_PASSWORD");
  }
  
  if(!baseURL) {
    fissionUser = new Fission.FissionUser(username, password);
  } else {
    fissionUser = new Fission.FissionUser(username, password, baseURL);
  }
  
  (async () => {
    try {
      const cids = await fissionUser.cids();
      connectionSuccessMessage(username, cids.length);
    } catch (err) {
      throw new Error("Authentication Error\n" + JSON.stringify(err,null,"  "));
    }
  })();

  return fissionUser;
}

module.exports = { readFile, authenticate }
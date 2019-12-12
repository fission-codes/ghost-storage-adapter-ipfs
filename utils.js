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
  
const authenticate = (username, password, apiURL) => {
  let fissionUser;
  if(!username) {
    throw new Error("Missing Environment Variable: FISSION_USERNAME");
  }
  
  if(!password) {
    throw new Error("Missing Environment Variable: FISSION_PASSWORD");
  }
  
  if(!apiURL) {
    fissionUser = new Fission.FissionUser(username, password);
  } else {
    fissionUser = new Fission.FissionUser(username, password, normalizeURL(apiURL));
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

const normalizeURL = (gatewayURL) => {
  let normalized = gatewayURL.trim();
  
  // Ensure protocol
  if(!normalized.includes("://")) {
    normalized = "https://" + normalized;
  }

  // Remove queries
  normalized = normalized.split("?")[0];
  
  // Remove hashes
  normalized = normalized.split("#")[0];

  // Remove trailing slash
  if(normalized.endsWith("/")) {
    normalized = normalized.slice(0,-1);
  }

  return normalized;
}

module.exports = { readFile, authenticate, normalizeURL }
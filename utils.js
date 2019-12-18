'use strict';

const Fission = require("@fission-suite/client");
const fs = require("fs");
const { DEFAULT_IPFS_GATEWAY_URL } = require("./constants");

const normalizeURL = (rawURL) => {
  let normalized = rawURL.trim();
  
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

  console.log(`Normalized URL from ${rawURL} to ${normalized}`);
  return normalized;
}

const normalizeGatewayURL = (rawURL) => {
  let normalized = normalizeURL(rawURL);

  // Strip ipfs path
  if(normalized.endsWith("/ipfs")) {
    normalized = normalized.slice(0,-5);
  }

  return normalized;
}

const configGatewayURL = (rawURL) => {
  if(typeof rawURL === "string") {
    return normalizeGatewayURL(rawURL);
  } else {
    return DEFAULT_IPFS_GATEWAY_URL;
  }
}


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

const ensureUserAuth = (fissionUser) => {
  (async () => {
    try {
      console.log("Ensuring Fission User")
      const cids = await fissionUser.cids();
      connectionSuccessMessage(username, cids.length);
    } catch (err) {
      throw new Error("Authentication Error\n" + JSON.stringify(err,null,"  "));
    }
  })();
}

const configFissionUser = (username, password, apiURL) => {
  let fissionUser;
  if(!username) {
    throw new Error("Missing option: 'username'");
  }
  
  if(!password) {
    throw new Error("Missing option: 'password'");
  }
  
  if(!apiURL) {
    console.log("Fission User:",username,password);
    fissionUser = new Fission.FissionUser(username, password);
  } else {
    console.log("Fission User:",username,password,apiURL,normalizeURL(apiURL));
    fissionUser = new Fission.FissionUser(username, password, normalizeURL(apiURL));
  }

  (async () => {
    const verified = await Fission.verify({username,password});
    console.log("Verify:",verified)

  })();
  ensureUserAuth(fissionUser);

  return fissionUser;
}

module.exports = { readFile, configFissionUser, configGatewayURL }
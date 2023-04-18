import axios from "axios";
import appLink from "./urls";

const qs = require("qs");



function getNetworks() { 
  var config = {
    method: "GET",
    url: appLink.API_URL + 'bridgeserver-lfi/chains'  
  };
  return axios(config);
}

function getGasBsc() { 
  var config = {
    method: "GET",
    url: 'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=VJN565NH8S8FHIW6T6N1X7NMUMT44S9CYA'  
  };
  return axios(config);
}

function getGasEth() { 
  var config = {
    method: "GET",    
    url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=XE3P41TK181T2CM38KVIJ341BZ9E614X8D'  
  };
  return axios(config);
}

function getGasPolygon() { 
  var config = {
    method: "GET",    
    url: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=DN1HGWIX86Q65DTTX43UQGGJF6A3AC85R5'  
  };
  return axios(config);
}

function getBridgeTransactions(walletAddress) { 
  var config = {
    method: "GET",    
    url: appLink.API_URL + 'bridgeserver-lfi/transactions?fromAddress='+walletAddress 
  };
  return axios(config);
}

function getTxStatus(hash) { 
  var config = {
    method: "GET",    
    url: appLink.API_URL + 'bridgeserver-lfi/transactions/'+hash 
  };
  return axios(config);
}

function getTokenDetails() { 
  var config = {
    method: "GET",    
    url: 'https://openapi.lyotrade.com/sapi/v1/ticker?symbol=lyo1usdt'
  };
  return axios(config);
}


const ApiCalls = { 
  getNetworks: getNetworks,
  getGasBsc: getGasBsc,
  getGasEth: getGasEth,
  getGasPolygon: getGasPolygon,
  getBridgeTransactions: getBridgeTransactions,
  getTxStatus : getTxStatus,
  getTokenDetails: getTokenDetails
};

export default ApiCalls;

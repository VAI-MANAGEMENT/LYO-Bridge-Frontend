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

// function getGasBsc() { 
//   var config = {
//     method: "GET",
//     url: 'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=VJN565NH8S8FHIW6T6N1X7NMUMT44S9CYA'  
//   };
//   return axios(config);
// }

// function getGasEth() { 
//   var config = {
//     method: "GET",    
//     url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=XE3P41TK181T2CM38KVIJ341BZ9E614X8D'  
//   };
//   return axios(config);
// }

// function getGasPolygon() { 
//   var config = {
//     method: "GET",    
//     url: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=DN1HGWIX86Q65DTTX43UQGGJF6A3AC85R5'  
//   };
//   return axios(config);
// }

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
const getGasBsc = () => {
  var config = {
      method: "GET",
      url: 'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=VJN565NH8S8FHIW6T6N1X7NMUMT44S9CYA'
  };
  return axios(config);
}

const getGasEth = () => {
  var config = {
      method: "GET",
      url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=XE3P41TK181T2CM38KVIJ341BZ9E614X8D'
  };
  return axios(config);


}

const getGasAvalanche = () => {
  var config = {
      method: "GET",
      url: 'https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice&apikey=2T3U9K3I9MWCMFTMJSJEQZ91H36NAETDP6'
  };
  return axios(config);
}

const getGasFantom = () => {
  var config = {
      method: "GET",
      url: 'https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=8VFIRUASQKP2HTETCNG5FG8FJD9HFRRVQC'
  };
  return axios(config);
}

const getGasPolygon = () => {
  var config = {
      method: "GET",
      url: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=DN1HGWIX86Q65DTTX43UQGGJF6A3AC85R5'
  };
  return axios(config);
}

async function getGasFee(networkChainId) {
  let gas; 
  if (networkChainId == 97) {
      const response = await getGasBsc();
      gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 80001) {
      const response = await getGasPolygon();
      gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 11155111) {
      const response = await getGasEth();
      gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 4002) {
      const response = await getGasFantom();
      gas = response.data.result.SafeGasPrice;

  }

  if (networkChainId == 43113) {
      const response = await getGasAvalanche();
      gas = response.data.result;
      // const totalGas = ((21000 * parseInt(gas)) / 10 ** 9).toFixed(5);
      // return totalGas

  }

  //  totalFee = units of gas used * (base fee + priority fee)
  // const totalGas = ((21000 * parseInt(gas)) / 10 ** 9).toFixed(5);
  return gas;

}


const ApiCalls = { 
  getNetworks: getNetworks,
  // getGasBsc: getGasBsc,
  // getGasEth: getGasEth,
  // getGasPolygon: getGasPolygon,
  getBridgeTransactions: getBridgeTransactions,
  getTxStatus : getTxStatus,
  getTokenDetails: getTokenDetails,
  getGasFee:getGasFee
};

export default ApiCalls;

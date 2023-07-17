import axios from "axios";
import appLink from "./urls";
import appUtils from "./appUtils";



const qs = require("qs");

function getNetworks() {
  var config = {
    method: "GET",
    url: '/api/networks'
  };
  return axios(config);
}

function getBridgeTransactions(walletAddress) {
  var config = {
    method: "GET",
    url: 'api/transactionList?fromAddress=' + walletAddress
  };
  return axios(config);
}

const getBridgeFee = (chainID,tokenSymbol) => {
  var config = {
    method: "GET",
    url: 'api/getBridgeFee?chainID='+ chainID+'&tokenSymbol='+tokenSymbol 
  };
  return axios(config);
}

function exportTransactions(walletAddress) {
  var config = {
    method: "GET",
    url: 'api/exportTransactions?fromAddress=' + walletAddress
  };
  return axios(config);
}

function getTxStatus(id) {
  var config = {
    method: "GET",
    url: 'api/transactionStatus?transactionId=' + id
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


const generateHashKey = async (requestBody) => { 
  const hashKey = await appUtils.hash256(requestBody);   
  return hashKey;
}

async function saveTransaction(transactionHash, chainID, tokenAddress, bridgeAddress, amount, platformFee, destinationFee, isNativeFee) {
  let data = qs.stringify({
    transactionHash: transactionHash,
    chainID: chainID,
    tokenAddress: tokenAddress,
    bridgeAddress: bridgeAddress,
    amount: amount,
    platformFee : platformFee,
    destinationFee : destinationFee,
    isNativeFee : isNativeFee
  });

  let headerKey = await generateHashKey(data)  
  var config = {
    method: "POST",
    url: 'api/saveTransaction',
    data: data,
    headers: {
      'x-api-key': headerKey
  },
  };

  if(headerKey){
    return axios(config);
  }

  
}

async function getGasFee(networkChainId) {
  let gas;
  if (networkChainId == 97 || networkChainId == 56) {
    const response = await getGasBsc();
    gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 80001 || networkChainId == 137) {
    const response = await getGasPolygon();
    gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 11155111 || networkChainId == 1) {
    const response = await getGasEth();
    gas = response.data.result.SafeGasPrice;
  }

  if (networkChainId == 4002 || networkChainId == 250) {
    const response = await getGasFantom();
    gas = response.data.result.SafeGasPrice;

  }

  if (networkChainId == 43113 || networkChainId == 43114) {
    const response = await getGasAvalanche();
    gas = response.data.result;
  }

  //  totalFee = units of gas used * (base fee + priority fee)
  // const totalGas = ((21000 * parseInt(gas)) / 10 ** 9).toFixed(5);
  return gas;

}


const ApiCalls = {
  getNetworks: getNetworks,
  getBridgeTransactions: getBridgeTransactions,
  getTxStatus: getTxStatus,
  getTokenDetails: getTokenDetails,
  getGasFee: getGasFee,
  saveTransaction: saveTransaction,
  exportTransactions : exportTransactions,
  getBridgeFee : getBridgeFee
};

export default ApiCalls;

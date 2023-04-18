import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import lfiABI from "./config/abis/lfi.json";
import mintingABI from "./config/abis/minting.json";
import tokenABI from "./config/abis/token.json";

const web3modalStorageKey = "WEB3_CONNECT_CACHED_PROVIDER";
const web3Modal = typeof window !== "undefined" && new Web3Modal({ cacheProvider: true });
const Web3 = require("web3");

const LFI_TOKEN_CONTRACT_ADDRESS = "0x5c9B04a46641aB50FE9CA27429071fC4aECb4648";
const STAKING_CONTRACT_ADDRESS = "0xf972c7ff4F7e9Fe85d0653Ec273346063b744a71";

export const web3eth = new Web3(Web3.givenProvider || "https://speedy-nodes-nyc.moralis.io/8ad94db66badc20da4925893/bsc/testnet");

const contractLFI = new web3eth.eth.Contract(lfiABI, LFI_TOKEN_CONTRACT_ADDRESS);
const contractMint = new web3eth.eth.Contract(mintingABI, STAKING_CONTRACT_ADDRESS);

async function checkConnection() {
  try {
    if (window && window.ethereum) {
      // Check if web3modal wallet connection is available on storage
      if (localStorage.getItem(web3modalStorageKey)) {
        await connectToWallet();
      }
    } else {
      console.log("window or window.ethereum is not available");
    }
  } catch (error) {
    console.log(error, "Catch error Account is not connected");
  }
}

const checkIfExtensionIsAvailable = () => {
  if ((window && window.web3 === undefined) || (window && window.ethereum === undefined)) {
    setError(true);
    Web3Modal && Web3Modal.toggleModal();
  }
};

const connectToWallet = async () => {
  try {
    checkIfExtensionIsAvailable();
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    await subscribeProvider(connection);

    return provider;
  } catch (error) {
    console.log(error, "got this error on connectToWallet catch block while connecting the wallet");
  }
};

const startMint = async (amount, account) => {
  let mintAmount = amount * 1e8;

  const result = await contractLFI.methods.approve(STAKING_CONTRACT_ADDRESS, mintAmount).send({ from: account });

  const result2 = await contractMint.methods.lockandmint(mintAmount).send({ from: account });
  console.log("mint result", result2);
};

async function getBalanceLfi(account) {
  // if (address && chainId == 97 && account) {
  const result = await contractLFI.methods.balanceOf(account).call();
  return result;
  // }
}

async function getBalanceWlfi(account) {
  // if (address && chainId == 97 && account) {
  const result = await contractMint.methods.balanceOf(account).call();
  return result;
  // }
}

async function amountToHarvest(account) {
  const result3 = await contractMint.methods.amountToHarvest(account).call({ from: account });

  return result3;
}

async function getTokenName(contract) {
  if (contract) {
    let result = await contract.methods.name().call();
    return result;
  }
}

export async function getTokenSymbol(contract) {
  if (contract) {
    let result = await contract.methods.symbol().call();
    return result;
  }
}

export async function getTokenDecimals(contract) {
  if (contract) {
    let result = await contract.methods.decimals().call();
    return result;
  }
}

async function getTokenBalance(contract, address) {
  if (contract && address) {
    let result = await contract.methods.balanceOf(address).call({ from: address });
    return result;
  }
}

async function getTokenData(tokenAddress, walletAddress) {
  let addressFormatted = Web3.utils.toChecksumAddress(tokenAddress);
  const tokenContract = new web3eth.eth.Contract(tokenABI, addressFormatted);

  let tokenName = await getTokenName(tokenContract);
  let tokenSymbol = await getTokenSymbol(tokenContract);
  let tokenDecimals = await getTokenDecimals(tokenContract);
  return { tokenName, tokenSymbol, tokenDecimals, tokenAddress, walletAddress };
}

async function getAllowance(contract, address) {
  if (address && process.env.ROUTER_TOKEN_ADDRESS) {
    try {
      let result = await contract.methods.allowance(address, process.env.ROUTER_TOKEN_ADDRESS).call({ from: address });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

async function importTokens(tokenAddress, tokenSymbol, tokenDecimal) {
  console.log("calling");
  if ((tokenAddress, tokenSymbol, tokenDecimal)) {
    const wasAdded = web3.currentProvider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimal,
        },
      },
    });
  }
}

async function getSoftwareRate(contract, softwareLicence, walletAddress) {
  try {
    return await contract.methods.licenseRecord(softwareLicence).call({ from: walletAddress });
  } catch (ex) {
    return ex;
  }
}

async function getTokenAllowance(contract, walletAddress, spenderAddress) {
  if (!contract || !walletAddress || !spenderAddress) return new Error("Missing parameters: contract or walletAddress or spenderAddress.");
  try {
    return await contract.methods.allowance(walletAddress, spenderAddress).call({ from: walletAddress });
  } catch (ex) {
    console.error(ex);
    return ex;
  }
}

async function getLicenceOwnership(contract, licence, walletAddress) {
  if (!contract || !licence) return new Error("Missing parameters: contract or licence");
  try {
    return await contract.methods.viewSoftwareBuy(licence, walletAddress).call({ from: walletAddress });
  } catch (ex) {
    console.error(ex);
    return ex;
  }
}

async function getRewards(contract, licence, walletAddress) {
  if (!contract || !licence) return new Error("Missing parameters: contract or licence");
  try {
    return await contract.methods.viewclaim(licence, walletAddress).call({ from: walletAddress });
  } catch (ex) {
    console.error(ex);
    return new Error(ex);
  }
}

async function addStake(contract, licence, amount, walletAddress) {
  if (!contract || !licence || !walletAddress || !amount)
    return new Error("Missing parameters: contract, licence, amount, or walletAddress");

  const TIME_FRAME = 60; // in seconds.
  try {
    return await contract.methods.Stake(licence, amount, TIME_FRAME).send({from: walletAddress});
  } catch (ex) {
    console.error(ex);
    return new Error(ex);
  }
}

async function claimRewards(contract, licence, walletAddress) {
  if (!contract || !licence || !walletAddress) return new Error("Missing parameters: contract, licence, or walletAddress");
  try {
    return await contract.methods.claim(licence).send({ from: walletAddress });
  } catch (ex) {
    console.error(ex);
    return new Error(ex);
  }
}

const Web3Calls = {
  connectToWallet: connectToWallet,
  startMint: startMint,
  getBalanceLfi: getBalanceLfi,
  getBalanceWlfi: getBalanceWlfi,
  amountToHarvest: amountToHarvest,
  getTokenName: getTokenName,
  getTokenSymbol: getTokenSymbol,
  getTokenDecimals: getTokenDecimals,
  getTokenBalance: getTokenBalance,
  getTokenData: getTokenData,
  getAllowance: getAllowance,
  importTokens: importTokens,
  getSoftwareRate: getSoftwareRate,
  getTokenAllowance: getTokenAllowance,
  getLicenceOwnership: getLicenceOwnership,
  getRewards: getRewards,
  addStake: addStake,
  claimRewards: claimRewards,
};

export default Web3Calls;

import { useEffect, useState, createContext, useContext } from "react";
import Web3Calls from "../utils/web3Calls";
import { WalletContext } from "./WalletConnect";
import routerABI from "../utils/config/abis/router.json";
import factoryABI from "../utils/config/abis/factory.json";
import tokenABI from "../utils/config/abis/token.json";

const Web3 = require("web3");
const web3eth = new Web3(Web3.givenProvider || "https://speedy-nodes-nyc.moralis.io/8ad94db66badc20da4925893/bsc/testnet");

export const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
  const [tokenIn, setTokenIn] = useState();
  const [tokenOut, setTokenOut] = useState();
  const [tokenAddressIn, setTokenAddressIn] = useState();
  const [tokenAddressOut, setTokenAddressOut] = useState();
  const [tokenInSymbol, setTokenInSymbol] = useState();
  const [tokenOutSymbol, setTokenOutSymbol] = useState();
  const [tokenInDecimals, setTokenInDecimals] = useState();
  const [tokenOutDecimals, setTokenOutDecimals] = useState();
  const [tokenInBalance, setTokenInBalance] = useState();
  const [tokenOutBalance, setTokenOutBalance] = useState();
  const [tokenInAllowance, setTokenInAllowance] = useState(0);
  const [tokenOutAllowance, setTokenOutAllowance] = useState(0);
  const [activeTokens, setActiveTokens] = useState([]);
  const [initialPair, setInitialPair] = useState([]);

  const { walletAddress, chainId } = useContext(WalletContext);

  const contractRouter = new web3eth.eth.Contract(routerABI, process.env.ROUTER_TOKEN_ADDRESS);
  const contractFactory = new web3eth.eth.Contract(factoryABI, process.env.FACTORY_TOKEN_ADDRESS);

  const tokenContractIn = tokenAddressIn ? new web3eth.eth.Contract(tokenABI, tokenAddressIn) : undefined;
  const tokenContractOut = tokenAddressOut ? new web3eth.eth.Contract(tokenABI, tokenAddressOut) : undefined;

  useEffect(() => {
    if (!tokenAddressIn || !tokenAddressOut) {
      setActiveTokens([]);
      localStorage.setItem("activeTokens", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (tokenAddressIn) {
      console.log(tokenAddressIn);
      Web3Calls.getTokenData(tokenAddressIn, walletAddress)
        .then((tokenData) => {
          setTokenIn(tokenData.tokenName);
          setTokenInSymbol(tokenData.tokenSymbol);
          setTokenInDecimals(tokenData.tokenDecimals);
          // let newActiveTokens = activeTokens.filter((active) => active.tokenAddress !== tokenData.tokenAddress);
          // localStorage.setItem("activeTokens", JSON.stringify([...newActiveTokens, tokenData]));
          // setActiveTokens([...newActiveTokens, tokenData]);
        })
        .catch((err) => console.error(err));

      Web3Calls.getTokenAllowance(tokenContractIn, walletAddress, process.env.ROUTER_TOKEN_ADDRESS)
        .then((allowance) => setTokenInAllowance(allowance))
        .catch((err) => console.error(err));
      Web3Calls.getTokenBalance(tokenContractIn, walletAddress)
        .then((balance) => {
          console.log(balance);
          setTokenInBalance((balance / 10 ** tokenInDecimals).toFixed(2));
        })
        .catch((err) => console.error(err));
    }
  }, [tokenAddressIn, tokenInDecimals]);

  useEffect(() => {
    if (tokenAddressOut) {
      Web3Calls.getTokenData(tokenAddressOut, walletAddress)
        .then((res) => {
          setTokenOut(res.tokenName);
          setTokenOutSymbol(res.tokenSymbol);
          setTokenOutDecimals(res.tokenDecimals);
          // let newActiveTokens = activeTokens.filter((active) => active.tokenAddress !== tokenData.tokenAddress);
          // localStorage.setItem("activeTokens", JSON.stringify([...newActiveTokens, tokenData]));
          // setActiveTokens([...newActiveTokens, tokenData]);
        })
        .catch((err) => console.error(err));

      Web3Calls.getTokenAllowance(tokenContractOut, walletAddress, process.env.ROUTER_TOKEN_ADDRESS)
        .then((allowance) => setTokenOutAllowance(allowance))
        .catch((err) => console.error(err));
      Web3Calls.getTokenBalance(tokenContractOut, walletAddress)
        .then((balance) => {
          console.log(balance);
          setTokenOutBalance((balance / 10 ** tokenOutDecimals).toFixed(2));
        })
        .catch((err) => console.error(err));
    }
  }, [tokenAddressOut, tokenOutDecimals]);

  useEffect(() => {
    if (tokenAddressIn && tokenAddressOut) getLP();
  }, [tokenAddressIn, tokenAddressOut]);

 

  async function getLP() {
    try {
      let result = await contractFactory.methods.getPair(tokenAddressIn, tokenAddressOut).call({ from: walletAddress });
      if (result == 0x0) setInitialPair(true);
    } catch (error) {
      console.error("getLP", error);
    }
  }

  return (
    <TokenContext.Provider
      value={{
        tokenIn,
        setTokenIn,
        tokenOut,
        setTokenOut,
        tokenAddressIn,
        setTokenAddressIn,
        tokenAddressOut,
        setTokenAddressOut,
        tokenInSymbol,
        setTokenInSymbol,
        tokenOutSymbol,
        setTokenOutSymbol,
        tokenInDecimals,
        setTokenInDecimals,
        tokenOutDecimals,
        setTokenOutDecimals,
        tokenInBalance,
        tokenOutBalance,
        tokenInAllowance,
        tokenOutAllowance,
        activeTokens,
        setActiveTokens,
        initialPair,
        setInitialPair,
        tokenContractIn,
        tokenContractOut,
        contractRouter,
        contractFactory,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

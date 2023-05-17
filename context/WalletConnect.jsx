import { useEffect, useState, createContext, ReactNode } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import swal from "sweetalert";
import mobileCheck from "../components/MobileCheck";
import getLinker from "../components/DeepLink";
import detectEthereumProvider from "@metamask/detect-provider";
import { providerOptions } from "../utils/config/providers";
import currencyABI from "../utils/config/abis/currency.json";

const web3modalStorageKey = "WEB3_CONNECT_CACHED_PROVIDER";

export const WalletContext = createContext({});

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chainId, setChainId] = useState();
  const [currencyBalance, setCurrencyBalance] = useState();

  var contractCurrencyUSDT = "0x6B4Ef01a6896543c3d96B688e39F5202d00C0f0A";

  const Web3 = require("web3");
  const web3eth = new Web3(
    Web3.givenProvider || "https://speedy-nodes-nyc.moralis.io/8ad94db66badc20da4925893/bsc/testnet"
  );

  let currencyContractWeb3 = new web3eth.eth.Contract(currencyABI, contractCurrencyUSDT);

  const web3Modal = typeof window !== "undefined" && new Web3Modal({ cacheProvider: true, providerOptions });

  useEffect(() => {
    if (address && chainId == process.env.chain_id) {
      // getCurrencyBalance();   
    }
  }, [address, currencyBalance]);

  /* This effect will fetch wallet address if user has already connected his/her wallet */
  useEffect(() => {
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
    checkConnection();
  }, []);

  useEffect(() => {
    if (Web3.givenProvider) {
      setChainId(Web3.givenProvider.networkVersion);    
    }
  }, [chainId]);

  // useEffect(() => {
  //   connectToWallet();
  // }, [])
  // useEffect(() => {
  //   if(chainId != process.env.chain_id && address ){
  //     console.log("chainid", chainId)
  //     // swal("Switching the network");
  //     switchNetwork()
  //   }
  // }, [chainId])

  async function getCurrencyBalance() {
    if (address) {
      try {
        var result = await currencyContractWeb3.methods.balanceOf(address).call({ from: address });
        result = (result / 10 ** 18).toFixed(2);

        setCurrencyBalance(result);
      } catch (error) {
        console.log("err", error);
      }
    }
  }

  // const provider = detectEthereumProvider();
  const setWalletAddress = async (provider) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
        if (Web3.givenProvider) {
          setChainId(Web3.givenProvider.networkVersion);
          // console.log("chain id"  ,chainId)
        }
      }
    } catch (error) {
      console.log("Account not connected; logged from setWalletAddress function");
    }
  };

  const getBalance = async (provider, walletAddress) => {
    const walletBalance = await provider.getBalance(walletAddress);
   
    const balanceInEth = ethers.utils.formatEther(walletBalance);
   
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = (userProvider) => {
    if(userProvider == "injected") {
      if ((window && window.web3 === undefined) || (window && window.ethereum === undefined)) {
        setError(true);
        web3Modal && web3Modal.toggleModal();
        swal("Please install Metamask plugin in your browser in order to connect wallet. ");
      }
    }
  };

  const connectToWallet = async (userProvider) => {
    // console.log("clicked")
    try {
      setLoading(true);

      checkIfExtensionIsAvailable(userProvider);
      const connection =
        web3Modal && (userProvider ? await web3Modal.connectTo(userProvider) : await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);

      setWalletAddress(provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error, "got this error on connectToWallet catch block while connecting the wallet");
    }
  };

  const mobileConnect = async () => {
    try {
      const yourWebUrl = "https://bridge.lyocredit.io/"; // Replace with your domain
      const deepLink = `https://metamask.app.link/dapp/${yourWebUrl}`;
      const downloadMetamaskUrl = "https://metamask.io/download.html";
      setLoading(true);
      if (mobileCheck()) {
        // Mobile browser
        const linker = getLinker(downloadMetamaskUrl);
        linker.openURL(deepLink);
      } else {
        window.open(downloadMetamaskUrl);
      }
    } catch (error) {
      console.error(error);
      setAddress("");
    }
  };

  // window.ethereum.on('networkChanged', function(networkId){
  //   console.log('networkChanged',networkId);
  // });

  if (Web3.givenProvider) {
    // console.log(Web3.givenProvider)
    Web3.givenProvider.on("chainChanged", function (networkId) {
      // switchNetwork();
      setChainId(networkId);
    });
  }

  const switchNetwork = async () => {  
    const currentChainId = chainId;

    if (currentChainId !== process.env.chain_id && Web3.givenProvider) {
      await web3.currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(process.env.chain_id) }],
      });
      // setNetworkStatus(true);
      await connectToWallet();
    }
  };

  const subscribeProvider = async (connection) => {
    connection.on("close", () => {
      disconnectWallet();
    });
    connection.on("accountsChanged", async (accounts) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress: address,
        balance,
        loading,
        error,
        connectToWallet,
        disconnectWallet,
        switchNetwork,
        chainId,
        mobileConnect,
        currencyBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

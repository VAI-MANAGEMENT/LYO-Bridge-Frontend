import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import logoSmall from "../public/logo-small.png";
import { Tooltip, changeTheme } from "@nextui-org/react";
import Moment from "react-moment";
import moment from 'moment';
import { BiDownload, BiInfoCircle, BiRefresh } from "react-icons/bi";
import { BsFillInfoCircleFill, BsQuestionCircle } from "react-icons/bs";
import InputComponent from "./InputComponent";
import { WalletContext } from "../context/WalletConnect";
import axios from "axios";
import { useAlert } from "react-alert";
const Web3 = require("web3");
import Web3Calls from "../utils/web3Calls";
import { CopyToClipboard } from "react-copy-to-clipboard";
import tokenABI from "../utils/config/abis/bridgeToken.json";
import bridgeABI from "../utils/config/abis/bridge.json";
import sideBridgeABI from "../utils/config/abis/sidebridge.json";
import CustomDropdown from "./CustomDropdown";
import ApiCalls from "../utils/apiCalls";
import ConnectWalletModal from "./ConnectWalletModal";
import Collapse from "react-bootstrap/Collapse";
import { FaArrowDown } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import MUIDataTable from "mui-datatables";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CgCopy } from "react-icons/cg";
import { BsArrowUpRightSquare, BsInfoCircle } from "react-icons/bs";
import TokenInfo from "./TokenInfo";

function BridgeComponent() {
  // const assetList = [
  //   {
  //     name: "LYO",
  //     symbol: "LYO",
  //     imageUrl: logoSmall,
  //     childTokenAddress: process.env.BRIDGE_MAIN_TOKEN_ADDRESS,
  //   },
  // ];

  const [key, setKey] = useState("bridge");
  const [tokenContract, setTokenContract] = useState();
  const [tokenSymbol, setTokenSymbol] = useState("LYO");
  const [tokenBalance, setTokenBalance] = useState();
  const [bridgeTokenBalance, setBridgeTokenBalance] = useState();
  const [tokenDecimals, setTokenDecimals] = useState(8);
  const [amount, setAmount] = useState(0);
  const [networkFrom, setNetworkFrom] = useState();
  const [assetList, setAssetList] = useState();
  const [networkTo, setNetworkTo] = useState();
  const [tokenAddressFrom, setTokenAddressFrom] = useState();
  const [tokenAddressTo, setTokenAddressTo] = useState();
  const [networks, setNetworks] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [gasOnDestination, setGasOnDestination] = useState();
  const [bridgeLoader, setBridgeLoader] = useState(false);
  const [txData, setTxData] = useState();
  const [show, setShow] = useState(false);
  const [fee, setFee] = useState();
  const [sideBridgeContractFrom, setSideBridgeContractFrom] = useState();
  const [selected, setSelected] = useState('');
  const [exportData, setExportData] = useState('');
  const [destinationFee, setDestinationFee] = useState();
  const [platformFee, setPlatformFee] = useState();
  const [totalBridgeFee, setTotalBridgeFee] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [feeLoader, setFeeLoader] = useState(false);


  const alert = useAlert();
  const { walletAddress, chainId, switchNetwork } = useContext(WalletContext);
  let web3eth = new Web3(
    Web3.givenProvider ||
    "https://solemn-summer-shadow.bsc-testnet.discover.quiknode.pro/1b0c85b08d945ae4d5838b5215d52e4aae37c21f/"
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let otherCopy;
  let assetLink = "https://testnet.bscscan.com/tx/";

  useEffect(() => {
    if (assetList) {
      getTokenContract();
      getSideBridgeContract();
      changeSymbol()
    }
  }, [walletAddress, chainId, selected, assetList, networkFrom]);

  useEffect(() => {
    if (assetList) {
      setTokenAddressFrom(assetList[0].address)
      setTokenSymbol(assetList[0].symbol)
    }

  }, [assetList, networkFrom]);

  useEffect(() => {
    getNetworks();
  }, []);

  // useEffect(() => {
  //   if (networkFrom) {
  //     getFee()
  //   }
  // }, [chainId, networkFrom, sideBridgeContractFrom]);

  useEffect(() => {
    getSideBridgeContract();
    setBridgeLoader(false);
  }, [networkFrom, networkTo]);

  useEffect(() => {
    if (walletAddress) {
      getTransactions();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (networkTo) {
      getGasFee(networkTo.chainID);
    }
  }, [networkTo]);

  useEffect(() => {
    if (networkFrom) {
      getTokenDetails(tokenContract);
    }

  }, [tokenContract, selected]);

  useEffect(() => {

    console.log("tokenBalance", tokenBalance)

  }, [tokenBalance]);


  // useEffect(() => {

  //   console.log("platformFee", platformFee)

  // }, [platformFee]);

  // useEffect(() => {

  //   console.log("receiveAmount", receiveAmount)

  // }, [receiveAmount]);

  // useEffect(() => {

  //   console.log("destinationFee", destinationFee)

  // }, [destinationFee]);

  useEffect(() => {

    renderActionButton();
    // getBridgeTokenBalance(networkFrom)
  }, [networkFrom]);

  useEffect(() => {
    if (networkTo) {
      getBridgeTokenBalance(networkTo)
    }

  }, [networkTo, chainId, selected, tokenSymbol, networkFrom, networks]);

  useEffect(() => {
    changeNetwork();
    getAssets()
  }, [networkFrom]);

  useEffect(() => {
    if (amount) {
      setFeeLoader(true)
      if (networkFrom && process.env.BRIDGE_FEE_CONFIG === 'native') {
        getBridgeFee(networkFrom.chainID, 'LYO', amount)
      }
      else if (networkTo) {
        getBridgeFee(networkTo.chainID, 'LYO', amount)
      }

    }

  }, [amount]);

  useEffect(() => {
    if (chainId != process.env.chain_id) {
      // setTokenAddressFrom(assetList[0].childTokenAddress)
      switchNetwork();

    }
  }, []);

  useEffect(() => {
    if (networks.length > 0) {
      setNetworkFrom(networks[0]);
      setNetworkTo(networks[1]);
      setTokenAddressFrom(networks[0].childTokenAddress);
      setTokenAddressTo(networks[1].childTokenAddress)
    }
  }, [networks]);

  function getAssets() {
    if (networkFrom) {
      setAssetList(networkFrom.tokens)

      //remove when needs multiassets
      setSelected(networkFrom.tokens[0])
    }
  }


  function changeSymbol() {
    if (selected) {
      setTokenSymbol(selected.symbol);
    }
    else {
      setTokenSymbol(assetList[0].symbol)
    }
  }

  function getTokenContract() {
    if (selected) {
      try {
        const contract = new web3eth.eth.Contract(tokenABI, selected.address);
        setTokenContract(contract);
        getTokenDetails(tokenContract);
      } catch (error) {
        console.log(error)
      }

    }
    else {
      try {
        const contract = new web3eth.eth.Contract(tokenABI, assetList[0].address);
        setTokenContract(contract);
        getTokenDetails(tokenContract);
      } catch (error) {
        console.log(error)

      }
    }
  }

  async function getFee() {
    if (sideBridgeContractFrom) {
      try {
        let feeAmount = await sideBridgeContractFrom.methods.bridgeFee().call();
        setFee(feeAmount)
        return feeAmount

      } catch (error) {
        // console.log("🚀 ~ file: Bridge.jsx:181 ~ getFee ~ error:", error)

      }
    }
  }

  async function getBridgeFee(chainID, token, amount) {
    setDestinationFee(0)
    setPlatformFee(0)
    setTotalBridgeFee(0)
    setReceiveAmount(0)
    let result = ApiCalls.getBridgeFee(chainID, token);
    result
      .then((response) => {
        if (response.status == 200) {
          if (process.env.BRIDGE_FEE_CONFIG === 'native') {
            setPlatformFee(response.data.data.platformFee)
            setTotalBridgeFee(response.data.data.platformFee)
            setReceiveAmount(parseFloat(amount))
            setFeeLoader(false)
          }
          else {
            let destinationFeeFormatted = parseFloat((response.data.data.destinationFee).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]);          
            setDestinationFee(destinationFeeFormatted)

            let platformFeeFormatted = parseFloat((parseFloat(amount) * (response.data.data.platformFee / 100)).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]);          
            setPlatformFee(platformFeeFormatted)

            let totalFee = (platformFeeFormatted + destinationFeeFormatted).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
            setTotalBridgeFee(totalFee)

            let receiveAmount = parseFloat((parseFloat(amount) - (parseFloat(totalFee))).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]);
            setReceiveAmount(parseFloat(receiveAmount))

            setFeeLoader(false)
          }
        }

      })
      .catch((e) => {
        console.log(e);
        setFeeLoader(false)
      });
  }

  async function getBridgeTokenBalance(networkTo) {
    try {
      if (networkTo) {

        let networkTobridgeAddress;
        let web3side = new Web3(networkTo.wsUrl);

        networkTobridgeAddress = networkTo.tokens.find(token => token.symbol === tokenSymbol);


        let contract = new web3side.eth.Contract(sideBridgeABI, networkTobridgeAddress.bridgeAddress);

        let totalLockedAmount = await contract.methods.totalLockedAmount().call({ from: networkTobridgeAddress.bridgeAddress })

        totalLockedAmount = totalLockedAmount / 10 ** 8

        setBridgeTokenBalance(totalLockedAmount)
      }

    } catch (error) {
      console.log(error)
    }
  }

  function getSideBridgeContract() {

    if (selected) {
      try {
        const contract = new web3eth.eth.Contract(sideBridgeABI, selected.bridgeAddress);
        setSideBridgeContractFrom(contract);

      } catch (error) {
        console.log(error)
      }
    }
    else {
      try {
        const contract = new web3eth.eth.Contract(sideBridgeABI, assetList[0].bridgeAddress);
        setSideBridgeContractFrom(contract);
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function getTokenDetails(tokenContract) {

    try {
      let decimals = await Web3Calls.getTokenDecimals(tokenContract);
      setTokenDecimals(decimals);

      if (walletAddress) {
        let balance = await Web3Calls.getTokenBalance(
          tokenContract,
          walletAddress
        );
        balance = (balance / 10 ** decimals);
        balance = balance.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
        balance = parseFloat(balance)
        setTokenBalance(balance);
      }

    } catch (error) {
      console.log(error)
    }

  }

  const datatableOptions = {
    filterType: "dropdown",
    selectableRows: false,
    responsive: "standard",
    sort: true,
    filter: true,
    download: false,
    caseSensitive: false,
    searchPlaceholder: 'Search by Date, Amount, Network',

  };

  const columns = [
    {
      name: "Created at",
      label: "Created at",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return moment(value).format("D MMM YYYY - hh:mm A")

        },
      },
    },
    {
      name: "Amount",
      label: "Bridged Amount (LYO)",
      options: {
        filter: false,
        sort: true,
        searchable: true,
        customBodyRender: (value) => {
          return (value / 10 ** 8).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
        },
      },

    },
    {
      name: "receivable",
      label: "Receivable Amount (LYO)",
      options: {
        filter: false,
        sort: true,
        searchable: true,
      },

    },
    {
      name: "Fee",
      label: "Bridge Total Fee",
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRender: (item) => {
          return item.platformFee || item.destinationFee ? (
            <Tooltip content={renderFeeSplit(item.platformFee / 10 ** 8, item.destinationFee / 10 ** 8)} color="invert">
              <span className="text-info">{((item.destinationFee + item.platformFee) / 10 ** 8).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]}</span>
            </Tooltip>
          ) : (
            0
          );
        },
      },

    },
    {
      name: "From Network",
      label: "From Network",
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRender: (value) => {
          for (var network in networks) {
            if (networks[network].slug == value) {
              return networks[network].name
            }
          }
        },
      },
    },
    {
      name: "To Network",
      label: "To Network",
      options: {
        filter: false,
        sort: true,
        searchable: true,
        customBodyRender: (value) => {
          for (var network in networks) {
            if (networks[network].chainID == value) {
              return networks[network].name
            }
          }
        },
      },
    },
    {
      name: "Status",
      label: "Status",
      options: {
        filter: false,
        sort: true,
        searchable: false,
        customBodyRender: (value) => {
          return renderStatus(value)

        },
      },
    },
    {
      name: "statusVal",
      label: "Status",
      hide: true,
      options: {
        filter: true,
        sort: true,
        searchable: true,
        display: "excluded",
        customBodyRender: (value) => {
          return rendrenderFilterStatus(value)

        },
      },
    },
    {
      name: "TX_From",
      label: "From TXN #",
      options: {
        filter: false,
        searchable: true,
        sort: false,
      },
    },
    {
      name: "TX_To",
      label: "To TXN #",
      options: {
        filter: false,
        searchable: true,
        sort: false,
      },
    },

  ];

  const renderStatus = (item) => {
    if (item.isCompleted == false && item.isProcessing == true) {
      return (
        <>
          <span className="badge bg-warning rounded-pill">Processing</span>
        </>
      )
    }
    if (item.isCompleted == false && item.isProcessing == false) {
      return (
        <>
          <span className="badge bg-warning rounded-pill">Pending  for Approval</span>
        </>
      )
    }
    if (item.isCompleted == true && item.isApproved == true) {
      return (
        <span className="badge bg-success rounded-pill">Completed</span>
      )
    }
    if (item.isCompleted == true && item.isRejected == true) {
      return (
        <span className="badge bg-danger rounded-pill">Rejected</span>
      )
    }

  }

  const rendrenderFilterStatus = (item) => {
    if (item.isCompleted == false && item.isProcessing == true) {
      return "Processing"
    }
    if (item.isCompleted == false && item.isProcessing == false) {
      return "Pending  for Approval"
    }
    if (item.isCompleted == true && item.isApproved == true) {
      return "Completed"
    }
    if (item.isCompleted == true && item.isRejected == true) {
      return "Rejected"
    }

  }

  const renderFee = () => {
    if (destinationFee && platformFee) {
      return (
        <>
          <div className="d-flex gap-5">
            Destination Fee : {(destinationFee).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]} LYO
          </div>
          <div className="d-flex gap-5">
            Platform Fee : {(platformFee).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]} LYO
          </div>
        </>

      );
    }
  }

  const renderFeeSplit = (_platformFee, _destinationFee) => {
    if (_destinationFee && _platformFee) {
      return (
        <>
          <div className="d-flex gap-5">
            Destination Fee : {(_destinationFee).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]} LYO
          </div>
          <div className="d-flex gap-5">
            Platform Fee : {(_platformFee).toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]} LYO
          </div>
        </>

      );
    }
  }

  function getAmount(e) {
    setAmount(e);
  }

  function renderActionButton() {
    if (!walletAddress) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => setShowConnectModal(true)}
        >
          Connect Wallet to Bridge
        </button>
      );
    }
    if (networkFrom && networkTo && (networkFrom.chainID) == (networkTo.chainID)) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          From and To networks can{""}t be same
        </button>
      );
    }
    if ((amount && amount.length < 1) || amount == 0) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Enter an amount
        </button>
      );
    }

    if (parseFloat(amount) > parseFloat(tokenBalance)) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Insufficient balance
        </button>
      );
    }
    if (parseFloat(amount) >= parseFloat(bridgeTokenBalance)) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Bridging this amount is currently not possible
        </button>
      );
    }
    if (!networkFrom || !networkTo) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Please select networks
        </button>
      );
    }
    if ((destinationFee + platformFee) >= amount) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Bridging amount should be more than Bridge fee
        </button>
      );
    }
    if (feeLoader == true) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Bridge Fee Calculating
        </button>
      );
    }

    if (bridgeLoader == true) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Bridge Processing <span className="loader"></span>
        </button>
      );
    } else {
      return (
        <button className="btn btn-primary mb-2" onClick={callBridge}>
          Bridge
        </button>
      );
    }
  }

  function getNetworks() {
    let result = ApiCalls.getNetworks();
    result
      .then((response) => {
        if (response.data.status == 200) {
          setNetworks(response.data.data);

        }
      })
      .catch((e) => {
        console.log(e);
      });

  }

  let intervalTime = null;

  async function getTxStatus(id) {
    let result = await ApiCalls.getTxStatus(id);
    try {
      if (result.data.data.isWalletToBridgeCompleted == true) {
        setBridgeLoader(false);
        setAmount(0);
        getTokenDetails(tokenContract);
        alert.show(
          <div>
            Transaction is pending for approval<br />{" "}
            <a className="link" onClick={(e) => { handleShow(); getTransactions(); exportTransactions() }}>
              View Status
            </a>
          </div>,
          {
            type: "success",
            timeout: 5000,
          }
        );
      }
      else {
        intervalTime = setInterval(async function () {
          let result = await ApiCalls.getTxStatus(id);
          setBridgeLoader(true)
          if (result.data.data.isWalletToBridgeCompleted == true) {
            clearInterval(intervalTime)
            setBridgeLoader(true)
            alert.show(
              <div>
                Transaction is pending for approval<br />{" "}
                <a className="link" onClick={(e) => { handleShow(); getTransactions(); }}>
                  View Status
                </a>
              </div>,
              {
                type: "success",
                timeout: 5000,
              }
            );
            setBridgeLoader(false);
            setAmount(0)
          }
          else {
            setBridgeLoader(true)

          }

        }, 10000);
      }

    } catch (error) {
      console.log(error)
      alert.show(
        <div>
          Transaction not processed<br />{" "}
        </div>,
        {
          type: "warning",
          timeout: 5000,
        }
      );
      setBridgeLoader(false);
    }
  }

  async function saveTransaction(transactionHash, chainID, tokenAddress, bridgeAddress, amount, platformFee, destinationFee) {
    if (transactionHash && chainID && tokenAddress && bridgeAddress) {
      try {
        getTokenDetails(tokenContract);

        let result;

        if(process.env.BRIDGE_FEE_CONFIG === 'native'){          
          result = await ApiCalls.saveTransaction(transactionHash, chainID, tokenAddress, bridgeAddress, amount, 0, 0);
        }        
        else{
          result = await ApiCalls.saveTransaction(transactionHash, chainID, tokenAddress, bridgeAddress, amount, parseFloat(platformFee) * 10 ** 8, parseFloat(destinationFee) * 10 ** 8);
        }
        if (result.data.data._id) {
          setTimeout(() => {
            getTxStatus(result.data.data._id);

            setBridgeLoader(true)
          }, 10000);
        }

      } catch (error) {
        getTokenDetails(tokenContract);
        setBridgeLoader(false)
        alert.show(
          <div>
            Transaction not processed <br />
          </div>,
          {
            type: "error",
            timeout: 3000,
          }
        );
      }
    }


  }

  async function getAllowance(walletAddress, spender) {
    let allowance = await tokenContract.methods
      .allowance(
        walletAddress,
        spender,
      )
      .call({ from: walletAddress });

    return allowance
  }


  async function callBridge() {

    let approve_amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    setBridgeLoader(true);
    let amountFormatted = parseFloat(amount) * 10 ** tokenDecimals;

    amountFormatted = amountFormatted.toLocaleString("fullwide", {
      useGrouping: false,
    });

    if (networkFrom.chainID == process.env.chain_id) {
      try {
        if (tokenContract) {
          let bridgeAddress = selected ? selected.bridgeAddress : assetList[0].bridgeAddress;
          let tokenAddress = selected ? selected.address : assetList[0].address;

          let allowanceResult = await getAllowance(walletAddress, bridgeAddress)

          let gas = await ApiCalls.getGasFee(networkFrom.chainID);
          gas = (gas * 21000) + gas;

          if (allowanceResult < parseFloat(amount)) {
            let result = await tokenContract.methods
              .approve(
                bridgeAddress,
                approve_amount
              )
              .send({ from: walletAddress });

            if (result) {
              let approveTxHash = result.transactionHash;
              const contract = new web3eth.eth.Contract(bridgeABI, bridgeAddress);

              // if (fee) {
              let lock = await contract.methods
                .lockTokens(
                  networkTo.chainID,
                  amountFormatted.toString(),
                  approveTxHash
                )
                // .send({ from: walletAddress, value: 0 }).on('transactionHash', function (hash) {
                .send({ from: walletAddress, value: 0, gas: gas }).on('transactionHash', function (hash) {
                  if (hash) {
                    saveTransaction(hash, networkFrom.chainID, tokenAddress, bridgeAddress, amountFormatted.toString(), platformFee, destinationFee)
                  }
                })

              getTokenDetails(tokenContract);
            }
          }

          else {
            const contract = new web3eth.eth.Contract(bridgeABI, bridgeAddress);
            let lock = await contract.methods
              .lockTokens(
                networkTo.chainID,
                amountFormatted.toString(),
                "0x4d3698a1b5ba37c884f644e03733e28d1ee398cca155ca2c434e5b11eb4165eb"
              )
              // .send({ from: walletAddress, value: 0 }).on('transactionHash', function (hash) {
              .send({ from: walletAddress, value: 0, gas: gas }).on('transactionHash', function (hash) {
                if (hash) {
                  saveTransaction(hash, networkFrom.chainID, tokenAddress, bridgeAddress, amountFormatted.toString(), platformFee, destinationFee)
                }
              })

            getTokenDetails(tokenContract);
          }
        }
      } catch (error) {
        console.log(error)
        setBridgeLoader(false)
      }


    }
    else {
      setBridgeLoader(true);

      if (tokenContract) {
        try {
          let bridgeAddress = selected ? selected.bridgeAddress : assetList[0].bridgeAddress;
          let tokenAddress = selected ? selected.address : assetList[0].address;

          let allowanceResult = await getAllowance(walletAddress, bridgeAddress)

          if (allowanceResult < parseFloat(amount)) {
            let result = await tokenContract.methods
              .approve(
                bridgeAddress,
                approve_amount
              )
              .send({ from: walletAddress });

            if (result) {
              // if (fee) {
              let approveTxHash = result.transactionHash;
              let gas = await ApiCalls.getGasFee(networkFrom.chainID);
              gas = (gas * 21000) + gas;
              const contract = new web3eth.eth.Contract(sideBridgeABI, bridgeAddress);

              let returnResult = await contract.methods
                .returnTokens(
                  walletAddress,
                  networkTo.chainID,
                  amountFormatted.toString(),
                  approveTxHash
                )
                .send({ from: walletAddress, value: 0, gas: gas }).on('transactionHash', function (hash) {
                  if (hash) {
                    saveTransaction(hash, networkFrom.chainID, tokenAddress, bridgeAddress, amountFormatted.toString(), platformFee, destinationFee)
                  }

                })
              getTokenDetails(tokenContract);
            }
          }

          else {
            const contract = new web3eth.eth.Contract(sideBridgeABI, bridgeAddress);
            let gas = await ApiCalls.getGasFee(networkFrom.chainID);
            gas = gas * 21000;
            let returnResult = await contract.methods
              .returnTokens(
                walletAddress,
                networkTo.chainID,
                amountFormatted.toString(),
                "0xc0baff50e9202abab115712060f60e35f755093baa730a6f606a51362254fed1"
              )
              .send({ from: walletAddress, value: 0, gas: gas }).on('transactionHash', function (hash) {
                if (hash) {
                  saveTransaction(hash, networkFrom.chainID, tokenAddress, bridgeAddress, amountFormatted.toString(), platformFee, destinationFee)
                }

              })
            getTokenDetails(tokenContract);
          }

          // }
        } catch (error) {
          console.log(error)
          setBridgeLoader(false)
        }
      }

    }

  }

  const changeNetwork = async () => {
    const currentChainId = chainId;
    if (networkFrom && currentChainId !== networkFrom) {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(networkFrom.chainID) }],
        });
      } catch (error) {
        addNetwork(networkFrom.chainID, networkFrom.name, networkFrom.symbol, tokenDecimals, networkFrom.rpcUrl)
      }

      // setNetworkStatus(true);
      // await connectToWallet();
    }
  };

  const addNetwork = (id, name, symbol, tokenDecimals, rpc) => {
    if (window.ethereum) {
      const params = [{
        chainId: Web3.utils.toHex(id),
        chainName: name,
        nativeCurrency: {
          name: name,
          symbol: symbol,
          decimals: 18
        },
        rpcUrls: [rpc],
        // blockExplorerUrls: ['https://explorer.rsk.co']
      }]

      window.ethereum.request({ method: 'wallet_addEthereumChain', params })
        .then(() => console.log('Success'))
    }


  }

  async function getGasFee(networkChainId) {
    let gas = await ApiCalls.getGasFee(networkChainId);
    let totalGas = ((21000 * gas) / 10 ** 9).toFixed(4);


    setGasOnDestination(totalGas);
  }

  function getNetworkName(networkSlug) {
    for (var network in networks) {
      if (networks[network].slug == networkSlug) {
        return networks[network].name
      }
    }
  }

  function getBlockExploreLink(id) {
    for (var network in networks) {
      if (networks[network].chainID == id) {
        return networks[network].blockExplorerUrl
      }
    }
  }

  function getNetworkNameFromID(id) {
    for (var network in networks) {
      if (networks[network].chainID == id) {
        return networks[network].name
      }
    }
  }

  async function exportTransactions() {
    try {
      let address = walletAddress.toLowerCase();
      let result = await ApiCalls.exportTransactions(address);
      if (result.status == 200) {
        setExportData(result.data)
      }

    } catch (error) {

    }

  }

  function getTransactions() {
    setTxData([]);
    let address = walletAddress.toLowerCase();
    let result = ApiCalls.getBridgeTransactions(address);

    result
      .then((response) => {
        if (response.data.status == 200) {
          let allTx = response.data.data;
          let tempTable = [];

          for (let i = 0; i < allTx.length; i++) {
            tempTable.push([

              // allTx[i].createdAt,
              allTx[i].createdAt,

              (allTx[i].walletToBridge.amount),
              allTx[i].platformFee || allTx[i].destinationFee ? (parseFloat(allTx[i].walletToBridge.amount) - (allTx[i].platformFee + allTx[i].destinationFee)) / 10 ** 8 : (allTx[i].walletToBridge.amount) / 10 ** 8,
              allTx[i],
              // allTx[i].platformFee || allTx[i].destinationFee ?  (allTx[i].platformFee +  allTx[i].destinationFee) / 10 ** 8 : 0,

              allTx[i].walletToBridge.network,

              allTx[i].walletToBridge.chainID,

              allTx[i],
              allTx[i],

              <span key={i} >{allTx[i].walletToBridge.transactionHash ?
                <div className="d-flex align-items-center gap-1">
                  {allTx[i].walletToBridge.transactionHash.slice(0, 10)}
                  {"..."}
                  {allTx[i].walletToBridge.transactionHash.slice(
                    allTx[i].walletToBridge.transactionHash.length - 6
                  )}
                  <CopyToClipboard
                    onCopy={otherCopy}
                    text={allTx[i].walletToBridge.transactionHash}
                  >
                    <Tooltip
                      content={"Copied"}
                      trigger="click"
                      color="invert"
                      placement="top"
                      css={{
                        width: "80px",
                        textAlign: "justify",
                        fontSize: "11px",
                      }}
                    >
                      <CgCopy />
                    </Tooltip>
                  </CopyToClipboard>
                  <a
                    href={getBlockExploreLink(allTx[i].walletToBridge.fromChainID) + "/tx/" + allTx[i].walletToBridge.transactionHash}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    <BsArrowUpRightSquare />
                  </a>

                </div>
                : "Not available"}</span>,

              <span key={i} >{allTx[i].bridgeToWallet.transactionHash ?
                <div className="d-flex align-items-center gap-1">
                  {allTx[i].bridgeToWallet.transactionHash.slice(0, 10)}
                  {"..."}
                  {allTx[i].bridgeToWallet.transactionHash.slice(
                    allTx[i].bridgeToWallet.transactionHash.length - 6
                  )}
                  <CopyToClipboard
                    onCopy={otherCopy}
                    text={allTx[i].bridgeToWallet.transactionHash}
                  >
                    <Tooltip
                      content={"Copied"}
                      trigger="click"
                      color="invert"
                      placement="top"
                      css={{
                        width: "80px",
                        textAlign: "justify",
                        fontSize: "11px",
                      }}
                    >
                      <CgCopy />
                    </Tooltip>
                  </CopyToClipboard>
                  {allTx[i].isRejected == true ? <a
                    href={getBlockExploreLink(allTx[i].walletToBridge.fromChainID) + "/tx/" + allTx[i].bridgeToWallet.transactionHash}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    <BsArrowUpRightSquare />
                  </a>
                    :
                    <a
                      href={getBlockExploreLink(allTx[i].walletToBridge.chainID) + "/tx/" + allTx[i].bridgeToWallet.transactionHash}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      <BsArrowUpRightSquare />
                    </a>}

                </div>
                : "Not available"}</span>,


            ]);
          }
          setTxData(tempTable);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <section className="content-wrp">
        <div className="container">
          <div className="row">
            <h2>Bridge</h2>
            <div className="col-lg-8">
              <div className="card-container swap-container">
                <div className="custom-select">
                  <label>Asset</label>
                  <div className="dropdown-wrp input-wrp mb-3">
                    <div className="d-flex">
                      <div className="d-flex gap-2 align-items-center"><Image src={logoSmall} width="20" height={20} />LYO</div>
                    </div>
                  </div>
                  {/* <select value={selected ? selected.symbol : "LYO"} className="form-select" onChange={(e) => { handleChange(e); }}>
                    {assetList?.map((item) => (
                      <option key={item.index} value={item.symbol}><Image src={logoSmall} width="20" height={20} /> {item.symbol}</option>
                    ))}
                  </select> */}

                </div>

                <div className="row network-row">
                  <div className="col-md-6">
                    <label>From</label>
                    <CustomDropdown
                      selectedItem={networkFrom}
                      modalTitle={"Select Network"}
                      itemList={networks}
                      setSelectedItem={setNetworkFrom}
                      tokenAd={tokenAddressFrom}
                      setTokenAd={setTokenAddressFrom}
                    />
                  </div>
                  <BiRefresh
                    className="icon-refresh"
                    onClick={(e) => {
                      setNetworkFrom(networkTo);
                      setNetworkTo(networkFrom);
                      setTokenAddressFrom(assetList[0].address)
                      getTokenContract()
                    }}
                  />
                  <div className="col-md-6">
                    <label>To</label>
                    <CustomDropdown
                      selectedItem={networkTo}
                      modalTitle={"Select Network"}
                      itemList={networks}
                      setSelectedItem={setNetworkTo}
                      tokenAd={tokenAddressTo}
                      setTokenAd={setTokenAddressTo}
                    />
                  </div>
                </div>

                <label>Amount</label>
                <InputComponent
                  imgPath={logoSmall}
                  // labelName={assetList[0].name}
                  copyText={selected?.address}
                  balance={tokenBalance}
                  radioSelector={true}
                  inputValue={amount}
                  setInputAmount={getAmount}
                  symbol={tokenSymbol}
                  tokenDecimal={tokenDecimals}
                  modalActive={false}
                />
              


                <div id="example-collapse-text" className="mb-4 mt-5 d-flex align-items-end flex-column">
                  {amount && assetList && receiveAmount && amount >= (destinationFee + platformFee) ?
                    <div className="info-wrp text-right">
                      <span>You will receive - </span>
                      {feeLoader == true ? <span>Calculating <span className="loader"></span></span> :
                        <span>  {(receiveAmount)} LYO</span>
                      }

                    </div>
                    : ""}
                 
                  {amount && totalBridgeFee && platformFee ?
                    <>
                      {process.env.BRIDGE_FEE_CONFIG === 'native' ?
                        <div className="info-wrp text-right">
                          <span>Bridge fees - </span>
                          {feeLoader == true ? <span>Calculating <span className="loader"></span></span> :
                              <span>{totalBridgeFee} <span>{networkFrom.symbol}</span></span>
                            }
                        </div> :
                        <Tooltip content={renderFee()} color="invert" >
                          <div className="info-wrp text-right link">
                            <span>Bridge fee - </span>
                            {feeLoader == true ? <span>Calculating <span className="loader"></span></span> :
                              <span>{totalBridgeFee} LYO <BsFillInfoCircleFill className="text-info" /></span>
                            }

                          </div>
                        </Tooltip>
                      }
                    </>
                    : ""
                  }
                </div>

                <div className="btn-wrp">{renderActionButton()}</div>

                <p className="note">* Please note that average transaction processing time up to 24 hours.</p>


              </div>
            </div>
            <div className="col-lg-4">
              {bridgeTokenBalance ? (
                <div className="card-container mb-3">
                  <h3>Maximum Bridge Volume</h3>

                  {bridgeTokenBalance} LYO

                </div>
              ) : (
                ""
              )}
              <TokenInfo />

              {walletAddress && txData && txData.length > 0 ? (
                <div className="card-container">
                  <h3>View Transactions</h3>

                  <button
                    className="btn btn-primary mt-4"
                    onClick={(e) => {
                      handleShow();
                      getTransactions();
                      exportTransactions()
                    }}
                  >
                    View Transactions
                  </button>

                </div>
              ) : (
                ""
              )}
            </div>

          </div>

        </div>
      </section>
      <ConnectWalletModal
        isOpen={showConnectModal}
        closeModal={() => setShowConnectModal(false)}
      />

      <>
        <Modal show={show} onHide={handleClose} className="historyModal">
          <Modal.Header closeButton>
            <Modal.Title>Your Transactions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {txData ? (
              <MUIDataTable
                data={txData}
                columns={columns}
                options={datatableOptions}
                title={
                  <div className="row">
                    <div className="col-auto h4">
                      {exportData ?
                        <a className="export-link" href={`data:text/csv;charset=utf-8,${escape(exportData)}`}>
                          <Tooltip content="Export data" color="invert" className="text-center w-100"><BiDownload /></Tooltip>
                        </a>
                        : ""}

                    </div>
                  </div>
                }
              />
            ) : (
              "No transactions to show"
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default BridgeComponent;

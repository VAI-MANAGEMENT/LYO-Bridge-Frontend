import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import logoSmall from "../public/logo-small.png";
import { Tooltip, changeTheme } from "@nextui-org/react";
import Moment from "react-moment";
import moment from 'moment';
import { BiRefresh } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
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
  const assetList = [
    {
      name: "LYO",
      symbol: "LYO",
      imageUrl: logoSmall,
      childTokenAddress: process.env.BRIDGE_MAIN_TOKEN_ADDRESS,
    },
  ];

  const [key, setKey] = useState("bridge");
  const [tokenContract, setTokenContract] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [bridgeTokenBalance, setBridgeTokenBalance] = useState();
  const [tokenDecimals, setTokenDecimals] = useState(8);
  const [amount, setAmount] = useState(0);
  const [networkFrom, setNetworkFrom] = useState();
  const [networkTo, setNetworkTo] = useState();
  const [tokenAddressFrom, setTokenAddressFrom] = useState(assetList[0].childTokenAddress);
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


  const alert = useAlert();
  const { walletAddress, chainId, switchNetwork } = useContext(WalletContext);
  const web3eth = new Web3(
    Web3.givenProvider ||
    "https://solemn-summer-shadow.bsc-testnet.discover.quiknode.pro/1b0c85b08d945ae4d5838b5215d52e4aae37c21f/"
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let otherCopy;
  let assetLink = "https://testnet.bscscan.com/tx/";
  const contractBridge = new web3eth.eth.Contract(
    bridgeABI,
    process.env.MAIN_BRIDGE_ADDRESS
  );

  useEffect(() => {
    if (networkFrom && chainId) {
      getTokenContract();
    }
  }, [tokenAddressFrom, walletAddress, chainId, tokenAddressTo]);

  useEffect(() => {
    getNetworks();
  }, []);

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
    changeNetwork();

  }, [networkFrom]);

  // useEffect(() => {
  //   getBridgeTokenBalance();
  // }, [amount]);

  useEffect(() => {

    renderActionButton();
    // getBridgeTokenBalance(networkFrom)
  }, [networkFrom]);

  useEffect(() => {  
    getBridgeTokenBalance(networkTo)
  }, [networkTo]);


  useEffect(() => {
   if(chainId != process.env.chain_id){
    getFee()
   } 

  }, [chainId]);


//   useEffect(() => {
//     if(chainId && walletAddress){
//  getBridgeTokenBalance()
//     }
   
//   }, [chainId, tokenContract, tokenBalance]);

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

  function getTokenContract() {
    if (tokenAddressFrom) {
      try {
        const contract = new web3eth.eth.Contract(tokenABI, tokenAddressFrom);
        setTokenContract(contract);
        getTokenDetails(tokenContract);
      } catch (error) {
        console.log(error)
      }

    }
  }

  async function getFee() {

    try {
      if (chainId == process.env.chain_id) {
        console.log("🚀gett fee")
        let feeAmount = await contractBridge.methods.bridgeFee().call();
        console.log("🚀 ~ file: Bridge.jsx:165 ~ getFee ~ feeAmount:", feeAmount)
        setFee(feeAmount)
        return feeAmount

      }
      else {

        const contract = new web3eth.eth.Contract(sideBridgeABI, networkFrom.bridgeAddress);
        console.log("🚀 ~ file: Bridge.jsx:169 ~ getFee ~ contract:", contract)

        let feeAmount = await contract.methods.bridgeFee().call();
        console.log("🚀 ~ file: Bridge.jsx:172 ~ getFee ~ feeAmount:", feeAmount)
        setFee(feeAmount)
        return feeAmount

      }


    } catch (error) {
      console.log("🚀 ~ file: Bridge.jsx:181 ~ getFee ~ error:", error)

    }

  }

  async function getBridgeTokenBalance() {
  
    try {
      if (networkTo) {
        const web3eth = new Web3(
          Web3.givenProvider || networkTo.wsUrl);
        const contract = new web3eth.eth.Contract(tokenABI, networkTo.childTokenAddress);
        let tokenBal = await contract.methods.balanceOf(networkTo.bridgeAddress).call({ from: networkTo.bridgeAddress });
        tokenBal = tokenBal / 10 ** tokenDecimals
        setBridgeTokenBalance(tokenBal)
        console.log("🚀 ~ file: Bridge.jsx:155 ~ getBridgeTokenBalance ~ tokenBal:", tokenBal)
      }
      // else {
      //   if (tokenContract) {
      //     let tokenBal = await tokenContract.methods.balanceOf(process.env.MAIN_BRIDGE_ADDRESS).call({ from: process.env.MAIN_BRIDGE_ADDRESS });
      //     tokenBal = tokenBal / 10 ** tokenDecimals
      //     setBridgeTokenBalance(tokenBal)
      //     console.log("🚀 ~ file: Bridge.jsx:155 ~ getBridgeTokenBalance ~ tokenBal:", tokenBal)
      //   }

      // }
    } catch (error) {
      console.log("🚀 ~ file: Bridge.jsx:213 ~ getBridgeTokenBalance ~ error:", error)

    }



  }



  function getSideBridgeContract() {

    if (networkFrom && networkFrom.bridgeAddress) {
      try {
        console.log("🚀 ~ file: Bridge.jsx:172 ~ getSideBridgeContract ~ networkFrom.bridgeAddress:", networkFrom.bridgeAddress)
        const contract = new web3eth.eth.Contract(sideBridgeABI, networkFrom.bridgeAddress);
        setSideBridgeContractFrom(contract);

        // setTimeout(() => {
        //   if(sideBridgeContractFrom && sideBridgeABI && networkFrom.bridgeAddress){
        //   getFee();
        //   }
        //   }, 10000);

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
        balance = (balance / 10 ** decimals).toFixed(4);
        console.log("🚀 ~ file: Bridge.jsx:267 ~ getTokenDetails ~ balance:", balance)
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
      label: "Amount (LYO)",
      options: {
        filter: false,
        sort: true,
        searchable: true,
        customBodyRender: (value) => {
          return (Web3.utils.fromWei(value) * 10 ** 10).toFixed(4)
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
      name: "TX",
      label: "TX",
      options: {
        filter: false,
        searchable: true,
        sort: false,
        
      },
    },
  ];

  const renderStatus = (item) => {      
    if(item.isCompleted == false && item.isProcessing == true){
        return (
            <>
             <span className="badge bg-warning rounded-pill">Processing</span>             
            </>          
        )
    }
    if(item.isCompleted == false && item.isProcessing == false){
      return (
          <>
           <span className="badge bg-warning rounded-pill">Pending  for Approval</span>             
          </>          
      )
  }
    if(item.isCompleted == true && item.isApproved == true){
        return (
          <span className="badge bg-success rounded-pill">Completed</span>
        )
    }
    if(item.isCompleted == true && item.isRejected == true){
        return (
            <span className="badge bg-danger rounded-pill">Rejected</span>
        )
    }

}

const rendrenderFilterStatus = (item) => {      
  if(item.isCompleted == false && item.isProcessing == true){     
      return "Processing"      
  }
  if(item.isCompleted == false && item.isProcessing == false){
        return "Pending  for Approval"
}
  if(item.isCompleted == true && item.isApproved == true){
         return "Completed"
  }
  if(item.isCompleted == true && item.isRejected == true){   
      return "Rejected"
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
    // if (parseFloat(amount) >= parseFloat(bridgeTokenBalance)) {
    //   return (
    //     <button className="btn btn-primary mb-2" disabled>
    //       Bridging this amount is currently not possible
    //     </button>
    //   );
    // }
    if (!networkFrom || !networkTo) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Please select networks
        </button>
      );
    }


    if (bridgeLoader == true) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Bridge Proccessing <span className="loader"></span>
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

  async function getTxStatus(hash) {
    let result = await ApiCalls.getTxStatus(hash);

    setBridgeLoader(false);
    if (result.data.data.length > 0) {

      if (result.data.data[0].isCompleted) {
        alert.show(
          <div>
            Transaction completed<br />{" "}
            <a href={getBlockExploreLink(result.data.data[0].bridgeToWallet.chainID) + "/tx/" + result.data.data[0].bridgeToWallet.transactionHash} className="link" target="_blank" rel="noreferrer">
              View Transaction
            </a>
          </div>,
          {
            type: "success",
            timeout: 50000,
          }
        );
      }
      else {
        alert.show(
          <div>
            Transaction is pending for approval <br />{" "}
            <a className="link" onClick={(e) => { handleShow(); getTransactions(); }}>
              View Status
            </a>
          </div>,
          {
            type: "success",
            timeout: 5000,
          }
        );
      }

    }

    else {
      alert.show(
        <div>
          Transaction failed <br />

        </div>,
        {
          type: "error",
          timeout: 3000,
        }
      );

    }
  }

  async function callBridge() {

    setBridgeLoader(true);
    let amountFormatted = parseFloat(amount) * 10 ** tokenDecimals;

    amountFormatted = amountFormatted.toLocaleString("fullwide", {
      useGrouping: false,
    });

    if (networkFrom.chainID == process.env.chain_id) {
      try {
        if (tokenContract) {

          let result = await tokenContract.methods
            .approve(
              process.env.MAIN_BRIDGE_ADDRESS,
              amountFormatted.toString()
            )
            .send({ from: walletAddress });
          console.log("🚀 ~ file: Bridge.jsx:532 ~ callBridge ~ result:", result)


          if (result) {

            let approveTxHash = result.transactionHash;


            // if (fee) {
              let lock = await contractBridge.methods
                .lockTokens(
                  networkTo.chainID,
                  amountFormatted.toString(),
                  approveTxHash
                )
                .send({ from: walletAddress, value: 0 });


              let lockTxHash = lock.transactionHash;

              if (lockTxHash) {
                setTimeout(() => {
                  getTxStatus(lockTxHash);
                  setBridgeLoader(false);
                  setAmount(0);
                }, 10000);
              }

              getTokenDetails(tokenContract);
            }


          // }
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

          let result = await tokenContract.methods
            .approve(
              networkFrom.bridgeAddress,
              amountFormatted.toString()
            )
            .send({ from: walletAddress });

          if (result) {

            // if (fee) {
              let approveTxHash = result.transactionHash;
              let gas = await ApiCalls.getGasFee(networkFrom.chainID);
              gas = gas * 21000;
              gas = parseInt(gas + (gas * 0.2))
              console.log("🚀 ~ file: Bridge.jsx:480 ~ callBridge ~ gasFormatted:", gas)
              let returnResult = await sideBridgeContractFrom.methods
                .returnTokens(
                  walletAddress,
                  networkTo.chainID,
                  amountFormatted.toString(),
                  approveTxHash
                )
                .send({ from: walletAddress, value: 0});

              let returnResultHash = returnResult.transactionHash;

              if (returnResultHash) {
                setTimeout(() => {
                  getTxStatus(returnResultHash);
                  setBridgeLoader(false);
                  setAmount(0);
                }, 10000);

              }
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

              allTx[i].walletToBridge.amount,

              allTx[i].walletToBridge.network,

              allTx[i].walletToBridge.chainID,

              allTx[i],
              allTx[i],

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
                  {allTx[i].isRejected == true ?  <a
                    href={getBlockExploreLink(allTx[i].walletToBridge.fromChainID) + "tx/" + allTx[i].bridgeToWallet.transactionHash}
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
                : "Not available"}</span>
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
                      setTokenAddressFrom(tokenAddressTo)
                      setTokenAddressTo(tokenAddressFrom)
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
                  imgPath={assetList[0].imageUrl}
                  labelName={assetList[0].name}
                  copyText={networkFrom ? tokenAddressFrom : ""}
                  balance={tokenBalance}
                  radioSelector={true}
                  inputValue={amount}
                  setInputAmount={getAmount}
                  symbol={assetList[0].name}
                  tokenDecimal={tokenDecimals}
                  modalActive={false}
                />

                {/* <div className="d-flex justify-content-between info-wrp mt-5">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    You will recieve
                  </div>
                  <div
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                  >
                    {amount} {assetList[0].name}
                    <RiArrowDownSLine />
                  </div>
                </div> */}

              
                  <div id="example-collapse-text" className="mb-4 mt-5">
                  {amount && assetList ?
                      <div className="info-wrp text-right">
                        <span>You will recieve - </span>
                        <span>  {amount} {assetList[0].name}</span>
                      </div>
                      : ""}
                    {gasOnDestination ? (
                      <div className="info-wrp text-right">
                        <span>Gas on Destination - </span>
                        <span>
                          {gasOnDestination} {networkTo.symbol}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* {fee && networkFrom ?
                      <div className="d-flex justify-content-between align-items-center gap-2  info-wrp">
                        <span>Fee</span>
                        <span>{(parseFloat(fee)) / 10 ** 18} {networkFrom.symbol}</span>
                      </div>
                      : ""} */}
                  </div>
              

                <div className="btn-wrp">{renderActionButton()}</div>

                <p className="note">* Please note that avarage transaction processing time is 24 hours.</p>


              </div>
            </div>
            <div className="col-lg-4">
              <TokenInfo />

              {walletAddress && txData && txData.length > 0 ? (
                <div className="card-container">
                  <h3>View Transactions</h3>

                  <button
                    className="btn btn-primary mt-4"
                    onClick={(e) => {
                      handleShow();
                      getTransactions();
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

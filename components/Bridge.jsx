import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import logoSmall from "../public/logo-small.png";
import { Tooltip } from "@nextui-org/react";
import Moment from "react-moment";
import { BiRefresh } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import InputComponent from "./InputComponent";
import { WalletContext } from "../context/WalletConnect";
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
      childTokenAddress: process.env.BRIDGE_LFI_ADDRESS,
    },
  ];

  const [key, setKey] = useState("bridge");
  const [tokenContract, setTokenContract] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [tokenDecimals, setTokenDecimals] = useState();
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
      console.log("BRIDGE_LFI_ADDRESS", tokenAddressFrom);
    }
  }, [tokenAddressFrom, walletAddress, chainId, tokenAddressTo]);

  useEffect(() => {
    getNetworks();
  }, []);

  useEffect(() => {
    getSideBridgeContract();
  }, [networkFrom]);

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

  useEffect(() => {
    if (chainId != 97) {
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

  function getSideBridgeContract() {
    if (networkFrom && networkFrom.bridgeAddress) {
      console.log("sidebridge address", networkFrom.bridgeAddress)
      try {
        const contract = new web3eth.eth.Contract(sideBridgeABI, networkFrom.bridgeAddress);
        setSideBridgeContractFrom(contract);
      } catch (error) {
        console.log(error)
      }

    }
  }

  async function getTokenDetails(tokenContract) {
    console.log("tokenad changed", tokenAddressFrom, networkFrom);
    try {
      let decimals = await Web3Calls.getTokenDecimals(tokenContract);
      setTokenDecimals(decimals);

      if (walletAddress) {
        let balance = await Web3Calls.getTokenBalance(
          tokenContract,
          walletAddress
        );
        balance = (balance / 10 ** decimals).toFixed(2);
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
    filter: false,
    download: false,
  };

  const columns = [
    {
      name: "Created at",
      label: "Created at",
    },
    {
      name: "Amount",
      label: "Amount (LFI)",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "From Network",
      label: "From Network",
    },
    {
      name: "To Network",
      label: "To Network",
    },
    {
      name: "Status",
      label: "Status",
    },
    {
      name: "TX",
      label: "TX",
    },
  ];

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

    if ((amount && amount.length < 1) || amount == 0) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Enter an amount
        </button>
      );
    }

    if (parseFloat(amount) >= parseFloat(tokenBalance)) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          Insufficient balance
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

    if (networkFrom == networkTo) {
      return (
        <button className="btn btn-primary mb-2" disabled>
          From and To networks can{""}t be same
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
            Transaction is pending <br />{" "}
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

    console.log("from, to", networkFrom.chainID, networkTo.chainID)

    if (networkFrom.chainID == 97) {
      try {
        if (tokenContract) {
          let result = await tokenContract.methods
            .approve(
              process.env.MAIN_BRIDGE_ADDRESS,
              amountFormatted.toString()
            )
            .send({ from: walletAddress });

          if (result) {

            let approveTxHash = result.transactionHash;

            let lock = await contractBridge.methods
              .lockTokens(
                networkTo.chainID,
                amountFormatted.toString(),
                approveTxHash
              )
              .send({ from: walletAddress });

            console.log("lock result", lock);

            let lockTxHash = lock.transactionHash;

            if (lockTxHash) {
              setTimeout(() => {
                console.log("inside timeout");
                getTxStatus(lockTxHash);
                setBridgeLoader(false);
                setAmount(0);
              }, 15000);
            }

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
          console.log("inside sideto main", tokenAddressFrom);
          let result = await tokenContract.methods
            .approve(
              networkFrom.bridgeAddress,
              amountFormatted.toString()
            )
            .send({ from: walletAddress });

          if (result) {

            console.log("approve result", result);
            let approveTxHash = result.transactionHash;

            let returnResult = await sideBridgeContractFrom.methods
              .returnTokens(
                walletAddress,
                amountFormatted.toString(),
                approveTxHash,
                networkTo.chainID
              )
              .send({ from: walletAddress });

            console.log("returnResult", returnResult);

            let returnResultHash = returnResult.transactionHash;

            if (returnResultHash) {
              setTimeout(() => {
                console.log("inside timeout");
                getTxStatus(returnResultHash);
                setBridgeLoader(false);
                setAmount(0);
              }, 15000);

            }
            getTokenDetails(tokenContract);

          }
        } catch (error) {
          console.log("tx failed");
          console.log(error)
          setBridgeLoader(false)
        }

      }


    }

  }

  const changeNetwork = async () => {
    const currentChainId = chainId;
    if (currentChainId !== networkFrom) {
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
    console.log(id, name, symbol, tokenDecimals, rpc);
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

  function getGasFee(networkChainId) {
    console.log("get gas", networkChainId);
    if (networkChainId == 97) {
      let result = ApiCalls.getGasBsc();
      result
        .then((response) => {
          if (response.data.status == 1) {
            let gas = response.data.result.SafeGasPrice;

            //  totalFee = units of gas used * (base fee + priority fee)
            let totalGas = ((21000 * gas) / 10 ** 9).toFixed(4);
            setGasOnDestination(totalGas);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (networkChainId == 80001) {
      let result = ApiCalls.getGasPolygon();
      result
        .then((response) => {
          if (response.data.status == 1) {
            let gas = response.data.result.SafeGasPrice;

            //  totalFee = units of gas used * (base fee + priority fee)
            let totalGas = ((21000 * gas) / 10 ** 9).toFixed(5);
            setGasOnDestination(totalGas);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
              <Moment format="D MMM YYYY - hh:mm A" key={i}>
                {allTx[i].createdAt}
              </Moment>,

              (Web3.utils.fromWei(allTx[i].walletToBridge.amount) *
                10 ** 10).toFixed(6),

              getNetworkName(allTx[i].walletToBridge.network),

              getNetworkNameFromID(allTx[i].walletToBridge.chainID),

              <span key={i}>{(allTx[i].isCompleted == true) ? <span className="badge bg-success rounded-pill">Completed</span> : <span className="badge bg-danger rounded-pill">Failed</span>}</span>,

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
                  <a
                    href={getBlockExploreLink(allTx[i].walletToBridge.chainID) + "/tx/" + allTx[i].bridgeToWallet.transactionHash}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    <BsArrowUpRightSquare />
                  </a>
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
                    <div class="d-flex gap-2 align-items-center"><Image src={logoSmall} width="20" height={20} />LYO</div>
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

              <div className="d-flex justify-content-between info-wrp">
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
              </div>

              <Collapse in={open}>
                <div id="example-collapse-text">
                  <div className="d-flex justify-content-between align-items-center gap-2  info-wrp">
                    <span>Slippage</span>
                    <span>0.1</span>
                  </div>
                  {gasOnDestination ? (
                    <div className="d-flex justify-content-between align-items-center gap-2  info-wrp">
                      <span>Gas on Destination</span>
                      <span>
                        {gasOnDestination} {networkTo.symbol}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="d-flex justify-content-between align-items-center gap-2  info-wrp">
                    <span>Fee</span>
                    <span>$ 0</span>
                  </div>
                </div>
              </Collapse>

              <div className="btn-wrp">{renderActionButton()}</div>

              
            </div>
          </div>
          <div className="col-lg-4">
           <TokenInfo/>

           {walletAddress && txData && txData.length > 0 ? (
           <div className="card-container">
                    <h3>View Transactions</h3>
                  
                <button
                  className="btn btn-secondary mt-4"
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

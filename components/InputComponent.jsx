import React, { useState, useEffect, useContext, useRef } from "react";
import logoSmall from "../public/logo-small.png";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CgCopy } from "react-icons/cg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Web3Calls from "../utils/web3Calls";
import { FaArrowLeft, FaInfoCircle, FaQuestionCircle } from "react-icons/fa";
import { WalletContext } from "../context/WalletConnect";
import tokenABI from "../utils/config/abis/token.json";
import { TokenContext } from "../context/TokenContext";
const Web3 = require("web3");

const InputComponent = ({
  imgPath,
  copyText,
  balance,
  radioSelector,
  labelName,
  getValue,
  inputValue,
  setInputAmount,
  setTokenAddress,
  symbol,
  tokenDecimal,
  disabled,
  modalActive,
}) => {
  const [key, setKey] = useState("swap");
  const [copied, setCopied] = useState(false);
  const [tokenSearched, setTokenSearched] = useState();
  const [tokenSearchedContract, setTokenSearchedContract] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [importStatus, setImportStatus] = useState(false);
  const [error, setError] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const handleCloseManage = () => setShowManage(false);
  const handleShowManage = () => setShowManage(true);
  const [showManage, setShowManage] = useState(false);
  const [importedTokens, setImportedTokens] = useState([]);
  const [isImportDisabled, setImportDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const handleCloseImport = () => {
    setShowImport(false);
    setTokenSearched("");
  };
  const handleShowImport = () => setShowImport(true);

  let searchTokenInputRef = useRef();
  const web3eth = new Web3(
    Web3.givenProvider || "https://solemn-summer-shadow.bsc-testnet.discover.quiknode.pro/1b0c85b08d945ae4d5838b5215d52e4aae37c21f/"
  );

  const { walletAddress, chainId } = useContext(WalletContext);
  const { activeTokens, setActiveTokens } = useContext(TokenContext);
  // const [ setInputAmount] = useState();

  let otherCopy;
  let bscLink = "https://testnet.bscscan.com/address/";

  // console.log(activeTokens);

  async function getTokenContract(_tokenAddress) {
    setError(false);
    if (_tokenAddress && chainId == process.env.chain_id) {
      try {
        let addresFormatted = Web3.utils.toChecksumAddress(_tokenAddress);
        setTokenSearchedContract(addresFormatted);
        const _tokenContract = new web3eth.eth.Contract(tokenABI, addresFormatted);

        let tokenName = await Web3Calls.getTokenName(_tokenContract);
        let _tokenSymbol = await Web3Calls.getTokenSymbol(_tokenContract);
        if (tokenName) {
          setTokenSearched(tokenName);
          setLoading(false);
        }

        if (_tokenSymbol) {
          setTokenSymbol(_tokenSymbol);
          setLoading(false);
        }
      } catch (error) {
        setTokenSearched("");
        setError(true);
        setLoading(false);
      }
    }
  }

  function handleImport() {
    console.log("ACTIVE ON IMPORT: ", activeTokens);
    if (!activeTokens.find((active) => active.tokenAddress == tokenSearchedContract)) {
      setTokenAddress(tokenSearchedContract);
      if (!localStorage.getItem("importedTokens")) {
        Web3Calls.getTokenData(tokenSearchedContract, walletAddress).then((res) => {
          let firstList = JSON.stringify([res]);
          localStorage.setItem("importedTokens", firstList);
        });
      } else {
        let existingList = JSON.parse(localStorage.getItem("importedTokens"));
        Web3Calls.getTokenData(tokenSearchedContract, walletAddress).then((res) => {
          let newList = [...existingList, res];
          let newActive = activeTokens.filter((active) => active.tokenAddress != tokenSearchedContract);
          setActiveTokens([...newActive, res]);
          localStorage.setItem("activeTokens", JSON.stringify([...newActive, res]));
          localStorage.setItem("importedTokens", JSON.stringify(newList));
        });
      }
    }
    // window.localStorage.setItem(walletAddress, tokenSearchedContract);
    setShowImport(false);
    setTokenSearched("");
    setImportStatus(false);
  }

  function checkImportDisabled() {
    // console.log(importedTokens, tokenSearched);
    setImportDisabled(
      !!importedTokens?.find((token) => token.tokenAddress === tokenSearchedContract) ||
        !!activeTokens?.find((token) => token.tokenAddress === tokenSearchedContract)
    );
  }

  function getActiveTokens() {
    if (!setActiveTokens) return;
    if (localStorage.getItem("activeTokens")) {
      let activeTokensFromLS = JSON.parse(localStorage.getItem("activeTokens"));
      setActiveTokens(activeTokensFromLS);
    }
  }

  function handleAddActiveToken(tokenToAdd) {
    let existingActiveList = JSON.parse(localStorage.getItem("activeTokens"));
    let newActiveList = existingActiveList.filter((token) => token.tokenAddress != tokenToAdd.tokenAddress);
    localStorage.setItem("activeTokens", JSON.stringify([...newActiveList, tokenToAdd]));
    setActiveTokens([{tokenName: "DUMMY", tokenAddress: "DDDDD"}]);
  }

  function handleRemoveToken(tokenToRemove) {
    let existingList = JSON.parse(localStorage.getItem("importedTokens"));
    let newList = existingList.filter((token) => token.tokenAddress != tokenToRemove.tokenAddress);
    let existingActiveList = JSON.parse(localStorage.getItem("activeTokens"));
    let newActiveList = existingActiveList.filter((token) => token.tokenAddress != tokenToRemove.tokenAddress);
    localStorage.setItem("importedTokens", JSON.stringify(newList));
    localStorage.setItem("activeTokens", JSON.stringify(newActiveList));
    setImportedTokens(newList);
    getActiveTokens();
  }

  useEffect(() => {
    getActiveTokens();

    let importedTokens = JSON.parse(localStorage.getItem("importedTokens"));

    setImportedTokens(importedTokens);
  }, []);

  useEffect(() => {
    let importedTokens = JSON.parse(localStorage.getItem("importedTokens"));
    setImportedTokens(importedTokens);
  }, [show]);

  useEffect(() => {
    checkImportDisabled();
  }, [tokenSearched, show]);

  return (
    <div className="input-wrp">
      <div className="top-row">
        <div className="img-wrp d-flex gap-2 align-items-center">
          <Image src={imgPath} width="20" height="20" />{" "}
          <a
            onClick={(e) => {
              modalActive && handleShow();
            }}
          >
            {symbol ? symbol : "Add Token"}
          </a>
          <div className="icon-row">
            <CopyToClipboard onCopy={otherCopy} text={copyText}>
              {copied ? (
                ""
              ) : (
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
                  {" "}
                  <CgCopy />
                </Tooltip>
              )}
            </CopyToClipboard>
            <Tooltip content={"Add Token to MetaMask"} color="invert" placement="top">
              <img
                src="https://bscscan.com/images/svg/brands/metamask.svg"
                width={18}
                onClick={(e) => {
                  Web3Calls.importTokens(copyText, symbol, tokenDecimal);
                }}
              />
            </Tooltip>
          </div>
        </div>

        {walletAddress ? <div className="text-light">Balance: {balance}</div> : ""}
      </div>
      <div className="inputRow align-items-sm-end d-flex">
        <input
          type="number"
          placeholder={0}
          min="0"
          autoComplete="off"
          step="any"
          onChange={(e) => {
            setInputAmount(e.target.value);
          }}
          onBlur={(e) => setInputAmount(Number(e.target.value).toString())}
          value={disabled ? "" : /[0-9]+[.*]/g.test(inputValue) ? inputValue : Number(inputValue).toString()}
          disabled={disabled}
        />

        {radioSelector == true && balance > 0 && walletAddress ? (
          <div className="max-row">
            <span
              className="addMax"
              onClick={(e) => {
                setInputAmount(balance * 0.25);
              }}
            >
              25%
            </span>
            <span
              className="addMax"
              onClick={(e) => {
                setInputAmount(balance * 0.5);
              }}
            >
              50%
            </span>
            <span
              className="addMax"
              onClick={(e) => {
                setInputAmount(balance * 0.75);
              }}
            >
              75%
            </span>
            <span
              className="addMax"
              onClick={(e) => {
                setInputAmount(balance);
              }}
            >
              Max
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          setImportStatus(false);
          setTokenSearched("");
        }}
        className="cal-modal assetModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-control">
            <div className="input-wrp">
              <div className="flex-row">
                <div className="input-row ">
                  <input
                    type="text"
                    placeholder="Paste contract address to find a token"
                    onChange={(e) => {
                      setLoading(true);
                      setSearchInputValue(e.target.value);
                      getTokenContract(e.target.value);
                    }}
                    ref={searchTokenInputRef}
                    value={searchInputValue}
                  />
                </div>
              </div>
            </div>
            <div className="tokenList">
              {tokenSearched ? (
                <>
                  <div className="align-items-center d-flex justify-content-between">
                    <div className={`name ${isImportDisabled ? "disabled-token" : ""}`}>
                      <FaQuestionCircle /> {tokenSearched}
                      <span className="text-green p-2"> {tokenSymbol}</span>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleClose(true);
                        setShowImport(true);
                      }}
                      disabled={isImportDisabled}
                    >
                      Import
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {loading && searchTokenInputRef?.current?.value.length > 0 ? (
                    <div>Loading...</div>
                  ) : error == true ? (
                    <div className="alert alert-warning">
                      <FaQuestionCircle /> The entered token address is wrong
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
            <div className="imported-token-list">
              {importedTokens?.length > 0 ? (
                importedTokens?.map((token) => {
                  let active = !!activeTokens?.find((activeToken) => activeToken.tokenAddress === token.tokenAddress);
                  return (
                    <div
                      className={`name clickable-token ${active ? "disabled-token" : ""}`}
                      key={token.tokenAddress}
                      onClick={() => {
                        setTokenAddress(token.tokenAddress);
                        handleAddActiveToken(token);
                        setShow(false);
                      }}
                    >
                      <FaQuestionCircle /> {token.tokenName}
                      <span className="text-green p-2"> {token.tokenSymbol}</span>
                    </div>
                  );
                })
              ) : (
                <div className="my-4">You don&apos;t have any imported tokens. Paste an address above to import a token.</div>
              )}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowManage(true);
                setShow(false);
              }}
              disabled={importedTokens?.length < 1}
            >
              Manage Tokens
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showImport}
        onHide={() => {
          handleCloseImport();
          setImportStatus(false);
          setTokenSearched("");
        }}
        className="cal-modal assetModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <FaArrowLeft
              onClick={() => {
                setShowImport(false);
                setShow(true);
                setImportStatus(false);
                setTokenSearched("");
              }}
            />{" "}
            Import Tokens
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-control">
            <div className="alert alert-warning">
              <p>
                {" "}
                <FaInfoCircle /> Anyone can create a BEP20 token on BNB Smart Chain Testnet with any name, including creating fake versions
                of existing tokens and tokens that claim to represent projects that do not have a token.
              </p>

              <p>If you purchase an arbitrary token, you may be unable to sell it back.</p>
            </div>

            <div className="tokenList">
              {tokenSearched ? (
                <>
                  <div className="align-items-center d-flex justify-content-between">
                    <div className="name">
                      {tokenSearched} ({tokenSymbol})
                      <div className="address text-green">
                        {tokenSearchedContract.slice(0, 6)}
                        {"..."}
                        {tokenSearchedContract.slice(tokenSearchedContract.length - 6)}
                      </div>
                    </div>

                    <a className="link-info" target="_blank" rel="noreferrer" href={bscLink + tokenSearchedContract}>
                      (View on BscScan){" "}
                    </a>
                  </div>
                  <div className="align-items-center d-flex justify-content-between  mt-4">
                    <div className="form-group">
                      <input
                        type="checkbox"
                        id="agree"
                        name="agree"
                        value="false"
                        onChange={() => {
                          importStatus == true ? setImportStatus(false) : setImportStatus(true);
                        }}
                      />{" "}
                      <label htmlFor="agree">I understand</label>
                    </div>

                    <button className="btn btn-primary" disabled={!importStatus} onClick={handleImport}>
                      Import
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showManage} onHide={handleCloseManage} className="cal-modal assetModal">
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <FaArrowLeft
              onClick={() => {
                setShowManage(false);
                setShow(true);
              }}
            />{" "}
            Manage Tokens
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-control">
            <div className="imported-token-list">
              {importedTokens?.length > 0 ? (
                importedTokens?.map((token) => {
                  return (
                    <div className="manage-token-wrapper" key={token.tokenName}>
                      <div
                        className={`name clickable-token`}
                        onClick={() => {
                          setTokenAddress(token.tokenAddress);
                          getActiveTokens();
                          setShow(false);
                        }}
                      >
                        <FaQuestionCircle /> {token.tokenName}
                        <span className="text-green p-2"> {token.tokenSymbol}</span>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleRemoveToken(token)}>
                        Remove
                      </button>
                    </div>
                  );
                })
              ) : (
                <div>You don&apos;t have any tokens to manage.</div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InputComponent;

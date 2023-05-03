import Logo from "../public/logo-small.png";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { WalletContext } from "../context/WalletConnect";
import Tooltip from "react-bootstrap/Tooltip";
import ThemeSelector from "./ThemeSelector";
import Dropdown from "react-bootstrap/Dropdown";
import Web3Calls from "../utils/web3Calls";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ConnectWalletModal from "./ConnectWalletModal";

function Header({ currencyBalance }) {
  const [lfiBalance, setLfiBalance] = useState();
  const [wlfiBalance, setwLfiBalance] = useState();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const myContext = useContext(WalletContext);

  const {
    disconnectWallet,
    connectToWallet,
    walletAddress,
    balance,
    chainId,
    mobileConnect,
  } = useContext(WalletContext);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Coming Soon
    </Tooltip>
  );

  useEffect(() => {
    if (walletAddress && chainId == process.env.chain_id) {
      getBalance();
      getWlfiBalance();
    }
  }, [lfiBalance, wlfiBalance, walletAddress, chainId]);

  async function getBalance() {
    let result = await Web3Calls.getBalanceLfi(walletAddress);
    // console.log(result);
    const formattedBalance = (result / 1e8).toFixed(2);
    setLfiBalance(formattedBalance);
  }

  async function getWlfiBalance() {
    let result = await Web3Calls.getBalanceWlfi(walletAddress);

    const formattedBalance = (result / 1e8).toFixed(2);
    setwLfiBalance(formattedBalance);
  }

  return (
    <section className="main-header">
      <Navbar
        collapseOnSelect
        expand="lg"
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      >
        <Container>
          <a
            className="navbar-brand"
            href="#"          
          >
            <Image src={Logo} alt="LFI" /> LYOBRIDGE
          </a>

          <div>
            <div className="mobile-connect">
              {walletAddress ? (
                <a className="btn btn-primary" onClick={disconnectWallet}>
                  Disconnect
                </a>
              ) : (
                <a className="btn btn-primary" onClick={mobileConnect}>
                  Connect
                </a>
              )}
            </div>         
          </div>

          <div className="btn-wrp">
            <>
            {walletAddress ? (
              <>
                <a className="btn btn-secondary" onClick={disconnectWallet}>
                  Disconnect
                </a>
                <Dropdown className="header-dropdown">
                  <Dropdown.Toggle
                    variant="info"
                    id="dropdown-basic"
                    className="profile-info"
                  >
                    {walletAddress.slice(0, 6)}
                    {"..."}
                    {walletAddress.slice(walletAddress.length - 6)}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <h6>Balances</h6>
                    {balance ? <div>{(parseFloat(balance)).toFixed(3)} BNB</div> : ""}                            
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <a className="btn btn-primary" onClick={() => setShowConnectModal(true)}>
                Connect
              </a>
            )}
            <ThemeSelector /></>
           
          </div>
       
        </Container>
      </Navbar>
      <ConnectWalletModal isOpen={showConnectModal} closeModal={() => setShowConnectModal(false)} />
    </section>
  );
}

export default Header;

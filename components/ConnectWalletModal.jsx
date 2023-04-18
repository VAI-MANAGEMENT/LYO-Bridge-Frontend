import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { WalletContext } from "../context/WalletConnect";
import Web3Calls from "../utils/web3Calls";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ConnectWalletModal({ isOpen, closeModal }) {
  const { disconnectWallet, connectToWallet, walletAddress, balance, chainId, mobileConnect } = useContext(WalletContext);

  return (
    <Modal show={isOpen} onHide={closeModal} isCentered>
      <Modal.Header closeButton>Select Wallet</Modal.Header>

      <Modal.Body paddingBottom="1.5rem">
        <div>
          <Button
            variant="outline"
            classNmae="connectLink"
            onClick={() => {
              connectToWallet("coinbasewallet");
              closeModal();
            }}
          >
            <div w="100%" justifyContent="center">
              <Image
                src="/wallet-icons/coinbase.png"
                alt="Coinbase Wallet Logo"
                width={25}
                height={25}
                borderRadius="3px"
              />
              <div>Coinbase Wallet</div>
            </div>
          </Button>
          <Button
            variant="outline"
            classNmae="connectLink"
            onClick={() => {
              connectToWallet("walletconnect");
              closeModal();
            }}
          >
            <div w="100%" justifyContent="center">
              <Image
                src="/wallet-icons/walletconnect.png"
                alt="Wallet Connect Logo"
                width={26}
                height={26}
                borderRadius="3px"
              />
              <div>Wallet Connect</div>
            </div>
          </Button>
          <Button
            variant="outline"
            classNmae="connectLink"
            onClick={() => {
              connectToWallet("injected");
              closeModal();
            }}
          >
            <div w="100%" justifyContent="center">
              <Image src="/wallet-icons/metamask.png" alt="Metamask Logo" width={25} height={25} borderRadius="3px" />
              <div>Metamask</div>
            </div>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConnectWalletModal;

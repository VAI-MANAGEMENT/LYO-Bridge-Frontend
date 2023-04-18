import { WalletContext } from "../context/WalletConnect";
import React, { useContext } from "react";
import errorImg from "../public/error.png";
import Image from "next/image";

const NetworkError = () => {
  const { switchNetwork, walletAddress, connectToWallet } = useContext(WalletContext);
  return (
    <>
      <div className="error-wrp">
        <Image src={errorImg} />
        <div>
          <p>Something went wrong</p>
          <span>
            You are connected to a wrong network.
            <br /> Please check connection in your wallet and switch network to
            continue.
          </span>
          <br />

          <button className="btn btn-success mt-2" onClick={switchNetwork}>
            Switch Network
          </button>
        </div>
      </div>
    </>
  );
};

export default NetworkError;

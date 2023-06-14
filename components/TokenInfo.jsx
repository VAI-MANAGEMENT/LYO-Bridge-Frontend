import ApiCalls from "../utils/apiCalls";
import React, { useState, useEffect, useContext } from "react";
import logoSmall from "../public/logo-small.png";
import lyotradeLogo from "../public/lyotradeLogo.svg";
import Image from "next/image";
import { BsArrowUpRightSquare, BsInfoCircle } from "react-icons/bs";
const TokenInfo = ({ }) => {
    const [tokenData, setTokenData] = useState();

    useEffect(() => {
        getTokenData();
    }, []);

    function getTokenData() {
        let result = ApiCalls.getTokenDetails();
        result
            .then((response) => {
                if (response.status == 200) {
                    setTokenData(response.data)
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <>
            {tokenData ?
                <div className="card-container mb-4">
                    <h3>Token Info</h3>
                    <div className="d-flex justify-content-between align-items-center gap-2 info-wrp"><span className="d-flex justify-content-between align-items-center gap-2"><Image src={logoSmall} width="25" height="25" /> <strong>LYOCREDIT</strong> (LYO)  $ {(parseFloat(tokenData.high)).toFixed(2)}</span><a href="https://www.lyotrade.com/en_US/trade/LYO_USDT" target="_blank" rel="noreferrer" className="align-items-center d-flex"><Image src={lyotradeLogo} width="25" height="25" /> <BsArrowUpRightSquare/></a></div>
                    <div className="d-flex justify-content-between align-items-center gap-2 info-wrp"><span>24 Hour Trading Vol</span><span>$ {(parseFloat(tokenData.vol)).toFixed(2)}</span></div>
                    <div className="d-flex justify-content-between align-items-center gap-2 info-wrp"><span>High</span><span>$ {(parseFloat(tokenData.high)).toFixed(2)}</span></div>
                    <div className="d-flex justify-content-between align-items-center gap-2 info-wrp"><span>Low</span><span>$ {(parseFloat(tokenData.low)).toFixed(2)}</span></div>
                </div>

                : ""
            }

        </>
    );
}

export default TokenInfo;
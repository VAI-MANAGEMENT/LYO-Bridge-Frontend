import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
        appName: "LFI", // Required
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // Required unless you provide a JSON RPC url; see `rpc` below
      }
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    },
  },
  injected: {
    package: null,
  },
};

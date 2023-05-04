import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ethers } from "ethers";
import Web3 from "web3";
import { supportNetwork, RPC_URLS } from "./network";

// export const CHAIN_ID = 56;
export const DEFAULT_CHAIN_ID = 1;
export const infura_Id = "";

export const getRpcUrl = () => {
  return {
    5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    1: "https://eth-mainnet.g.alchemy.com/v2/Mm0Dx17oDc52YllPQYiPWd6h0w6Mt8VV",
  }[DEFAULT_CHAIN_ID];
};

export const getWeb3 = (chainId) => {
  let setRpc = supportNetwork[chainId]
    ? supportNetwork[chainId].rpc
    : supportNetwork["default"].rpc;
  return new Web3(setRpc);
};

export const supportChainId = Object.keys(supportNetwork).map(function (key) {
  return parseInt(key);
});

export const injected = new InjectedConnector({
  supportedChainIds: supportChainId,
});

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true,
  infuraId: infura_Id,
});

export const coinbaseWallet = new WalletLinkConnector({
  url: `https://eth-mainnet.g.alchemy.com/v2/Mm0Dx17oDc52YllPQYiPWd6h0w6Mt8VV`,
  appName: "BDAI",
  supportedChainIds: supportChainId,
});

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
  getRpcUrl()
);
// export const web3 = new Web3(getRpcUrl());

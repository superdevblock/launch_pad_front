// import binanceCoin from '../images/binance-coin.png';
import dyno from "../images/dyno.png";
import ethCoin from "../images/coins/eth-coin.png";
import bnbCoin from "../images/coins/bnb-coin.png";

export const supportNetwork = {
  97: {
    name: "BNB Chain",
    chainId: 97,
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    image: bnbCoin,
    symbol: "BNB",
  },
  84531: {
    name: "Base Chain",
    chainId: 84531,
    rpc: "https://base-goerli.public.blastapi.io",
    image: ethCoin,
    symbol: "ETH",
  },
  default: {
    name: "Base Chain",
    chainId: 84531,
    rpc: "https://base-goerli.public.blastapi.io",
    image: ethCoin,
    symbol: "ETH",
  },
};

export const networkLists = [
  { code: 0, chainId: 97, label: 'BNB Chain', image: bnbCoin },
  { code: 0, chainId: 84531, label: 'BASE Chain', image: ethCoin }
]


export const RPC_URLS = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  84531: "https://base-goerli.public.blastapi.io",
};

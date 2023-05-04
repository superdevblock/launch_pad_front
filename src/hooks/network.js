import ethereumCoin from "../images/etherum1.png";

export const supportNetwork = {
  5: {
    name: "Goerli",
    chainId: 5,
    rpc: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    image: ethereumCoin,
    symbol: "ETH",
    owner: "0x9033606977d8E088fc744362Ee896fbE92479099",
    elev: "0x608B43ef7c1Ec64EE7C8167B68d52aDDec04Fb87",
    spaceId: "elevatetest.eth",
    snapshot: "https://testnet.snapshot.org",
    ipfs_snapshot: "https://snapshot.mypinata.cloud/",
    subgraph: "https://api.studio.thegraph.com/query/39184/elevate/v0.0.08",
    explore: "https://goerli.etherscan.io/"
  },
  1: {
    name: "Ethereum",
    chainId: 1,
    rpc: "https://eth-mainnet.g.alchemy.com/v2/Mm0Dx17oDc52YllPQYiPWd6h0w6Mt8VV",
    image: ethereumCoin,
    symbol: "ETH",
    owner: "0x966bC7a85930a6095A0a3C64747f0736e7E662D0",
    elev: "0x045109cF1Be9eDEC048AA0B3D7a323154a1aEA65",
    spaceId: "elevatepad.eth",
    snapshot: "https://hub.snapshot.org",
    ipfs_snapshot: "https://snapshot.mypinata.cloud/",
    subgraph: "",
    explore: "https://etherscan.io/"
  },
  default: {
    name: "Goerli",
    chainId: 5,
    rpc: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    image: ethereumCoin,
    symbol: "ETH",
    owner: "0x9033606977d8E088fc744362Ee896fbE92479099",
    elev: "0x608B43ef7c1Ec64EE7C8167B68d52aDDec04Fb87",
    spaceId: "elevatetest.eth",
    snapshot: "https://testnet.snapshot.org",
    ipfs_snapshot: "https://snapshot.mypinata.cloud/",
    subgraph: "https://api.studio.thegraph.com/query/39184/elevate/v0.0.08",
    explore: "https://goerli.etherscan.io/"
  },
};

export const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org",
  5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  1: "https://eth-mainnet.g.alchemy.com/v2/Mm0Dx17oDc52YllPQYiPWd6h0w6Mt8VV"
};

export const ipfsUrl = "https://snapshot.mypinata.cloud/"

export const getChainId = (queryChainId, chainId) => {
  const _chainId_ = 
    supportNetwork[queryChainId ? queryChainId : chainId]
    ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
    : supportNetwork["default"].chainId
  return _chainId_
}

export const getSnapshotIpfsUrl = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].ipfs_snapshot
}

export const getScanUrl = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].explore
}

export const getSubgraphUrl = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].subgraph
}

export const getSnapshotHttpUrl = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return `${supportNetwork[_chainId_].snapshot}/graphql`
}

export const getSnapshotUrl = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].snapshot
}

export const getSpaceId = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].spaceId
}

export const getProjectOwner = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].owner
}
        
export const getElevTokenAddress = (chainId) => {
  const _chainId_ = 
    supportNetwork[chainId]
    ? supportNetwork[chainId].chainId
    : supportNetwork["default"].chainId
  return supportNetwork[_chainId_].elev
}
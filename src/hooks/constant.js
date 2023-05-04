export const trimAddress = (addr) => {
  if (addr.length === 0) {
    return "";
  }
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};
export const trimLink = (link, decimals = 20) => {
  if (link.length === 0) {
    return "";
  }
  if(link.length < decimals) {
    return link
  }
  return `${link.substring(0, decimals)}...`;
};
//Launchpad Contract

export const contract = {
  // 1: { // eth
  //   poolfactory: "0x1db4823E2eeBfD4a14bDD885A9c1C5ccE6C52B03",
  //   poolmanager: "0x227445DB5ac54dd5d9b64e6c0f3FB0B7513c12c1",
  //   routeraddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //   multicallAddress: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  //   lockAddress: "0x759a271B300E25CDB815dc2071f894CdfaA81578",
  //   routername: "Uniswap",
  //   feeReceiver: "0x966bC7a85930a6095A0a3C64747f0736e7E662D0",
  //   dividendTracker: "0x0BF6741d78442fD434E4b571B33CA0C29989B16D",
  //   tokenfactory: "0x6Bfa30217aDbd1aF016D0b432D915c933a6e719b",
  //   distribute: "0x83918a0E7cBd6122c5aA788269C13Ef9C2B31d98",
  //   priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
  // },
  5: {
    poolfactory: "0x7662Da7F5392ceF27BD30C32D88b27B2a6C8C8Fa",
    poolmanager: "0xC47159f8956169C922a95F925b6173078C514707",
    routeraddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    multicallAddress: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
    lockAddress: "0x9dBeb19374b4342C52dEB23afB565626D35c8eE8",
    routername: "Uniswap",
    feeReceiver: "0x9033606977d8E088fc744362Ee896fbE92479099",
    dividendTracker: "0xA0aa0ec5DC9eFA296EeCD2C3A0657De4C0fe0ED6",
    tokenfactory: "0x83918a0E7cBd6122c5aA788269C13Ef9C2B31d98",
    distribute: "0x748427e3DF8D0E8C420A9b9ceDd1393fbcCA8EF6",
    priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
  },
  // 8453: { // Base sidechain
  //   poolfactory: "0x7662Da7F5392ceF27BD30C32D88b27B2a6C8C8Fa",
  //   poolmanager: "0xC47159f8956169C922a95F925b6173078C514707",
  //   routeraddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //   multicallAddress: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
  //   lockAddress: "0x9dBeb19374b4342C52dEB23afB565626D35c8eE8",
  //   routername: "Uniswap",
  //   feeReceiver: "0x9033606977d8E088fc744362Ee896fbE92479099",
  //   dividendTracker: "0xA0aa0ec5DC9eFA296EeCD2C3A0657De4C0fe0ED6",
  //   tokenfactory: "0x83918a0E7cBd6122c5aA788269C13Ef9C2B31d98",
  //   distribute: "0x748427e3DF8D0E8C420A9b9ceDd1393fbcCA8EF6",
  //   priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
  // },
  // default: {
  //   poolfactory: "0x7662Da7F5392ceF27BD30C32D88b27B2a6C8C8Fa",
  //   poolmanager: "0xC47159f8956169C922a95F925b6173078C514707",
  //   routeraddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //   multicallAddress: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
  //   lockAddress: "0x9dBeb19374b4342C52dEB23afB565626D35c8eE8",
  //   routername: "Uniswap",
  //   feeReceiver: "0x9033606977d8E088fc744362Ee896fbE92479099",
  //   dividendTracker: "0xA0aa0ec5DC9eFA296EeCD2C3A0657De4C0fe0ED6",
  //   tokenfactory: "0x83918a0E7cBd6122c5aA788269C13Ef9C2B31d98",
  //   distribute: "0x748427e3DF8D0E8C420A9b9ceDd1393fbcCA8EF6",
  //   priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
  // },
};

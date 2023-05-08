export const trimAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

//Launchpad Contract

export const contract = {
  56: {
    poolfactory: "0xf25973cfB2641F9759b65D9844C7543218B2a79b",
    poolmanager: "0xac6F1432101ffdA9056609Ba374F749757F40590",
    routeraddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    multicallAddress: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
    lockAddress: "0xAB989B51776f49f874D7E143010805E6B57Cb80a",
    routername: "Pancakeswap",
    feeReceiver: "0xC3FB36f461d1010f0eC831dF4e5706C5C90F7867",
    dividendTracker: "0xa461A00fC2F9F3B1c6b222bDB7E825bcC07D90bd",
  },
  default: {
    poolfactory: "0xf25973cfB2641F9759b65D9844C7543218B2a79b",
    poolmanager: "0xac6F1432101ffdA9056609Ba374F749757F40590",
    routeraddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    multicallAddress: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
    lockAddress: "0xAB989B51776f49f874D7E143010805E6B57Cb80a",
    routername: "Pancakeswap",
    feeReceiver: "0xC3FB36f461d1010f0eC831dF4e5706C5C90F7867",
    dividendTracker: "0xa461A00fC2F9F3B1c6b222bDB7E825bcC07D90bd",
  },
};

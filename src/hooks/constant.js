export const trimAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

//Launchpad Contract

export const contract = {
  84531: {
    poolfactory:      "0x86841b1Edc2e85188463b04294f969B263C41eA2",
    poolmanager:      "0x0c70E854F57b38561E72f82e4Fd29eE696441fE9",
    routeraddress:    "0x48ec46497ad59acaba41545363cf36fe77786fa7",
    multicallAddress: "0x18540e2a38e3f7eae2a543b572e80304c70965a3",
    lockAddress:      "0xb526ee481682698a04ef4711d9b979f1d25254b1",
    routername:       "Pancakeswap",
    feeReceiver:      "0xCE035af21b4697101Aaf12C261bc6C79b0e38271",
    dividendTracker:  "0xa2532b333215a3330a79609bba0d6a21c9d188f1",
  },
  97: {
    poolfactory:      "0x4D9fcd58CaaC77Be755efD7025E548af30b5463E",
    poolmanager:      "0x2bc0D8D11f7F56481966B9C74C7De6AeeBd87293",
    routeraddress:    "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3",
    multicallAddress: "0x51b96c775857F8646D61Ebc426019871d520b8C6",
    lockAddress:      "0x76bac560e58e0ef93f5df6664a24b699d2a3f7bd",
    routername:       "Pancakeswap",
    feeReceiver:      "0xCE035af21b4697101Aaf12C261bc6C79b0e38271",
    dividendTracker:  "0xb2ea306f4b49e4a1ba95e8dbd0f9a43737468d84",    
  },
  default: {
    poolfactory:      "0x86841b1Edc2e85188463b04294f969B263C41eA2",
    poolmanager:      "0x0c70E854F57b38561E72f82e4Fd29eE696441fE9",
    routeraddress:    "0x48ec46497ad59acaba41545363cf36fe77786fa7",
    multicallAddress: "0x18540e2a38e3f7eae2a543b572e80304c70965a3",
    lockAddress:      "0xb526ee481682698a04ef4711d9b979f1d25254b1",
    routername:       "Pancakeswap",
    feeReceiver:      "0xCE035af21b4697101Aaf12C261bc6C79b0e38271",
    dividendTracker:  "0xa2532b333215a3330a79609bba0d6a21c9d188f1",
  },
};

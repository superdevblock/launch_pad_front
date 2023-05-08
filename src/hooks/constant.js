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

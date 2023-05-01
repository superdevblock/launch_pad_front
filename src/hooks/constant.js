export const trimAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

//Launchpad Contract
export const contract = {
  56: {
    poolfactory: "",
    poolmanager: "",
    routeraddress: "",
    multicallAddress: "",
    lockAddress: "",
    routername: "",
    feeReceiver: "",
    dividendTracker: "",
  },
  default: {
    poolfactory: "",
    poolmanager: "",
    routeraddress: "",
    multicallAddress: "",
    lockAddress: "",
    routername: "",
    feeReceiver: "",
    dividendTracker: "",
  },
};

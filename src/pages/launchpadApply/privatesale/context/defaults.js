// This file holds the initial, default values for context
// Note: it's good practice to specify defaults here,
//  but in our case they are overwritten by the values
//  within AppContextProvider

export const defaultValue = {
  step: 1,
  maxStep: 5,
  currencyAddress: "0x0000000000000000000000000000000000000000",
  currencyTSymbol: "BNB",
  tokenAddress: "",
  tokenSymbol: "",
  tokenName: "",
  tokenDecimal: "",
  feesType: "1",
  isApprove: false,
  presalerate: 0,
  whitelist: "2",
  softcap: 0,
  hardcap: 0,
  minbuy: 0,
  maxbuy: 0,
  refund: 1,
  routeraddress: "",
  starttime: new Date(),
  endtime: new Date(),
  isVesting: false,
  firstrelease: 0,
  cycle: 0,
  eachcycleper: 0,
  logourl: "",
  bannerurl: "",
  website: "",
  facebook: "",
  twitter: "",
  github: "",
  telegram: "",
  instagram: "",
  discord: "",
  reddit: "",
  youtube: "",
  brief: "",
  partnerAddress: [],
  kyc: false,
  audit: false,
  totalCost: 0,
  totaltoken: 0,
  usermail: "",
  auditlink: "",
  kyclink: "",
};

const defaultContext = {
  value: defaultValue,
  setValue: () => {},
  btnNextStep: () => {},
  btnPrevStep: () => {},
  handleInput: () => {},
};

export default defaultContext;

export const feesSetting = {
  1: {
    token: 0,
    bnb: 5,
    extra: 0,
  },
  2: {
    token: 2,
    bnb: 2,
    extra: 0,
  },
  3: {
    token: 3,
    bnb: 0,
    extra: 0,
  },
};

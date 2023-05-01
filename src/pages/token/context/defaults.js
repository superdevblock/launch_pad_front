// This file holds the initial, default values for context
// Note: it's good practice to specify defaults here,
//  but in our case they are overwritten by the values
//  within AppContextProvider

export const defaultValue = {
  name: "",
  symbol: "",
  decimals: "",
  supply: "",
  rewardAddr: "",
  minDividends: "",
  marketingWallet: "",
  marketingFee: "",
  rewardFee: "",
  liquidityFee: "",
  buybackFee: "",
  reflectionFee: "",
  yieldFee: "",
  charityAddr: "",
  charityFee: "",
};

const defaultContext = {
  value: defaultValue,
  setValue: () => {},
  handleInput: () => {},
};

export default defaultContext;

import React, { useContext, useState } from "react";
import TokenInput from "../../../component/TokenInput";
import Context from "./context/Context";
import { getWeb3 } from "../../../hooks/connectors";
import { toast } from "react-toastify";
import { contract } from "../../../hooks/constant";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../../../hooks/contractHelper";
import tokenAbi from "../../../json/token.json";
import { parseEther } from "@ethersproject/units";
import Button from "react-bootstrap-button-loader";
import { supportNetwork } from "../../../hooks/network";
import { currencies } from "../../../hooks/currencies";

export default function Step1() {
  const context = useWeb3React();
  const { chainId, account, library } = context;
  const { value, btnNextStep, setValue } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState(value.currencyTSymbol);

  const currencyList =
    currencies[chainId] !== undefined
      ? currencies[chainId]
      : currencies["default"];

  const firstStepSubmit = (e) => {
    if (
      value.tokenName !== "" ||
      value.tokenDecimal !== "" ||
      value.tokenSymbol !== ""
    ) {
      btnNextStep(e);
    } else {
    }
  };

  const handleFeesChange = async (e) => {
    setValue({ ...value, feesType: e.target.value });
  };

  const handleCurrencyChange = async (e) => {
    const currencyList =
      currencies[chainId] !== undefined
        ? currencies[chainId]
        : currencies["default"];

    currencyList.map((currency, key) => {
      if (currency.address === e.target.value) {
        setValue({
          ...value,
          currencyTSymbol: currency.symbol,
          currencyAddress: currency.address,
        });
        setSymbol(currency.symbol);
      }
    });
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (account) {
      if (chainId) {
        try {
          if (value.tokenAddress) {
            setLoading(true);
            let poolfactoryAddress = contract[chainId]
              ? contract[chainId].poolfactory
              : contract["default"].poolfactory;
            let tokenContract = getContract(
              tokenAbi,
              value.tokenAddress,
              library
            );
            let amount = parseEther("1000000000000000000000000000").toString();

            let tx = await tokenContract.approve(poolfactoryAddress, amount, {
              from: account,
            });
            const resolveAfter3Sec = new Promise((resolve) =>
              setTimeout(resolve, 10000)
            );
            toast.promise(resolveAfter3Sec, {
              pending: "Waiting for confirmation 👌",
            });
            var interval = setInterval(async function () {
              let web3 = getWeb3(chainId);
              var response = await web3.eth.getTransactionReceipt(tx.hash);
              if (response != null) {
                clearInterval(interval);
                if (response.status === true) {
                  toast.success(
                    "Success ! Your last transaction is success 👍"
                  );
                  setLoading(false);
                  setValue({ ...value, isApprove: true });
                } else if (response.status === false) {
                  toast.error("Error ! Your last transaction is failed.");
                  setLoading(false);
                } else {
                  toast.error("Error ! something went wrong.");
                  setLoading(false);
                }
              }
            }, 5000);
          } else {
            toast.error("Please enter valid token address !");
            setLoading(false);
          }
        } catch (err) {
          toast.error(err.reason);
          setLoading(false);
        }
      } else {
        toast.error("Please select Smart Chain Network !");
        setLoading(false);
      }
    } else {
      toast.error("Please Connect Wallet!");
      setLoading(false);
    }
  };

  return (
    <div
      className={`tab-pane ${value.step === 1 ? "active" : ""}`}
      role="tabpanel"
      id="step1"
    >
      <h4 className="text-center">Enter the token address and verify</h4>
      <div className="row">
        <TokenInput value={value} setValue={setValue} />
        <div className="col-md-12 mt-4 mb-0">
          <label>Currency</label>
          {currencyList.map((currency, key) => {
            return (
              <div className="form-check">
                <input
                  type="radio"
                  style={{ width: "auto" }}
                  className="form-check-input"
                  name="currency"
                  value={currency.address}
                  onChange={(e) => handleCurrencyChange(e)}
                  checked={
                    value.currencyAddress === currency.address ? true : false
                  }
                />
                {currency.symbol}
              </div>
            );
          })}
        </div>
        <div className="col-md-12 mt-4 mb-0">
          <label>Fee Options</label>
          <div className="form-check">
            <span className="form-check-label">
              <input
                type="radio"
                style={{ width: "auto" }}
                className="form-check-input"
                name="fees"
                value="3"
                onChange={(e) => handleFeesChange(e)}
                checked={value.feesType === "1" ? true : false}
              />
              0.5 BNB + 3% {symbol} raised only
            </span>
          </div>
        </div>
      </div>
      <ul className="list-inline text-center">
        {value.isApprove ? (
          <li>
            <button
              type="button"
              className="btn default-btn next-step"
              onClick={(e) => firstStepSubmit(e)}
            >
              Continue to next step
            </button>
          </li>
        ) : (
          <li>
            <Button
              type="button"
              variant="none"
              className="default-btn next-step"
              onClick={(e) => handleApprove(e)}
              loading={loading}
            >
              Approve
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
}

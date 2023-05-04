import React, { useContext, useState } from "react";
import Context from "./context/Context";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap-button-loader";
import { contract } from "../../hooks/constant";
import { getContract } from "../../hooks/contractHelper";
import { useWeb3React } from "@web3-react/core";
import TokenFactoryABI from "../../json/tokenFactory.json"
import { getWeb3 } from "../../hooks/connectors";

export default function BuyBackBabyToken(props) {
  const { createFee } = props;
  const history = useHistory();
  const { value, setValue } = useContext(Context);

  const context = useWeb3React();
  const { account, chainId, library } = context;

  const [createloading, setCreateLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    symbol: "",
    supply: "",
    rewardAddr: "",
    liquidityFee: "",
    buybackFee: "",
    reflectionFee: "",
    marketingFee: "",
  });

  const checkBuyBackValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "name":
        if (inputValue === "") {
          terror += 1;
          message = "Please Input Token Name!";
        } else {
          message = "";
        }
        break;
      case "symbol":
        if (inputValue === "") {
          terror += 1;
          message = "Please Input Token Symbol!";
        } else {
          message = "";
        }
        break;
      case "supply":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Supply Can Not Be Zero!";
        } else {
          message = "";
        }
        break;
      case "rewardAddr":
        if (inputValue === "") {
          terror += 1;
          message = "Please Input Reward Token Address!";
        } else {
          message = "";
        }
        break;
      case "liquidityFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) < 0) {
          terror += 1;
          message = "Liquidity Fee Can Not Less Than Zero!";
        } else {
          message = "";
        }
        break;
      case "buybackFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) < 0) {
          terror += 1;
          message = "Buyback Fee Can Not Less Than Zero!";
        } else {
          message = "";
        }
        break;
      case "reflectionFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) < 0) {
          terror += 1;
          message = "Reflection Fee Can Not Less Than Zero!";
        } else {
          message = "";
        }
        break;
      case "marketingFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) < 0) {
          terror += 1;
          message = "Marketing Fee Can Not Less Than Zero!";
        } else {
          message = "";
        }
        break;
      default:
        terror += 0;
        break;
    }

    if (terror > 0) {
      setError({ ...error, [input]: message });
      return false;
    } else {
      setError({ ...error, [input]: "" });
      return true;
    }
  };

  const checkBuyBackAllValidation = () => {
    let terror = 0;
    var reg;
    Object.keys(value).map((key, index) => {
      let inputValue;
      switch (key) {
        case "name":
          if (value[key] === "") {
            terror += 1;
          }
          break;
        case "symbol":
          if (value[key] === "") {
            terror += 1;
          }
          break;
        case "supply":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) <= 0) {
            terror += 1;
          }
          break;
        case "liquidityFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) < 0) {
            terror += 1;
          }
          break;
        case "buybackFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) < 0) {
            terror += 1;
          }
          break;
        case "reflectionFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) < 0) {
            terror += 1;
          }
          break;
        case "marketingFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) < 0) {
            terror += 1;
          }
          break;
        default:
          terror += 0;
          break;
      }
      return true;
    });
    if (terror > 0) {
      return false;
    } else {
      return true;
    }
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    checkBuyBackValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleCreateBuyBackToken = async (e) => {
    e.preventDefault();
    let check = checkBuyBackValidation();
    if (check) {
      try {
        setCreateLoading(true);
        if (account) {
          if (chainId) {
            let tokenFactoryAddress = contract[chainId]
              ? contract[chainId].tokenfactory
              : contract["default"].tokenfactory;
            let factoryContract = getContract(
              TokenFactoryABI,
              tokenFactoryAddress,
              library
            );

            let tx = await factoryContract.createBuyback(
              value["name"],
              value["symbol"],
              value["supply"] + "0".repeat(9),
              value["rewardAddr"],
              contract[chainId]["routeraddress"],
              [
                (value["liquidityFee"] * 100).toString(),
                (value["buybackFee"] * 100).toString(),
                (value["reflectionFee"] * 100).toString(),
                (value["marketingFee"] * 100).toString(),
                (
                  (value["liquidityFee"] * 100 +
                    value["buybackFee"] * 100 +
                    value["reflectionFee"] * 100 +
                    value["marketingFee"] * 100 +
                    1) *
                  4
                ).toString(),
              ],
              contract[chainId]["feeReceiver"],
              createFee.toString(),
              {from:account, value:createFee.toString()}
            );
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
                  toast.success("Success ! Your last transaction is success 👍");
                  setCreateLoading(false);
                  if (typeof response.logs[0] !== "undefined") {
                    history.push(
                      `/token-details?addr=${response.logs[1].address}`
                    );
                  } else {
                    toast.error("Something went wrong !");
                    history.push("/");
                  }
                } else if (response.status === false) {
                  toast.error("Error ! Your last transaction is failed.");
                  setCreateLoading(false);
                } else {
                  toast.error("Error ! something went wrong.");
                  setCreateLoading(false);
                }
              }
            }, 5000);
          } else {
            toast.error("Wrong network selected !");
            setCreateLoading(false);
          }
        } else {
          toast.error("Please Connect Wallet!");
          setCreateLoading(false);
        }
      } catch (err) {
        toast.error(err.reason ? err.reason : err.message);
        setCreateLoading(false);
      }
    } else {
      toast.error("Please enter valid details!!");
      setCreateLoading(false);
    }
  };

  return (
    <div className={`tab-pane active mt-3`} role="tabpanel" id="step1">
      <div className="row">
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Name<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.name}
              type="text"
              name="name"
              placeholder="Ex: Ethereum"
            />
            <small className="text-danger">{error.name}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Symbol<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.symbol}
              type="text"
              name="symbol"
              placeholder="Ex: ETH"
            />
            <small className="text-danger">{error.symbol}</small>
            <br />
          </div>
        </div>
        <div className="col-12 mb-0">
          <div className="">
            <label>
              Total Supply<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.supply}
              type="number"
              name="supply"
              placeholder="Ex: 1000000000000000"
            />
            <small className="text-danger">{error.supply}</small>
            <br />
          </div>
        </div>
        <div className="col-12 mb-0">
          <div className="">
            <label>
              Reward token <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.rewardAddr}
              type="text"
              name="rewardAddr"
              placeholder="Ex: 0x20"
            />
            <small className="text-danger">{error.rewardAddr}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Liquidity Fee (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.liquidityFee}
              type="number"
              name="liquidityFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.liquidityFee}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Buyback fee (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.buybackFee}
              type="number"
              name="buybackFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.buybackFee}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Reflection fee (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.reflectionFee}
              type="number"
              name="reflectionFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.reflectionFee}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Marketing Fee (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.marketingFee}
              type="number"
              name="marketingFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.marketingFee}</small>
            <br />
          </div>
        </div>
      </div>
      <ul className="list-inline text-center">
        <li>
          <Button
            type="button"
            className="default-btn"
            loading={createloading}
            onClick={(e) => handleCreateBuyBackToken(e)}
          >
            Create Token
          </Button>
        </li>
      </ul>
    </div>
  );
}

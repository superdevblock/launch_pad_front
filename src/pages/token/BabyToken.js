import React, { useContext, useState } from "react";
import Context from "./context/Context";
import Web3 from "web3";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import tokenByte from "../../bytecode/Tokens.json";
import BabyTokenABI from "../../json/BabyToken.json";
import Button from "react-bootstrap-button-loader";
import { contract } from "../../hooks/constant";

export default function BabyToken(props) {
  const { createFee } = props;
  const history = useHistory();
  const { value, setValue } = useContext(Context);

  const [createloading, setCreateLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    symbol: "",
    supply: "",
    rewardAddr: "",
    minDividends: "",
    marketingWallet: "",
    marketingFee: "",
    rewardFee: "",
    liquidityFee: "",
  });

  const checkBabyTokenValidation = (input, inputValue) => {
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
      case "minDividends":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Minimum Token Balance For Dividends Can Not Be Zero!";
        } else {
          message = "";
        }
        break;
      case "marketingWallet":
        if (inputValue === "") {
          terror += 1;
          message = "Please Input Marketing Wallet Address!";
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
      case "rewardFee":
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
      case "liquidityFee":
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

  const checkBabyTokenAllValidation = () => {
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
        case "rewardAddr":
          if (value[key] === "") {
            terror += 1;
          }
          break;
        case "minDividends":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) <= 0) {
            terror += 1;
          }
          break;
        case "marketingWallet":
          if (value[key] === "") {
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
        case "rewardFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) < 0) {
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
    checkBabyTokenValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleCreateBabyToken = async (e) => {
    e.preventDefault();
    let check = checkBabyTokenAllValidation();
    if (check) {
      try {
        setCreateLoading(true);

        window.web3 = new Web3(window.ethereum);
        let tokenContract = new window.web3.eth.Contract(BabyTokenABI);
        let accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length == 0) {
          toast.error("error ! connect wallet! 👍");
          setCreateLoading(false);
          return;
        }

        const resolveAfter3Sec = new Promise((resolve) =>
          setTimeout(resolve, 10000)
        );
        await tokenContract
          .deploy({
            data: tokenByte["BabyToken"],
            arguments: [
              value["name"],
              value["symbol"],
              value["supply"] + "0".repeat(18),
              [
                value["rewardAddr"],
                contract["default"]["routeraddress"],
                value["marketingWallet"],
                contract["default"]["dividendTracker"],
              ],
              [
                value["marketingFee"],
                value["rewardFee"],
                value["liquidityFee"],
              ],
              value["minDividends"],
              contract["default"]["feeReceiver"],
              createFee.toString(),
            ],
          })
          .send(
            {
              value: createFee.toString(),
              from: accounts[0],
            },
            function (error, transactionHash) {
              if (transactionHash != undefined)
                toast.promise(resolveAfter3Sec, {
                  pending: "Waiting for confirmation 👌",
                });
            }
          )
          .on("error", function (error) {
            toast.error("error ! something went wrong! 👍");
            setCreateLoading(false);
          })
          .on("receipt", function (receipt) {
            toast.success("success ! your last transaction is success 👍");
            setCreateLoading(false);
            history.push(`/token-details?addr=${receipt.contractAddress}`);
          });
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
        <div className="col-12 col-md-6  mb-0">
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
        <div className="col-12 col-md-6  mb-0">
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
        <div className="col-12 col-md-6 mb-0">
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
              placeholder="Ex: 0x208013b056978e76913efdF7F15EaB5130B7647B"
            />
            <small className="text-danger">{error.rewardAddr}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Minimum token balance for dividends
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.minDividends}
              type="number"
              name="minDividends"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.minDividends}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Marketing Wallet <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.marketingWallet}
              type="text"
              name="marketingWallet"
              placeholder="Ex: 0x208013b056978e76913efdF7F15EaB5130B7647B"
            />
            <small className="text-danger">{error.rewardAddr}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Marketing fee (%)
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
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Token reward fee (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.rewardFee}
              type="number"
              name="rewardFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.rewardFee}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Auto add liquidity
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
      </div>
      <ul className="list-inline text-center">
        <li>
          <Button
            type="button"
            className="default-btn"
            loading={createloading}
            onClick={(e) => handleCreateBabyToken(e)}
          >
            Create Token
          </Button>
        </li>
      </ul>
    </div>
  );
}

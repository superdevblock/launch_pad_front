import React, { useContext, useState } from "react";
import Context from "./context/Context";
import Web3 from "web3";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import tokenByte from "../../bytecode/Tokens.json";
import LiquidityTokenABI from "../../json/LiquidityToken.json";
import Button from "react-bootstrap-button-loader";
import { contract } from "../../hooks/constant";

export default function LiquidityToken(props) {
  const { createFee } = props;
  const history = useHistory();
  const { value, setValue } = useContext(Context);
  const [createloading, setCreateLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    symbol: "",
    supply: "",
    yieldFee: "",
    liquidityFee: "",
    charityAddr: "",
    charityFee: "",
  });

  const checkLiquidityTokenValidation = (input, inputValue) => {
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
      case "liquidityFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Liquidity Fee Can Not Be Zero!";
        } else {
          message = "";
        }
        break;
      case "yieldFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Yield Fee Can Not Be Zero!";
        } else {
          message = "";
        }
        break;
      case "charityFee":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Charity/Marketing Fee Can Not Be Zero!";
        } else {
          message = "";
        }
        break;
      case "charityAddr":
        if (inputValue === "") {
          terror += 1;
          message = "Please Input Charity/Marketing Address!";
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

  const checkLiquidityTokenAllValidation = () => {
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
          } else if (parseFloat(inputValue) <= 0) {
            terror += 1;
          }
          break;
        case "yieldFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) <= 0) {
            terror += 1;
          }
          break;
        case "charityFee":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) <= 0) {
            terror += 1;
          }
          break;
        case "charityAddr":
          if (value[key] === "") {
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
    checkLiquidityTokenValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleCreateLiquidityToken = async (e) => {
    console.log("handleCreateLiquidityToken");
    
    e.preventDefault();
    let check = checkLiquidityTokenAllValidation();
    if (check) {
      try {
        setCreateLoading(true);

        window.web3 = new Web3(window.ethereum);
        let tokenContract = new window.web3.eth.Contract(LiquidityTokenABI);
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
            data: tokenByte["LiquidityGeneratorToken"],
            arguments: [
              value["name"],
              value["symbol"],
              value["supply"] + "0".repeat(9),
              contract["default"]["routeraddress"],
              value["charityAddr"],
              value["yieldFee"],
              value["liquidityFee"],
              value["charityFee"],
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
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Transaction fee to generate yield(%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.yieldFee}
              type="number"
              name="yieldFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.yieldFee}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Transaction fee to generate liquidity (%)
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
              Charity/Marketing address <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.charityAddr}
              type="text"
              name="charityAddr"
              placeholder="Ex: 0x208013b056978e76913efdF7F15EaB5130B7647B"
            />
            <small className="text-danger">{error.charityAddr}</small>
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-0">
          <div className="">
            <label>
              Charity/Marketing percent (%)
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.charityFee}
              type="number"
              name="charityFee"
              placeholder="Ex: 1"
            />
            <small className="text-danger">{error.charityFee}</small>
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
            onClick={(e) => handleCreateLiquidityToken(e)}
          >
            Create Token
          </Button>
        </li>
      </ul>
    </div>
  );
}

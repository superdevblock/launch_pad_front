import React, { useContext, useState } from "react";
import Context from "./context/Context";
import { BigNumber, ethers } from "ethers";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap-button-loader";
import { contract } from "../../hooks/constant";
import { getContract } from "../../hooks/contractHelper";
import { useWeb3React } from "@web3-react/core";
import TokenFactoryABI from "../../json/tokenFactory.json"
import { getWeb3 } from "../../hooks/connectors";

export default function StandardToken(props) {
  const { createFee } = props;
  const history = useHistory();
  const { value, setValue } = useContext(Context);
  const [createloading, setCreateLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    symbol: "",
    decimals: "",
    supply: "",
  });

  const context = useWeb3React();
  const { account, chainId, library } = context;

  const checkStandardValidation = (input, inputValue) => {
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
      case "decimals":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 1) {
          terror += 1;
          message = "Decimals must be 2 at least!";
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
          message = "Supply must not be zero!";
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

  const checkStandardAllValidation = () => {
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
        case "decimals":
          inputValue = parseFloat(value[key]);
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
            terror += 1;
          } else if (parseFloat(inputValue) <= 1) {
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
    checkStandardValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleCreateToken = async (e) => {
    e.preventDefault();
    let check = checkStandardAllValidation();
    if (check) {
      try {
        setCreateLoading(true);
        if (account) {
          if (chainId) {
            let tokenFactoryAddress = contract[chainId]
              ? contract[chainId].tokenfactory
              : contract["default"].tokenfactory;
            let feeAddress = contract[chainId]
              ? contract[chainId].feeReceiver
              : contract["default"].feeReceiver;
            let factoryContract = getContract(
              TokenFactoryABI,
              tokenFactoryAddress,
              library
            );

            let tx = await factoryContract.createStandard(
              value.name,
              value.symbol,
              Number(value.decimals),
              BigNumber.from(value.supply + "0".repeat(value["decimals"])),
              0,
              0,
              feeAddress,
              BigNumber.from(createFee.toString()),
              {from:account, value:BigNumber.from(createFee.toString())}
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
                      `/token-details?addr=${response.logs[0].address}`
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
        <div className="col-12 mb-0">
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
        <div className="col-12 mb-0">
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
              Decimals<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.decimals}
              type="number"
              name="decimals"
              placeholder="Ex: 18"
            />
            <small className="text-danger">{error.decimals}</small>
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
      </div>
      <ul className="list-inline text-center">
        <li>
          <Button
            type="button"
            className="default-btn"
            loading={createloading}
            onClick={(e) => handleCreateToken(e)}
          >
            Create Token
          </Button>
        </li>
      </ul>
    </div>
  );
}

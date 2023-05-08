import React, { useContext, useState } from "react";
import Context from "./context/Context";
import { ethers } from "ethers";
import Web3 from "web3";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import tokenByte from "../../bytecode/Tokens.json";
import StandardTokenABI from "../../json/StandardToken.json";
import Button from "react-bootstrap-button-loader";
import { contract } from "../../hooks/constant";

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
    console.log("handleCreateToken");
    e.preventDefault();
    let check = checkStandardAllValidation();
    if (check) {
      try {
        setCreateLoading(true);

        console.log(window);

        window.web3 = new Web3(window.ethereum);
        let accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        let tokenContract = new window.web3.eth.Contract(StandardTokenABI);

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
            data: tokenByte["StandardToken"],
            arguments: [
              value["name"],
              value["symbol"],
              value["decimals"],
              value["supply"] + "0".repeat(value["decimals"]),
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

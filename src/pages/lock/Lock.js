import React, { useContext, useState } from "react";
import LockInput from "../../component/LockInput";
import Context from "./context/Context";
import { getWeb3 } from "../../hooks/connectors";
import { toast } from "react-toastify";
import { contract } from "../../hooks/constant";
import { useWeb3React } from "@web3-react/core";
import { getContract, mulDecimal } from "../../hooks/contractHelper";
import tokenAbi from "../../json/token.json";
import lockAbi from "../../json/lockabi.json";
import { parseEther } from "@ethersproject/units";
import Button from "react-bootstrap-button-loader";
import DatePicker from "react-datepicker";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../images/icon.png";

export default function Lock() {
  const context = useWeb3React();
  const { chainId, account, library } = context;
  const { value, setValue } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [lockloading, setLockLoading] = useState(false);
  const [error, setError] = useState({
    owner: "",
    title: "",
    amount: "",
    TGEDate: "",
    TGEPercent: "",
    Cycle: "",
    ReleasePercent: "",
  });

  const checkValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "amount":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) > value.balance) {
          terror += 1;
          message = "amount must be less than or equal to!";
        } else {
          message = "";
        }
        break;

      case "TGEDate":
        if (inputValue === "" || inputValue === null) {
          terror += 1;
          message = "Please enter valid date";
        } else if (inputValue < new Date()) {
          terror += 1;
          message = "Start Time must be after current time";
        } else {
          message = "";
        }
        break;
      case "TGEPercent":
      case "ReleasePercent":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Number!";
        } else if (
          (value.isvesting && !reg.test(inputValue)) ||
          parseFloat(inputValue) > 100
        ) {
          terror += 1;
          message = "percentage must be less than 100%!";
        } else {
          message = "";
        }
        break;
      case "Cycle":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Number!";
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

  const checkAllValidation = () => {
    let terror = 0;
    var reg;
    Object.keys(value).map((key, index) => {
      switch (key) {
        case "title":
          if (value[key] === "") {
            terror += 1;
          }
          break;
        case "owner":
          if (value.isDiffOwner && value[key] === "") {
            terror += 1;
          }
          break;
        case "amount":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (!reg.test(value[key]) || parseFloat(value[key]) <= 0) {
            terror += 1;
          } else if (parseFloat(value[key]) > value.balance) {
            terror += 1;
          }
          break;

        case "TGEDate":
          if (value.isvesting && (value[key] === "" || value[key] === null)) {
            terror += 1;
          } else if (value.isvesting && value[key] < new Date()) {
            terror += 1;
          }
          break;
        case "TGEPercent":
        case "ReleasePercent":
          reg = new RegExp(/^\d+$/);
          if (
            value.isvesting &&
            (!reg.test(value[key]) || parseFloat(value[key]) <= 0)
          ) {
            terror += 1;
          } else if (
            value.isvesting &&
            (!reg.test(value[key]) || parseFloat(value[key]) > 100)
          ) {
            terror += 1;
          }
          break;
        case "Cycle":
          reg = new RegExp(/^\d+$/);
          if (
            value.isvesting &&
            (!reg.test(value[key]) || parseFloat(value[key]) <= 0)
          ) {
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

  const handleApprove = async (e) => {
    e.preventDefault();
    if (account) {
      if (chainId) {
        try {
          if (value.tokenAddress) {
            setLoading(true);
            let poolfactoryAddress = contract[chainId]
              ? contract[chainId].lockAddress
              : contract["default"].lockAddress;
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
              setTimeout(resolve, 5000)
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
                    "success ! your last transaction is success 👍"
                  );
                  setLoading(false);
                  setValue({ ...value, isApprove: true });
                } else if (response.status === false) {
                  toast.error("error ! Your last transaction is failed.");
                  setLoading(false);
                } else {
                  toast.error("error ! something went wrong.");
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

  const onDiffOwner = (e) => {
    setValue({ ...value, isDiffOwner: e.target.checked });
  };

  const onChangeVesting = (e) => {
    setValue({ ...value, isvesting: e.target.checked });
  };

  const onOwnerAddress = (e) => {
    let web3 = getWeb3(chainId);
    let check = web3.utils.isAddress(e.target.value);
    if (!check) {
      setError({ ...error, [e.target.name]: "please enter valid address" });
    } else {
      setError({ ...error, [e.target.name]: "" });
    }
    setValue({ ...value, owner: e.target.value });
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    checkValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleEndTimeChange = (date) => {
    checkValidation("TGEDate", date);
    setValue({ ...value, TGEDate: date });
  };

  const handleLockToken = async (e) => {
    e.preventDefault();
    let check = checkAllValidation();
    if (check) {
      try {
        let web3 = getWeb3(chainId);
        setLockLoading(true);
        let lockAddress = contract[chainId]
          ? contract[chainId].lockAddress
          : contract["default"].lockAddress;
        let lockContract = getContract(lockAbi, lockAddress, library);
        if (value.isvesting) {
          let tx = await lockContract.vestingLock(
            value.owner ? value.owner : account,
            value.tokenAddress,
            value.islp === 1 ? true : false,
            mulDecimal(value.amount, value.tokenDecimal),
            Math.floor(new Date(value.TGEDate).getTime() / 1000.0),
            value.TGEPercent * 100,
            value.Cycle * 60,
            value.ReleasePercent * 100,
            value.title,
            { from: account }
          );
          const resolveAfter3Sec = new Promise((resolve) =>
            setTimeout(resolve, 5000)
          );
          toast.promise(resolveAfter3Sec, {
            pending: "Waiting for confirmation 👌",
          });
          let interval = setInterval(async function () {
            var response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              clearInterval(interval);
              if (response.status === true) {
                toast.success("success ! your last transaction is success 👍");
                setLockLoading(false);
              } else if (response.status === false) {
                toast.error("error ! Your last transaction is failed.");
                setLockLoading(false);
              } else {
                toast.error("error ! something went wrong.");
                setLockLoading(false);
              }
            }
          }, 5000);
        } else {
          let tx = await lockContract.lock(
            value.isDiffOwner ? value.owner : account,
            value.tokenAddress,
            value.islp === 1 ? true : false,
            mulDecimal(value.amount, value.tokenDecimal),
            web3.utils.toHex(
              Math.floor(new Date(value.TGEDate).getTime() / 1000.0)
            ),
            value.title,
            { from: account }
          );
          const resolveAfter3Sec = new Promise((resolve) =>
            setTimeout(resolve, 5000)
          );
          toast.promise(resolveAfter3Sec, {
            pending: "Waiting for confirmation 👌",
          });
          let interval = setInterval(async function () {
            var response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              clearInterval(interval);
              if (response.status === true) {
                toast.success("success ! your last transaction is success 👍");
                setLockLoading(false);
              } else if (response.status === false) {
                toast.error("error ! Your last transaction is failed.");
                setLockLoading(false);
              } else {
                toast.error("error ! something went wrong.");
                setLockLoading(false);
              }
            }
          }, 5000);
        }
      } catch (err) {
        toast.error(err.reason ? err.reason : err.message);
        setLockLoading(false);
      }
    } else {
      toast.error("Please enter valid details!!");
      setLockLoading(false);
    }
  };

  return (
    <div className={`tab-pane active mt-3`} role="tabpanel" id="step1">
      <h4 className="text-center">Enter the token lock information</h4>
      <div className="row">
        <LockInput value={value} setValue={setValue} />

        <div className="col-md-12 mt-4 mb-0">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input mb-2"
              type="checkbox"
              onChange={(e) => onDiffOwner(e)}
              id="inlineCheckbox1"
            />
            <label className="form-check-label" htmlFor="inlineCheckbox1">
              Use another owner?
            </label>
          </div>
        </div>

        {value.isDiffOwner && (
          <div className="col-md-12 mt-4 mb-0">
            <div className="form-group">
              <label>
                Owner<span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                value={value.owner}
                onChange={(e) => onOwnerAddress(e)}
                type="text"
                name="owner"
                placeholder="Enter Owner Address"
              />
              <small className="text-danger">{error.owner}</small>
              <br />
            </div>
          </div>
        )}

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Title<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.title}
              type="text"
              name="title"
              placeholder="e.g. 1"
            />
            <small className="text-danger">{error.title}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Amount<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.amount}
              type="text"
              name="amount"
              placeholder="e.g. 1"
            />
            <small className="text-danger">{error.amount}</small>
            <br />
          </div>
        </div>

        <div className="col-md-12 mt-4 mb-0">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input mb-2"
              type="checkbox"
              onChange={(e) => onChangeVesting(e)}
              id="inlineCheckbox2"
            />
            <label className="form-check-label" htmlFor="inlineCheckbox2">
              Use vesting?
            </label>
          </div>
        </div>

        {value.isvesting ? (
          <React.Fragment>
            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  TGE Date (Local time)<span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={value.TGEDate}
                  onChange={(date) => handleEndTimeChange(date)}
                  isClearable
                  placeholderText="Select End Time!"
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
              <small className="text-danger">{error.TGEDate}</small>
              <br />
            </div>

            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  TGE Percent<span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.TGEPercent}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="TGEPercent"
                  placeholder="e.g. 20"
                />
                <small className="text-danger">{error.TGEPercent}</small>
                <br />
              </div>
            </div>

            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  Cycle (minutes)<span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.Cycle}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="Cycle"
                  placeholder="e.g 10"
                />
                <small className="text-danger">{error.Cycle}</small>
                <br />
              </div>
            </div>

            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  Cycle Release Percent<span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.ReleasePercent}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="ReleasePercent"
                  placeholder="e.g. 20"
                />
                <small className="text-danger">{error.ReleasePercent}</small>
                <br />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="col-md-12 mt-4 mb-0">
            <div className="form-group">
              <label>
                Lock until (Local time)<span className="text-danger">*</span>
              </label>
              <DatePicker
                selected={value.TGEDate}
                onChange={(date) => handleEndTimeChange(date)}
                isClearable
                placeholderText="Select End Time!"
                minDate={new Date()}
                showDisabledMonthNavigation
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <small className="text-danger">{error.TGEDate}</small>
            <br />
          </div>
        )}
      </div>
      <ul className="list-inline text-center">
        {value.isApprove ? (
          <li>
            <Button
              type="button"
              className="default-btn"
              loading={lockloading}
              onClick={(e) => handleLockToken(e)}
            >
              Lock
            </Button>
          </li>
        ) : (
          <li>
            <Button
              type="button"
              className="default-btn"
              onClick={(e) => handleApprove(e)}
              loading={loading}
            >
              Approve
            </Button>
          </li>
        )}
      </ul>
      <div className="mt-5">
        <span>
          Note : Please exclude Our Contract address
          <span className="step-input-value ml-3 mr-3">
            {contract[chainId]
              ? contract[chainId].lockAddress
              : contract["default"].lockAddress}
          </span>
          <CopyToClipboard
            text={
              contract[chainId]
                ? contract[chainId].lockAddress
                : contract["default"].lockAddress
            }
          >
            <img style={{ cursor: "pointer" }} src={copyIcon} alt="project" />
          </CopyToClipboard>{" "}
          from fees, rewards, max tx amount to start locking tokens.
        </span>
        <span>We don't support rebase tokens.</span>
      </div>
    </div>
  );
}

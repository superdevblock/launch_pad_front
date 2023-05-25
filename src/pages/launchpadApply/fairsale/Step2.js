import React, { useContext, useEffect, useState } from "react";
import Context from "./context/Context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { feesSetting } from "./context/defaults";
import { formatPrice } from "../../../hooks/contractHelper";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { supportNetwork } from "../../../hooks/network";
import { coinArray, convertDay } from "../../../hooks/constant";

export default function Step2() {
  const { value, btnPrevStep, setValue } = useContext(Context);
  const context = useWeb3React();
  const { chainId } = context;
  const [error, setError] = useState({
    saletoken: "",
    softcap: "",
    liquidity: "",
    starttime: "",
    endtime: "",
    llockup: "",
  });
  const [totaltoken, setTotaltoken] = useState(0);

  const checkValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "saletoken":
      case "softcap":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else {
          message = "";
        }
        break;
      case "liquidity":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 50) {
          terror += 1;
          message = "Liquidity must be greater than 50%";
        } else if (parseFloat(inputValue) > 100) {
          terror += 1;
          message = "Liquidity must be less than 100%";
        } else {
          message = "";
        }
        break;
      case "starttime":
        if (inputValue === "" || inputValue === null) {
          terror += 1;
          message = "Please enter valid date";
        } else if (inputValue < new Date()) {
          terror += 1;
          message = "Start Time must be after current time";
        } else if (inputValue >= value.endtime) {
          terror += 1;
          message = "Start time needs to be before End time";
        } else {
          message = "";
        }
        break;
      case "endtime":
        if (inputValue === "" || inputValue === null) {
          terror += 1;
          message = "Please enter valid date";
        } else if (value.starttime >= inputValue) {
          terror += 1;
          message = "Start time needs to be before End time";
        } else {
          message = "";
        }
        break;
      case "llockup":
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
      if (input === "starttime" || input === "endtime") {
        setError({ ...error, starttime: "", endtime: "" });
      } else {
        setError({ ...error, [input]: "" });
      }
      return true;
    }
  };

  const checkAllValidation = () => {
    let terror = 0;
    var reg;
    Object.keys(value).map((key, index) => {
      switch (key) {
        case "saletoken":
        case "softcap":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            terror += 1;
          }
          break;
        case "liquidity":
          reg = new RegExp(/^\d+$/);
          if (!reg.test(value[key]) || parseFloat(value[key]) <= 0) {
            terror += 1;
          } else if (parseFloat(value[key]) <= 50) {
            terror += 1;
          } else if (parseFloat(value[key]) > 100) {
            terror += 1;
          }

          break;
        case "starttime":
          if (value[key] === "" || value[key] === null) {
            terror += 1;
          } else if (value[key] >= value.endtime) {
            terror += 1;
          }

          break;
        case "endtime":
          if (value[key] === "" || value[key] === null) {
            terror += 1;
          } else if (value.starttime >= value[key]) {
            terror += 1;
          }

          break;
        case "llockup":
          reg = new RegExp(/^\d+$/);
          if (!reg.test(value[key]) || parseFloat(value[key]) <= 0) {
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

  useEffect(() => {
    let totalToken =
      parseFloat(value.saletoken) +
      parseFloat((value.saletoken * value.liquidity) / 100);
    let totalFees = parseFloat(
      (value.saletoken *
        parseFloat(
          feesSetting[value.feesType].token + feesSetting[value.feesType].extra
        )) /
        100
    );
    let total = totalToken + totalFees;
    setTotaltoken(total);
  }, [value]);

  const onChangeInput = (e) => {
    e.preventDefault();
    checkValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleStartTimeChange = (date) => {
    checkValidation("starttime", date);
    setValue({ ...value, starttime: date });
  };

  const handleEndTimeChange = (date) => {
    checkValidation("endtime", date);
    setValue({ ...value, endtime: date });
  };

  const btnNextStepValidation = () => {
    let check = checkAllValidation();
    if (check) {
      setValue({
        ...value,
        totaltoken: totaltoken,
        step: parseInt(value.step + 1),
      });
    } else {
      toast.error("Required all field ! please check again");
    }
  };

  return (
    <div
      className={`tab-pane ${value.step === 2 ? "active" : ""}`}
      role="tabpanel"
      id="step2"
    >
      <h4 className="text-center">
        Enter the launchpad information that you want to raise , that should be
        enter all details about your fairsale.
      </h4>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>
              Total selling amount<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              value={value.saletoken}
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="saletoken"
              placeholder="e.g. 100"
            />
            <small className="text-danger">{error.saletoken}</small>
            <br />
          </div>
        </div>

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Softcap ({coinArray[chainId]})
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.softcap}
              type="text"
              name="softcap"
              placeholder="e.g. 1"
            />
            <small className="text-danger">{error.softcap}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Refund type</label>
            <select
              className="form-select"
              defaultValue="1"
              onChange={(e) => onChangeInput(e)}
              name="refund"
              aria-label="Default select example"
            >
              <option value="1" selected={value.refund === "1" ? true : false}>
                Burn
              </option>
              <option value="0" selected={value.refund === "0" ? true : false}>
                Refund
              </option>
            </select>
          </div>
        </div>
        {/* <div className="col-md-6 mt-4 mb-0">
                    <div className="form-group">
                        <label>Router</label>
                        <select className="form-select" defaultValue="1" onChange={(e) => onChangeInput(e)} name="routeraddress" aria-label="Default select example">
                            <option value="1" selected={value.refund === '1' ? true : false}>Pancackswap</option>
                        </select>
                    </div>
                </div> */}

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              liquidity (%)<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              value={value.liquidity}
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="liquidity"
              placeholder="e.g. 55"
            />
            <small className="text-danger">{error.liquidity}</small>
            <br />
          </div>
        </div>

        <div className="col-md-12">
          <label className="mt-4 text-white">
            Select start time & end time (LocalTime)*
          </label>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Start time (LocalTime)<span className="text-danger">*</span>
            </label>
            <DatePicker
              selected={value.starttime}
              onChange={(date) => handleStartTimeChange(date)}
              isClearable
              placeholderText="Select Start Time!"
              minDate={new Date()}
              showDisabledMonthNavigation
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <small className="text-danger">{error.starttime}</small>
          <br />
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              End time (LocalTime)<span className="text-danger">*</span>
            </label>
            <DatePicker
              selected={value.endtime}
              onChange={(date) => handleEndTimeChange(date)}
              isClearable
              placeholderText="Select End Time!"
              minDate={new Date()}
              showDisabledMonthNavigation
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <small className="text-danger">{error.endtime}</small>
          <br />
        </div>
        <div className="col-md-12 mt-4 mb-0">
          <div className="form-group">
            <label>
              Liquidity lockup (minutes)<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              value={ value.lockup }
              type="text"
              onChange={(e) => onChangeInput(e)}
              name="llockup"
              placeholder="e.g. 300"
            />
            <small className="text-danger">{error.llockup}</small>
            <br />
          </div>
        </div>
      </div>

      <ul className="list-inline text-center">
        <p className="text-warning text-center mb-0">
          Need {formatPrice(totaltoken)} {value.tokenSymbol} to create
          launchpad.
        </p>

        <button
          type="button"
          className="btn default-btn prev-step mr-3"
          onClick={(e) => btnPrevStep(e)}
        >
          Back
        </button>
        <button
          type="button"
          className="btn default-btn next-step"
          onClick={(e) => btnNextStepValidation(e)}
        >
          Continue
        </button>
      </ul>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Context from "./context/Context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { feesSetting } from "./context/defaults";
import { formatPrice } from "../../../hooks/contractHelper";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { supportNetwork } from "../../../hooks/network";
import { coinArray } from "../../../hooks/constant";

export default function Step2() {
  const { value, btnPrevStep, setValue } = useContext(Context);
  const context = useWeb3React();
  const { chainId } = context;
  const [error, setError] = useState({
    presalerate: "",
    softcap: "",
    hardcap: "",
    minbuy: "",
    maxbuy: "",
    liquidity: "",
    listingrate: "",
    starttime: "",
    endtime: "",
    llockup: "",
    firstrelease: "",
    cycle: "",
    eachcycleper: "",
  });
  const [totaltoken, setTotaltoken] = useState(0);

  const checkValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "presalerate":
      case "listingrate":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 1");
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else {
          message = "";
        }
        break;

      case "softcap":
        if (inputValue === '')
          value.hardcap = '';      

        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        inputValue = parseFloat(inputValue);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 2");
          terror += 1;
          message = "Please Enter Valid Amount!";
        // } else if (
        //   parseFloat(value.hardcap) > 0 &&
        //   parseFloat(parseFloat(value.hardcap) * 0.15) > parseFloat(inputValue)
        // ) {
        //   terror += 1;
        //   message = "Softcap must be greater than or equal 15% of Hardcap";
        // } else if (
        //   parseFloat(value.hardcap) > 0 &&
        //   parseFloat(inputValue) > parseFloat(value.hardcap)
        // ) {
        //   terror += 1;
        //   message = "Softcap must be less than or equal Hardcap";
        } else {
          // message = "";
          value.hardcap = ( inputValue / 15 ) * 100;
        }
        break;

      case "hardcap":
        if (inputValue === '')
          value.softcap = '';      
        
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        inputValue = parseFloat(inputValue);

        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 3");
          terror += 1;
          message = "Please Enter Valid Amount!";
        // } else if (
        //   parseFloat(value.softcap) > 0 &&
        //   parseFloat(parseFloat(inputValue) / 2) > parseFloat(value.softcap)
        // ) {
        //   terror += 1;
        //   message = "Softcap must be greater than or equal 50% of Hardcap";
        // } else if (
        //   parseFloat(value.softcap) > 0 &&
        //   parseFloat(value.softcap) > parseFloat(inputValue)
        // ) {
        //   terror += 1;
        //   message = "Softcap must be less than or equal Hardcap";
        } else {
          // message = "";
          value.softcap = inputValue * 0.15;
        }
        break;

      case "minbuy":
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        inputValue = parseFloat(inputValue);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 4");
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (
          parseFloat(value.hardcap) > 0 &&
          parseFloat(inputValue) >= parseFloat(value.maxbuy)
        ) {
          console.log("terror 5");
          terror += 1;
          message = "Min buy must be less than max buy";
        } else {
          message = "";
        }
        break;
      case "maxbuy":
        inputValue = parseFloat(inputValue);
        reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 6");
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (
          parseFloat(value.softcap) > 0 &&
          parseFloat(inputValue) <= parseFloat(value.minbuy)
        ) {
          console.log("terror 7");
          terror += 1;
          message = "Min buy must be less than max buy";
        } else {
          message = "";
        }
        break;
      case "liquidity":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 8");
          terror += 1;
          message = "Please Enter Valid Amount!";
        } else if (parseFloat(inputValue) <= 50) {
          console.log("terror 9");
          terror += 1;
          message = "Liquidity must be greater than 50%";
        } else if (parseFloat(inputValue) > 100) {
          console.log("terror 10");
          terror += 1;
          message = "Liquidity must be less than 100%";
        } else {
          message = "";
        }
        break;
      case "starttime":
        if (inputValue === "" || inputValue === null) {
          console.log("terror 11");
          terror += 1;
          message = "Please enter valid date";
        } else if (inputValue < new Date()) {
          console.log("terror 12");
          terror += 1;
          message = "Start Time must be after current time";
        } else if (inputValue >= value.endtime) {
          console.log("terror 13");
          terror += 1;
          message = "Start time needs to be before End time";
        } else {
          message = "";
        }
        break;
      case "endtime":
        if (inputValue === "" || inputValue === null) {
          console.log("terror 14");
          terror += 1;
          message = "Please enter valid date";
        } else if (value.starttime >= inputValue) {
          console.log("terror 15");
          terror += 1;
          message = "Start time needs to be before End time";
        } else {
          message = "";
        }
        break;
      case "llockup":
      case "firstrelease":
      case "cycle":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 16");
          terror += 1;
          message = "Please Enter Valid Number!";
        } else {
          message = "";
        }
        break;
      case "eachcycleper":
        reg = new RegExp(/^\d+$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          console.log("terror 17");
          terror += 1;
          message = "Please Enter Valid Number!";
        } else if (parseFloat(inputValue) > 100) {
          console.log("terror 18");
          terror += 1;
          message = "Value must be less than 100!";
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
      if (input === "hardcap" || input === "softcap") {
        setError({ ...error, hardcap: "", softcap: "" });
      } else if (input === "minbuy" || input === "maxbuy") {
        setError({ ...error, minbuy: "", maxbuy: "" });
      } else if (input === "starttime" || input === "endtime") {
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
        case "presalerate":
        case "listingrate":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            console.log("checkAllValidation 1");
            terror += 1;
          }
          break;

        case "softcap":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);

          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            terror += 1;
          // } else if (
          //   parseFloat(value.hardcap) > 0 &&
          //   parseFloat(parseFloat(value.hardcap) / 2) > parseFloat(value[key])
          // ) {
          //   terror += 1;
          } else if (
            parseFloat(value.hardcap) > 0 &&
            parseFloat(value[key]) > parseFloat(value.hardcap)
          ) {
            terror += 1;
          }
          break;

        case "hardcap":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            terror += 1;
          // } else if (
          //   parseFloat(value.softcap) > 0 &&
          //   parseFloat(parseFloat(value[key]) / 2) > parseFloat(value.softcap)
          // ) {
          //   terror += 1;
          } else if (
            parseFloat(value.softcap) > 0 &&
            parseFloat(value.softcap) > parseFloat(value[key])
          ) {
            terror += 1;
          }
          break;

        case "minbuy":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            terror += 1;
          } else if (
            parseFloat(value.hardcap) > 0 &&
            parseFloat(value[key]) >= parseFloat(value.maxbuy)
          ) {
            terror += 1;
          }

          break;
        case "maxbuy":
          reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
          if (
            !reg.test(parseFloat(value[key])) ||
            parseFloat(value[key]) <= 0
          ) {
            terror += 1;
          } else if (
            parseFloat(value.softcap) > 0 &&
            parseFloat(value[key]) <= parseFloat(value.minbuy)
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
        case "firstrelease":
        case "cycle":
        case "eachcycleper":
          reg = new RegExp(/^\d+$/);
          if (
            value.isVesting &&
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

  useEffect(() => {
    let totalToken =
      parseFloat(value.presalerate * value.hardcap) +
      parseFloat((value.hardcap * value.listingrate * value.liquidity) / 100);
    let totalFees = parseFloat(
      (value.presalerate *
        value.hardcap *
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

  const handleWhitelistChange = (e) => {
    setValue({ ...value, whitelist: e.target.value });
  };

  const onChangeVesting = (e) => {
    setValue({ ...value, isVesting: e.target.checked });
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
        enter all details about your presale.
      </h4>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>
              Presale rate<span className="text-danger">*</span>
              <small className="text-danger">
                (If I spend 1 {coinArray[chainId]} how many tokens will I
                receive?)
              </small>
            </label>
            <input
              className="form-control"
              value={value.presalerate}
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="presalerate"
              placeholder="e.g. 100"
            />
            <small className="text-danger">{error.presalerate}</small>
            <br />
          </div>
        </div>

        <div className="col-md-12 mt-4 mb-0">
          <label>Whitelist</label>
          <br />

          <div className="form-group">
            <div className="form-check">
              <span className="form-check-label">
                <input
                  type="radio"
                  style={{ width: "auto" }}
                  className="form-check-input"
                  name="whitelist"
                  value="1"
                  onChange={(e) => handleWhitelistChange(e)}
                  checked={value.whitelist === "1" ? true : false}
                />
                Enable
              </span>
            </div>
            <div className="form-check">
              <span className="form-check-label">
                <input
                  type="radio"
                  style={{ width: "auto" }}
                  className="form-check-input"
                  name="whitelist"
                  value="2"
                  onChange={(e) => handleWhitelistChange(e)}
                  checked={value.whitelist === "2" ? true : false}
                />
                Disable
              </span>
            </div>
            <br />
            <span>
              <small className="text-danger">
                You can enable/disable whitelist anytime
              </small>
            </span>
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Softcap ({coinArray[chainId]})
              <span className="text-danger">*</span>(
              <small className="text-danger">{`Softcap must be >= 15% of Hardcap!`}</small>
              )
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
            <label>
              HardCap ({coinArray[chainId]}){" "}
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.hardcap}
              type="text"
              name="hardcap"
              placeholder="e.g. 2"
            />
            <small className="text-danger">{error.hardcap}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Minimum buy ({coinArray[chainId]})
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.minbuy}
              type="text"
              name="minbuy"
              placeholder="e.g. 0.1"
            />
            <small className="text-danger">{error.minbuy}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Maximum buy ({coinArray[chainId]})
              <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              value={value.maxbuy}
              type="text"
              name="maxbuy"
              placeholder="e.g. 1"
            />
            <small className="text-danger">{error.maxbuy}</small>
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
        <div className="col-md-6 mt-4 mb-3">
          <div className="form-group">
            <label>
              listing rate<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              value={value.listingrate}
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="listingrate"
              placeholder="e.g. 80"
            />
            <small className="text-danger">{error.listingrate}</small>
            <br />
          </div>
        </div>
        <div className="col-md-12">
          <small className="text-danger">
            Enter the percentage of raised funds that should be allocated to
            Liquidity on (Min 51%, Max 100%){" "}
          </small>
          <br />
          <small className="text-danger mt-1 mb-2">
            If I spend 1 {coinArray[chainId]} on how many tokens will I
            receive? Usually this amount is lower than presale rate to allow for
            a higher listing price on
          </small>
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
              value={value.llockup}
              type="text"
              onChange={(e) => onChangeInput(e)}
              name="llockup"
              placeholder="e.g. 300"
            />
            <small className="text-danger">{error.llockup}</small>
            <br />
          </div>
        </div>

        <div className="col-md-12 mt-4 mb-0">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input mb-2"
              type="checkbox"
              onChange={(e) => onChangeVesting(e)}
              id="inlineCheckbox1"
            />
            <label className="form-check-label" htmlFor="inlineCheckbox1">
              Using Vesting Contributor?
            </label>
          </div>
        </div>
        {value.isVesting && (
          <React.Fragment>
            <div className="col-md-12 mt-4 mb-0">
              <div className="form-group">
                <label>
                  First release for presale (percent)
                  <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.firstrelease}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="firstrelease"
                  placeholder="e.g. 20"
                />
                <small className="text-danger">{error.firstrelease}</small>
                <br />
              </div>
            </div>

            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  Vesting period each cycle (minutes)
                  <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.cycle}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="cycle"
                  placeholder="e.g 10"
                />
                <small className="text-danger">{error.cycle}</small>
                <br />
              </div>
            </div>

            <div className="col-md-6 mt-4 mb-0">
              <div className="form-group">
                <label>
                  Presale token release each cycle (percent)
                  <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={value.eachcycleper}
                  onChange={(e) => onChangeInput(e)}
                  type="text"
                  name="eachcycleper"
                  placeholder="e.g. 20"
                />
                <small className="text-danger">{error.eachcycleper}</small>
                <br />
              </div>
            </div>
          </React.Fragment>
        )}
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

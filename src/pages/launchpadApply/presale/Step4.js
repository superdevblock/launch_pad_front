import React, { useContext, useState } from "react";
import { formatPrice } from "../../../hooks/contractHelper";
import Context from "./context/Context";
import { useCommonStats } from "./hooks/useStats";
import { useWeb3React } from "@web3-react/core";
import { supportNetwork } from "../../../hooks/network";
import kycImg from "../../../images/kyc.png";
import auditImg from "../../../images/secure.png";

export default function Step4() {
  const { value, btnNextStep, btnPrevStep, setValue } = useContext(Context);
  const context = useWeb3React();
  const { chainId } = context;
  const [updater] = useState(new Date());
  const commonStats = useCommonStats(updater);

  const btnNextStepValidation = () => {
    btnNextStep();
  };

  const handleCheckboxAudit = (e) => {
    setValue({
      ...value,
      [e.target.name]: !value.audit,
      totalCost:
        e.target.checked === true
          ? Math.round(
              (parseFloat(value.totalCost) +
                parseFloat(commonStats.auditPrice)) *
                1e12
            ) / 1e12
          : Math.round(
              (parseFloat(value.totalCost) -
                parseFloat(commonStats.auditPrice)) *
                1e12
            ) / 1e12,
    });
  };

  const handleCheckboxKyc = (e) => {
    setValue({
      ...value,
      [e.target.name]: !value.kyc,
      totalCost:
        e.target.checked === true
          ? Math.round(
              (parseFloat(value.totalCost) + parseFloat(commonStats.kycPrice)) *
                1e12
            ) / 1e12
          : Math.round(
              (parseFloat(value.totalCost) - parseFloat(commonStats.kycPrice)) *
                1e12
            ) / 1e12,
    });
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <div
      className={`tab-pane ${value.step === 4 ? "active" : ""}`}
      role="tabpanel"
      id="step4"
    >
      <h4 className="text-center">
        Choose your marketing, KYC and auditing option below
      </h4>
      <div className="container">
        <h5 className="text-center">Audit & Kyc Service</h5>
        <div className="row">
          <div className="col text-center">
            <label htmlFor="html">AUDIT</label>
            <br />
            <img
              src={auditImg}
              alt="secure"
              className="mb-3"
              height="50px"
              width="50px"
            />
            <br />
            <span>
              {formatPrice(commonStats.auditPrice ? commonStats.auditPrice : 0)}
            </span>
            <br />
            <div className="container">
              <label className="switch" htmlFor="audit">
                <input
                  type="checkbox"
                  name="audit"
                  id="audit"
                  onChange={(e) => handleCheckboxAudit(e)}
                  checked={value.audit === true ? true : false}
                />
                <div className="slider round"></div>
              </label>
            </div>
          </div>
          <div className="col text-center">
            <label htmlFor="html">KYC</label>
            <br />
            <img
              src={kycImg}
              alt="kyc"
              className="mb-3"
              height="50px"
              width="50px"
            />
            <br />
            <span>
              {formatPrice(commonStats.kycPrice ? commonStats.kycPrice : 0)}
            </span>
            <br />
            <div className="container">
              <label className="switch" htmlFor="kyc">
                <input
                  type="checkbox"
                  name="kyc"
                  id="kyc"
                  onChange={(e) => handleCheckboxKyc(e)}
                  checked={value.kyc === true ? true : false}
                />
                <div className="slider round"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          {(value.kyc === true || value.audit === true) && (
            <div className="col-12 mt-4 mb-0">
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  className="form-control"
                  onChange={(e) => onChangeInput(e)}
                  value={value.usermail}
                  type="text"
                  name="usermail"
                />
              </div>
            </div>
          )}

          {/* {value.audit === true && (
            <div className="col-6 mt-4 mb-0">
              <div className="form-group">
                <label>Audit Link</label>
                <input
                  className="form-control"
                  onChange={(e) => onChangeInput(e)}
                  value={value.auditlink}
                  type="text"
                  name="auditlink"
                  placeholder="e.g. https://github.com/interfinetwork/smart-contract-audits/blob/audit-updates/OceansFinance_0x7769d930BC6B087f960C5D21e34A4449576cf22a.pdf"
                />
              </div>
            </div>
          )}

          {value.kyc === true && (
            <div className="col-6 mt-4 mb-0">
              <div className="form-group">
                <label>Kyc Link</label>
                <input
                  className="form-control"
                  onChange={(e) => onChangeInput(e)}
                  value={value.kyclink}
                  type="text"
                  name="kyclink"
                  placeholder="e.g. https://github.com/interfinetwork/smart-contract-audits/blob/kyc-updates/OceansFinance_0x7769d930BC6B087f960C5D21e34A4449576cf22a.pdf"
                />
              </div>
            </div>
          )} */}
        </div>
      </div>

      <div className="text-center mt-2">
        Total Cost : {formatPrice(value.totalCost ? value.totalCost : 0)}{" "}
        {supportNetwork[chainId]
          ? supportNetwork[chainId].symbol
          : supportNetwork["default"].symbol}{" "}
      </div>
      <ul className="list-inline text-center">
        <li>
          <button
            type="button"
            className="btn default-btn prev-step mr-4"
            onClick={(e) => btnPrevStep(e)}
          >
            Back
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn default-btn next-step"
            onClick={(e) => btnNextStepValidation(e)}
          >
            Continue
          </button>
        </li>
      </ul>
    </div>
  );
}

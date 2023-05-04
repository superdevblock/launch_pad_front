import React, { useContext, useState } from "react";
import { formatPrice } from "../../../hooks/contractHelper";
import Context from "./context/Context";
import Button from "react-bootstrap-button-loader";
import { getContract, mulDecimal } from "../../../hooks/contractHelper";
import { FaLink } from 'react-icons/fa';
import { contract } from "../../../hooks/constant";
import { trimLink } from "../../../hooks/constant";
import { useWeb3React } from "@web3-react/core";
import { feesSetting } from "./context/defaults";
import poolFactoryAbi from "../../../json/poolfactory.json";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { getWeb3 } from "../../../hooks/connectors";
import { useCommonStats } from "./hooks/useStats";
import { parseEther } from "ethers/lib/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { supportNetwork } from "../../../hooks/network";
import { ethers } from "ethers";

export default function Step5() {
  const { value, btnPrevStep } = useContext(Context);
  const context = useWeb3React();
  const { account, chainId, library } = context;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [updater] = useState(new Date());
  const commonStats = useCommonStats(updater);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (account) {
        if (chainId) {
          let web3 = getWeb3(chainId);

          let para = [
            [
              value.tokenAddress,
              contract[chainId]
                ? contract[chainId].routeraddress
                : contract["default"].routeraddress,
              account,
              value.currencyAddress,
            ], // 1

            [
              mulDecimal(value.presalerate, value.tokenDecimal).toString(), // 0
              mulDecimal(value.listingrate, value.tokenDecimal).toString(), // 1
              mulDecimal(value.minbuy, 18).toString(), // 2
              // mulDecimal(value.maxbuy, 18).toString(), // 0
              ethers.constants.MaxUint256.toString(), // 3
              mulDecimal(value.softcap, 18).toString(), // 4
              mulDecimal(value.hardcap, 18).toString(), // 5
              Math.floor(new Date(value.starttime).getTime() / 1000.0), // 6
              Math.floor(new Date(value.endtime).getTime() / 1000.0), // 7
              value.llockup * 60, // 8
              value.whitelist, // 9
              value.audit === true ? "1" : "2", // 10
              value.kyc === true ? "1" : "2", // 11
              feesSetting[value.feesType].token, // 12
              feesSetting[value.feesType].bnb, // 13
              value.liquidity, // 14
              value.refund, // 15
            ],
            `${value.logourl}$#$${value.bannerurl}$#$${value.website}$#$$#$${value.facebook}$#$${value.twitter}$#$${value.github}$#$${value.telegram}$#$${value.instagram}$#$${value.discord}$#$${value.reddit}$#$${value.youtube}$#$${value.brief}`, //9
            [
              value.firstrelease * 100,
              value.cycle * 60,
              value.eachcycleper * 100,
            ],
            [value.usermail, value.auditlink, value.kyclink],
          ];

          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory;
          let factoryContract = getContract(
            poolFactoryAbi,
            poolfactoryAddress,
            library
          );
          
          let feesCal =
            parseFloat(value.totalCost) + parseFloat(commonStats.poolPrice);
          let tx = await factoryContract.createSale(
            para[0],
            para[1],
            para[2],
            para[3],
            para[4],
            { from: account, value: parseEther(feesCal.toFixed(8).toString()) }
          );

          const resolveAfter3Sec = new Promise((resolve) =>
            setTimeout(resolve, 10000)
          );
          toast.promise(resolveAfter3Sec, {
            pending: "Waiting for confirmation 👌",
          });

          var interval = setInterval(async function () {
            var response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              clearInterval(interval);
              if (response.status === true) {
                toast.success("Success ! Your last transaction is success 👍");
                setLoading(false);
                if (typeof response.logs[0] !== "undefined") {
                  history.push(`/presale-details/${response.logs[0].address}`);
                } else {
                  toast.error("Something went wrong !");
                  history.push("/");
                }
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
          toast.error("Wrong network selected !");
          setLoading(false);
        }
      } else {
        toast.error("Please Connect Wallet!");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className={`tab-pane ${value.step === 5 ? "active" : ""}`}
      role="tabpanel"
      id="step4"
    >
      <h4 className="text-center">Review your information</h4>
      <div className="mt-3 d-flex justify-content-between card-span">
        <span>Total token</span>
        <span className="step-input-value">
          {formatPrice(value.totaltoken)} {value.tokenSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Name</span>
        <span className="step-input-value">{value.tokenName}</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Symbol</span>
        <span className="step-input-value">{value.tokenSymbol}</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Decimal</span>
        <span className="step-input-value">{value.tokenDecimal}</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Presale rate</span>
        <span className="step-input-value">
          {value.presalerate} {value.tokenSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Listing rate</span>
        <span className="step-input-value">
          {value.listingrate} {value.tokenSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Sale method</span>
        <span className="step-input-value">Public</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Softcap</span>
        <span className="step-input-value">
          {value.softcap} {value.currencyTSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Hardcap</span>
        <span className="step-input-value">
          {value.hardcap} {value.currencyTSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Unsold tokens </span>
        <span className="step-input-value">
          {value.refund === "0" ? "Refund" : "Burn"}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Minimum buy</span>
        <span className="step-input-value">
          {value.minbuy} {value.currencyTSymbol}
        </span>
      </div>
      {/* <div className="mt-2 d-flex justify-content-between card-span">
        <span>Maximum buy</span>
        <span className="step-input-value">
          {value.maxbuy} {value.currencyTSymbol}
        </span>
      </div> */}
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Liquidity</span>
        <span className="step-input-value">{value.liquidity}%</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Start time</span>
        <span className="step-input-value">
          {new Date(value.starttime).toUTCString()}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>End time</span>
        <span className="step-input-value">
          {new Date(value.endtime).toUTCString()}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Liquidity lockup time</span>
        <span className="step-input-value">{value.llockup} minutes</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Website</span>
        <a href={value.website} target="_blank" rel="noreferrer">{trimLink(value.website)}<FaLink /></a>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Logo Url</span>
        <a href={value.logourl} target="_blank" rel="noreferrer">{trimLink(value.logourl)}<FaLink /></a>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Banner Image Url</span>
        <a href={value.bannerurl} target="_blank" rel="noreferrer">{trimLink(value.bannerurl)}<FaLink /></a>
      </div>
      {value.facebook && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Facebook</span>
          <a href={value.facebook} target="_blank" rel="noreferrer">{trimLink(value.facebook)}<FaLink /></a>
        </div>
      )}
      {value.twitter && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Twitter</span>
        <a href={value.twitter} target="_blank" rel="noreferrer">{trimLink(value.twitter)}<FaLink /></a>
        </div>
      )}
      {value.github && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Github</span>
        <a href={value.github} target="_blank" rel="noreferrer">{trimLink(value.github)}<FaLink /></a>
        </div>
      )}
      {value.telegram && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Telegram</span>
        <a href={value.telegram} target="_blank" rel="noreferrer">{trimLink(value.telegram)}<FaLink /></a>
        </div>
      )}
      {value.instagram && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Instagram</span>
        <a href={value.instagram} target="_blank" rel="noreferrer">{trimLink(value.instagram)}<FaLink /></a>
        </div>
      )}
      {value.discord && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Discord</span>
        <a href={value.discord} target="_blank" rel="noreferrer">{trimLink(value.discord)}<FaLink /></a>
        </div>
      )}
      {value.reddit && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Reddit</span>
        <a href={value.reddit} target="_blank" rel="noreferrer">{trimLink(value.reddit)}<FaLink /></a>
        </div>
      )}
      {value.blockstart && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Blockstar Group</span>
        <a href={value.blockstart} target="_blank" rel="noreferrer">{trimLink(value.blockstart)}<FaLink /></a>
        </div>
      )}
      {value.youtube && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Youtube Video</span>
        <a href={value.youtube} target="_blank" rel="noreferrer">{trimLink(value.youtube)}<FaLink /></a>
        </div>
      )}

      {value.brief && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Description</span>
          <span className="step-input-value">
            {value.brief.length > 50
              ? `${value.brief.slice(0, 50)}...`
              : value.brief}
          </span>
        </div>
      )}
      {value.whitelist && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Whitelist</span>
          <span className="step-input-value">
            {value.whitelist === "1" ? "YES" : "NO"}
          </span>
        </div>
      )}
      {value.isVesting && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Vesting</span>
          <span className="step-input-value">
            {value.isVesting ? "YES" : "NO"}
          </span>
        </div>
      )}
      {value.isVesting && value.firstrelease && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>First release for presale(percent)</span>
          <span className="step-input-value">{value.firstrelease} %</span>
        </div>
      )}

      {value.isVesting && value.cycle && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Vesting period each cycle (minutes)</span>
          <span className="step-input-value">{value.cycle}</span>
        </div>
      )}

      {value.isVesting && value.eachcycleper && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Presale token release each cycle (percent)</span>
          <span className="step-input-value">{value.eachcycleper}</span>
        </div>
      )}

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
          <Button
            loading={loading}
            variant="none"
            type="button"
            className="btn default-btn next-step"
            onClick={(e) => handleCreateSale(e)}
          >
            Submit
          </Button>
        </li>
      </ul>
      <div className="mt-5">
        <span>
          Note : Please exclude Our Contract address{" "}
          {contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory}
          <CopyToClipboard
            text={
              contract[chainId]
                ? contract[chainId].poolfactory
                : contract["default"].poolfactory
            }
          >
            <img
              style={{ cursor: "pointer" }}
              src={require("../../../images/icon.png").default}
              alt="project"
            />
          </CopyToClipboard>{" "}
          from fees, rewards, max tx amount to start locking tokens.
        </span>
        <span>We don't support rebase tokens.</span>
      </div>
    </div>
  );
}
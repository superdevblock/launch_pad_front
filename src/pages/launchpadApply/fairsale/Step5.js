import React, { useContext, useState } from "react";
import { formatPrice } from "../../../hooks/contractHelper";
import Context from "./context/Context";
import Button from "react-bootstrap-button-loader";
import { getContract, mulDecimal } from "../../../hooks/contractHelper";
import { contract } from "../../../hooks/constant";
import { useWeb3React } from "@web3-react/core";
import { feesSetting } from "./context/defaults";
import poolFactoryAbi from "../../../json/poolfactory.json";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { getWeb3 } from "../../../hooks/connectors";
import { useCommonStats } from "./hooks/useStats";
import { parseEther } from "ethers/lib/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../../images/icon.png";
import { supportNetwork } from "../../../hooks/network";

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
              mulDecimal(value.softcap, 18).toString(),
              mulDecimal(value.saletoken, value.tokenDecimal).toString(),
            ], //2
            [
              Math.floor(new Date(value.starttime).getTime() / 1000.0),
              Math.floor(new Date(value.endtime).getTime() / 1000.0),
              value.llockup * 60,
            ], //3
            [
              feesSetting[value.feesType].token,
              feesSetting[value.feesType].bnb,
            ], //4
            value.audit === true ? "1" : "2", // 5
            value.kyc === true ? "1" : "2", //6
            [value.liquidity, value.refund], //7
            `${value.logourl}$#$${value.bannerurl}$#$${value.website}$#$$#$${value.facebook}$#$${value.twitter}$#$${value.github}$#$${value.telegram}$#$${value.instagram}$#$${value.discord}$#$${value.reddit}$#$${value.youtube}$#$${value.brief}`,
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

          let tx = await factoryContract.createFairSale(
            para[0],
            para[1],
            para[2],
            para[3],
            para[4],
            para[5],
            para[6],
            para[7],
            para[8],
            { from: account, value: parseEther(feesCal.toFixed(8).toString()) }
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
                toast.success("success ! your last transaction is success 👍");
                setLoading(false);
                if (typeof response.logs[0] !== "undefined") {
                  history.push(
                    `/fairlaunch-details/${response.logs[0].address}`
                  );
                } else {
                  toast.error("something went wrong !");
                  history.push("/");
                }
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
          toast.error("wrong network selected !");
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
        <span>Total Token For Sale</span>
        <span className="step-input-value">
          {value.totaltoken} {value.tokenSymbol}
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Sale method</span>
        <span className="step-input-value">Public</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Softcap</span>
        <span className="step-input-value">
          {value.softcap} ({value.currencyTSymbol})
        </span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Unsold tokens </span>
        <span className="step-input-value">
          {value.refund === "0" ? "Refund" : "Burn"}
        </span>
      </div>
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
        <span className="step-input-value">{value.website}</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Logo Url</span>
        <span className="step-input-value">{value.logourl}</span>
      </div>
      <div className="mt-2 d-flex justify-content-between card-span">
        <span>Banner Image Url</span>
        <span className="step-input-value">{value.bannerurl}</span>
      </div>
      {value.facebook && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Facebook</span>
          <span className="step-input-value">{value.facebook}</span>
        </div>
      )}
      {value.twitter && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Twitter</span>
          <span className="step-input-value">{value.twitter}</span>
        </div>
      )}
      {value.github && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Github</span>
          <span className="step-input-value">{value.github}</span>
        </div>
      )}
      {value.telegram && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Telegram</span>
          <span className="step-input-value">{value.telegram}</span>
        </div>
      )}
      {value.instagram && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Instagram</span>
          <span className="step-input-value">{value.instagram}</span>
        </div>
      )}
      {value.discord && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Discord</span>
          <span className="step-input-value">{value.discord}</span>
        </div>
      )}
      {value.reddit && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Reddit</span>
          <span className="step-input-value">{value.reddit}</span>
        </div>
      )}
      {value.youtube && (
        <div className="mt-2 d-flex justify-content-between card-span">
          <span>Youtube Video</span>
          <span className="step-input-value">{value.youtube}</span>
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
            <img style={{ cursor: "pointer" }} src={copyIcon} alt="project" />
          </CopyToClipboard>{" "}
          from fees, rewards, max tx amount to start locking tokens.
        </span>
        <span>We don't support rebase tokens.</span>
      </div>
    </div>
  );
}

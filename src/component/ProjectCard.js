import React from "react";
import { Link } from "react-router-dom";
import { supportNetwork } from "../hooks/network";
import { formatPrice } from "../hooks/contractHelper";
import dateFormat from "dateformat";
import { AiFillTwitterCircle } from "react-icons/ai";
import {
  RiEarthFill,
  RiTelegramFill,
  RiDiscordFill,
  RiFacebookCircleFill,
  RiGithubFill,
  RiInstagramFill,
  RiRedditFill,
} from "react-icons/ri";

const ProjectCard = (chainId, rowdata, index, cs) => {
  let status = "";
  if (rowdata.poolState === "1") {
    status = "completed";
  } else if (rowdata.poolState === "2") {
    status = "canceled";
  } else if (
    parseInt(rowdata.endTime) < Math.floor(new Date().getTime() / 1000.0)
  ) {
    status = "ended";
  } else if (
    parseInt(rowdata.startTime) > Math.floor(new Date().getTime() / 1000.0)
  ) {
    status = "upcoming";
  } else if (
    parseInt(rowdata.startTime) < Math.floor(new Date().getTime() / 1000.0) &&
    parseInt(rowdata.endTime) > Math.floor(new Date().getTime() / 1000.0)
  ) {
    status = "active";
  }

  let details = rowdata.poolDetails.toString().split("$#$");
  const social = {
    logourl: details[0],
    bannerurl: details[1],
    website: details[2],
    blockstar: details[3],
    facebook: details[4],
    twitter: details[5],
    github: details[6],
    telegram: details[7],
    instagram: details[8],
    discord: details[9],
    reddit: details[10],
    youtube: details[11],
    brief: details[12],
  };

  if (cs !== undefined) status = cs;

  const startTime = new Date(rowdata.startTime * 1000);
  const endTime = new Date(rowdata.endTime * 1000);

  return (
    <div
      className="col-12 col-md-6 col-lg-4 item explore-item mb-4"
      key={index}
    >
      <div className="card project-card">
        <div className="card-header py-4 px-2">
          <div className="d-flex">
            <div className="project-logo mr-3">
              <img src={social.logourl} width="50px" />
            </div>
            <div>
              <div>
                <Link
                  to={
                    rowdata.poolType === "0"
                      ? `/presale-details/${rowdata.poolAddress}${
                          chainId ? `?chainid=${chainId}` : ""
                        }`
                      : rowdata.poolType === "1"
                      ? `/private-details/${rowdata.poolAddress}${
                          chainId ? `?chainid=${chainId}` : ""
                        }`
                      : rowdata.poolType === "2"
                      ? `/fairlaunch-details/${rowdata.poolAddress}??chainid=${chainId}`
                      : "/"
                  }
                >
                  <h5 className="mx-0 mt-2 mb-0">
                    {rowdata.name ? rowdata.name : ""}
                  </h5>
                </Link>
              </div>
              <div className="social-icons">
                {social.website && (
                  <a target="_blank" rel="noreferrer" href={social.website}>
                    <RiEarthFill />
                  </a>
                )}
                {social.twitter && (
                  <a target="_blank" rel="noreferrer" href={social.twitter}>
                    <AiFillTwitterCircle />
                  </a>
                )}
                {social.facebook && (
                  <a target="_blank" rel="noreferrer" href={social.facebook}>
                    <RiFacebookCircleFill />
                  </a>
                )}
                {social.instagram && (
                  <a target="_blank" rel="noreferrer" href={social.instagram}>
                    <RiInstagramFill />
                  </a>
                )}
                {social.reddit && (
                  <a target="_blank" rel="noreferrer" href={social.reddit}>
                    <RiRedditFill />
                  </a>
                )}
                {social.telegram && (
                  <a target="_blank" rel="noreferrer" href={social.telegram}>
                    <RiTelegramFill />
                  </a>
                )}
                {social.discord && (
                  <a target="_blank" rel="noreferrer" href={social.discord}>
                    <RiDiscordFill />
                  </a>
                )}
                {social.github && (
                  <a target="_blank" rel="noreferrer" href={social.github}>
                    <RiGithubFill />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end gap-4">
            <span>
              {rowdata.poolType === "0" ? (
                <h4 className="tag-btn text-uppercase text-center bg-blue">
                  Presale
                </h4>
              ) : rowdata.poolType === "1" ? (
                <h4 className="tag-btn text-uppercase text-center bg-green">
                  PrivateSale
                </h4>
              ) : rowdata.poolType === "2" ? (
                <h4 className="tag-btn text-uppercase text-center bg-pink">
                  Fair Launch
                </h4>
              ) : (
                ""
              )}
            </span>
            <span>
              <h4
                className={
                  "tag-btn tag-left-circle text-uppercase text-center bg-" +
                  status
                }
              >
                {status}
              </h4>
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="fund-detail">
            <div className="d-flex justify-content-between">
              <span>Total raised</span>
              <span className="ml-1">
                {rowdata.totalRaised ? rowdata.totalRaised : 0}{" "}
                {rowdata.currencySymbol}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Softcap</span>
              <span className="ml-1">
                {rowdata.softCap} {rowdata.currencySymbol}
              </span>
            </div>
            {rowdata.poolType !== "2" && (
              <div className="d-flex justify-content-between">
                <span>Hardcap</span>
                <span className="ml-1">
                  {rowdata.hardCap} {rowdata.currencySymbol}
                </span>
              </div>
            )}
            {rowdata.poolType !== "2" && (
              <div className="d-flex justify-content-between">
                <span>Min / Max Alloc</span>
                <span className="ml-1">
                  {rowdata.minContribution} - {rowdata.maxContribution}{" "}
                  {rowdata.currencySymbol}
                </span>
              </div>
            )}
          </div>
          <div className="date-detail mt-3">
            <div className="d-flex justify-content-between">
              <span>Start Time:</span>
              <span className="ml-1">
                {dateFormat(startTime, "yyyy-mm-dd HH:MM")}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span>End Time:</span>
              <span className="ml-1">
                {dateFormat(endTime, "yyyy-mm-dd HH:MM")}
              </span>
            </div>
          </div>
          <div className="item-progress my-4">
            <div className="progress mt-md-1 ">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${parseFloat(rowdata.percentageRaise).toFixed(2)}%`,
                }}
                aria-valuenow={parseFloat(rowdata.percentageRaise).toFixed(2)}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>{parseFloat(rowdata.percentageRaise).toFixed(2)}%</span>
              <span>
                {(rowdata.poolType === "0" || rowdata.poolType === "1") && (
                  <>
                    1 {rowdata.currencySymbol} = {formatPrice(rowdata.rate)}{" "}
                    {rowdata.symbol}
                  </>
                )}
              </span>
            </div>
          </div>
          <div>
            <Link
              to={
                rowdata.poolType === "0"
                  ? `/presale-details/${rowdata.poolAddress}${
                      chainId ? `?chainid=${chainId}` : ""
                    }`
                  : rowdata.poolType === "1"
                  ? `/private-details/${rowdata.poolAddress}${
                      chainId ? `?chainid=${chainId}` : ""
                    }`
                  : rowdata.poolType === "2"
                  ? `/fairlaunch-details/${rowdata.poolAddress}??chainid=${chainId}`
                  : "/"
              }
              className="btn btn-smaller w-100"
            >
              view pool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

import React, {useState, useEffect, useCallback} from "react";
import { Link } from "react-router-dom";
import { supportNetwork } from "../hooks/network";
import { formatPrice, getContract } from "../hooks/contractHelper";
import dateFormat from "dateformat";
import { AiFillTwitterCircle } from "react-icons/ai";
import { useLocation, useHistory } from "react-router-dom";
import {
  RiEarthFill,
  RiTelegramFill,
  RiDiscordFill,
  RiFacebookCircleFill,
  RiGithubFill,
  RiInstagramFill,
  RiRedditFill,
} from "react-icons/ri";
import question from "../images/question.png"
import ethereum from "../images/ethereum2.png"
import ethereum_pink from "../images/ethereum-pink.png"
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import poolAbi from "../json/presalePool.json";
import { parseEther } from "ethers/lib/utils";
import { getWeb3 } from "../hooks/connectors";
import Button from "react-bootstrap-button-loader";
import { async } from "q";
import { useTokenInfo } from "../pages/helper/useStats";
import { ethers } from "ethers";

const ProjectCard = ({chainId, rowdata, index, cs}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [amount, setAmount] = useState(0);
  const [btndisabled, setBtndisabled] = useState(false);
  const [error_msg, setError_msg] = useState("");
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  const [updater, setUpdater] = useState(1);
  // const stats = useCommonStats(updater);
  // const accStats = useAccountStats(updater);
  const [balance, setBalance] = useState(0)
  const [userMaxAlloc, setUserMaxAlloc] = useState(rowdata.maxContribution);
  
  const tokenInfo = useTokenInfo(rowdata.token, chainId)
  const [userAvalibleClaim, setuserAvalibleClaim] = useState(0)
  useEffect(() => {
    const fetch = async() => {
      try {
        const web3 = getWeb3(chainId);
        let poolContract = getContract(poolAbi, rowdata.poolAddress, library);
        web3.eth.getBalance(account).then(balance => {
          setBalance(web3.utils.fromWei(balance, 'ether'));
        });
  
        const val = await poolContract.getMaxContribution(account);
        if(rowdata.poolAddress.toLowerCase() === "0xe1d6e9F871581c3F698482eAe9390685B14C53DD".toLowerCase()) {
          setUserMaxAlloc(val / Math.pow(10, 18) / 100);
        } else {
          setUserMaxAlloc(val / Math.pow(10, 18));
        }
  
        const _userAvalibleClaim = await poolContract.userAvalibleClaim(account)
        setuserAvalibleClaim(_userAvalibleClaim / Math.pow(10, tokenInfo.decimals))
      } catch (error) {
        console.error(error)
      }
    }
    if(account) {
      fetch()
    }
  }, [account, chainId, library, rowdata, tokenInfo.decimals, updater])
  
  const [status, setStatus] = useState("");
  const [social, setSocial] = useState({});
  useEffect(() => {
    if (rowdata.poolState === 1) {
      setStatus("completed");
    } else if (rowdata.poolState === 2) {
      setStatus("canceled");
    } else if (
      parseInt(rowdata.endTime) < Math.floor(new Date().getTime() / 1000.0)
    ) {
      setStatus("ended");
    } else if (
      parseInt(rowdata.startTime) > Math.floor(new Date().getTime() / 1000.0)
    ) {
      setStatus("upcoming");
    } else if (
      parseInt(rowdata.startTime) < Math.floor(new Date().getTime() / 1000.0) &&
      parseInt(rowdata.endTime) > Math.floor(new Date().getTime() / 1000.0)
    ) {
      setStatus("active");
    }
    let details = rowdata.poolDetails.toString().split("$#$");
    setSocial({
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
    });
  
    if (cs !== undefined) setStatus(status);
  
  }, [cs, rowdata.endTime, rowdata.poolDetails, rowdata.poolState, rowdata.startTime, status])
  
  const [isValidUrl, setIsValidUrl] = useState(true);
  const handleLoad = useCallback(() => {
    setIsValidUrl(true);
  }, [])
  const handleError = useCallback(() => {
    setIsValidUrl(false);
  }, [])

  const [currentTime] = useState(Math.floor(new Date().getTime() / 1000.0));
  useEffect(() => {
    let quoteTime = rowdata.startTime > currentTime
      ? rowdata.startTime * 1000
      : rowdata.endTime * 1000
    // let quoteTime = status === "active" ? rowdata.endTime * 1000 : rowdata.startTime * 1000
    let timeRemaining = quoteTime - new Date().getTime()
    setCountdownFor(timeRemaining);
    
    const interval = setInterval(() => {
      try {
        if (timeRemaining > 1000) {
          timeRemaining -= 1000;
          setCountdownFor(timeRemaining);
        }
  
        if (timeRemaining <= 1000) {
          clearInterval(interval);
        }
      } catch (error) {
        
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentTime, rowdata.endTime, rowdata.startTime]);

  const setCountdownFor = (deadline) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days <= 0 ? 0 : _days);
    setHours(_hours <= 0 ? 0 : _hours);
    setMinutes(_minutes <= 0 ? 0 : _minutes);
    setSeconds(_seconds <= 0 ? 0 : _seconds);
  };

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
    setBtndisabled(true);

    if (isNaN(e.target.value)) {
      setError_msg("please enter valid amount");
      setBtndisabled(true);
    } else if (parseFloat(e.target.value) === 0 || e.target.value === "") {
      setError_msg("amount must be greater than zero");
      setBtndisabled(true);
    } else if (
      parseFloat(e.target.value) < parseFloat(rowdata.minContribution) ||
      parseFloat(e.target.value) > parseFloat(userMaxAlloc)
    ) {
      setError_msg(
        userMaxAlloc > 0 ? `amount must be between ${rowdata.minContribution} and ${Number(userMaxAlloc.toFixed(4))}`: `you are unable to purchase because you are not a tier.`
      );
      setBtndisabled(true);
    } else {
      setError_msg("");
      setBtndisabled(false);
    }
    return;
  };

  const handleMaxAmount = (e) => {
    e.preventDefault();
    let maxamount =
      rowdata.currencyAddress === "0x0000000000000000000000000000000000000000"
        ? parseFloat(balance) - parseFloat(0.01)
        : parseFloat(balance);
    if (
      parseFloat(maxamount) < parseFloat(rowdata.minContribution) ||
      parseFloat(maxamount) > parseFloat(rowdata.maxContribution)
    ) {
      setError_msg(
        `amount must be between ${rowdata.minContribution} and ${rowdata.maxContribution}`
      );
      setBtndisabled(true);
    }
    setAmount(maxamount.toFixed(4).toString());
  };

  const handleSubmitContribution = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        amount > 0 &&
        (parseFloat(rowdata.maxContribution) > parseFloat(amount) ||
          parseFloat(rowdata.minContribution) < parseFloat(amount))
      ) {
        if (account) {
          if (chainId) {
            if (parseFloat(balance) >= parseFloat(amount)) {
              let poolContract = getContract(
                poolAbi,
                rowdata.poolAddress,
                library
              );

              let tokenAmount =
                rowdata.currencyAddress ===
                "0x0000000000000000000000000000000000000000"
                  ? 0
                  : parseEther(amount);
              let ethAmount =
                rowdata.currencyAddress ===
                "0x0000000000000000000000000000000000000000"
                  ? parseEther(amount)
                  : 0;

              let tx = await poolContract.contribute(tokenAmount, {
                from: account,
                value: ethAmount,
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
                      "Success ! Your last transaction is success 👍"
                    );
                    setUpdater(new Date());
                    setLoading(false);
                  } else if (response.status === false) {
                    toast.error("Error ! Your last transaction is failed.");
                    setUpdater(new Date());
                    setLoading(false);
                  } else {
                    toast.error("Error ! something went wrong.");
                    setUpdater(new Date());
                    setLoading(false);
                  }
                }
              }, 5000);
            } else {
              toast.error("you don't have enough balance !");
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
      } else {
        toast.error("Please Enter Valid Amount !");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.reason);
      setLoading(false);
    }
  };

  const handleClaimToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, rowdata.poolAddress, library);

        let tx = await poolContract.claim({
          from: account,
        });
        const resolveAfter3Sec = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        );
        toast.promise(resolveAfter3Sec, {
          pending: "Waiting for confirmation",
        });

        var interval = setInterval(async function () {
          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            clearInterval(interval);
            if (response.status === true) {
              toast.success("success ! your last transaction is success");
              setUpdater(new Date());
              setLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setLoading(false);
    }
  };

  
  return (
    <div
      className="col-12 col-md-6 col-lg-4 item explore-item mb-4"
      key={index}
    >
      <div className="card project-card">
        <div className="card-header py-4 px-2 flex-column">
          <div className="d-flex justify-content-between">
            <div className="project-logo mr-3">
              {isValidUrl && <img src={social.logourl} width="50px" 
                alt="logo"
                onLoad={handleLoad}
                onError={handleError}
              />}
              {!isValidUrl && <img src={question} width="50px" alt="logo"/>}
            </div>
            
            <div className="d-flex align-items-center gap-4">
              <img src={ethereum} width="20px" alt="logo"/>
              <div className="d-flex flex-column justify-content-center ml-2" style={{width: "165px"}}>
                {/* <h4
                  className={
                    "tag-btn tag-left-circle text-uppercase text-center bg-" +
                    status
                  }
                >
                  {status}
                </h4> */}
                <h4 className="m-state-text mb-1">{status}</h4>
                <div className="d-flex">
                  <span className="m-time-count">{days}D : {hours}H : {minutes}MIN : {seconds}SEC</span>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              <Link
                to={
                  rowdata.poolType === 0
                    ? `/presale-details/${rowdata.poolAddress}${
                        chainId ? `?chainid=${chainId}` : ""
                      }`
                    : rowdata.poolType === 1
                    ? `/private-details/${rowdata.poolAddress}${
                        chainId ? `?chainid=${chainId}` : ""
                      }`
                    : rowdata.poolType === 2
                    ? `/fairlaunch-details/${rowdata.poolAddress}??chainid=${chainId}`
                    : "/"
                }
              >
                <h4 className="mx-0 mt-2 mb-0">
                  {tokenInfo.name ? tokenInfo.name : ""}
                </h4>
              </Link>
              <h6 className="color-primary m-0">{tokenInfo.symbol}</h6>
            </div>
            <div className="social-icons">
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

        <div className="card-body p-0">
          <div className="m-timecount-container">            
            <div className="d-flex justify-content-end mt-1 mr-3">
              {/* <span>{parseFloat(rowdata.percentageRaise).toFixed(2)}%</span> */}
              <span>
                Raised&nbsp;
                <span className="color-primary">{rowdata.totalRaised ? rowdata.totalRaised : 0}{" "} 
                  <span style={{fontSize: "0.5rem", position: "absolute"}}>{rowdata.currencySymbol}</span>
                </span>
              </span>
            </div>
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
                {(rowdata.poolType === 0 || rowdata.poolType === 1) && (
                  <>
                    1 {rowdata.currencySymbol} = {formatPrice(Number(ethers.utils.formatUnits(rowdata.rate, tokenInfo.decimals)))}{" "}
                    {tokenInfo.symbol}
                  </>
                )}
              </span>
            </div>
          </div>


          <div className="d-flex justify-content-between align-items-center w-100 mt-3 mb-3">
            <div className="m-project-container">
              <p>Softcap</p>
              <p className="m-value">
                {rowdata.softCap} {rowdata.currencySymbol}
              </p>
            </div>
            <div className="m-project-container">
              <p>Launch Date</p>
              <p className="m-value">
                {dateFormat(new Date(rowdata.startTime * 1000), "yyyy:mm:dd HH:MM")}
              </p>
            </div>
            <div className="m-project-container">
              <p>Hardcap</p>
              <p className="m-value">
                {rowdata.hardCap} {rowdata.currencySymbol}
              </p>
            </div>
          </div>

          {status !== "upcoming" && account &&<div className="m-action-container">         
            <div className="d-flex justify-content-between mt-1 mr-4">
              <span>{status === "completed" ? "Claim" : "Deposit"}</span>
              {status !== "completed" && <span>
                Limit&nbsp;
                {userMaxAlloc > 0 && <span className="color-primary">{rowdata.minContribution} - {Number(userMaxAlloc.toFixed(4))}{" "}
                  <span style={{fontSize: "0.5rem", position: "absolute"}}>{rowdata.currencySymbol}</span>
                </span>}
                {userMaxAlloc <= 0 && <span className="color-primary">0
                  <span style={{fontSize: "0.5rem", position: "absolute"}}>{rowdata.currencySymbol}</span>
                </span>}
              </span>}
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <div className="m-input-container mr-1">
                <input
                  type="number"
                  placeholder="0"
                  disabled={status === "completed"}
                  value={status === "completed" ? userAvalibleClaim : amount}
                  onChange={handleChangeAmount}
                  style={{color: "black"}}
                />
                {status !== "completed" && <div className="mr-2 color-primary" style={{cursor: "pointer"}} onClick={handleMaxAmount}>
                  MAX
                </div>}
                <img src={ethereum_pink} alt="icon" width="15px" />
              </div>
              <Button className={`btn default-btn ${loading? "px-1" : ""}`} style={{minWidth: "120px"}} 
                  loading={loading} 
                  disabled={btndisabled} 
                  onClick={status === "completed" ? handleClaimToken : handleSubmitContribution}
              >
                    {status === "completed" ? 'Claim' : 'SUBMIT'}
              </Button>
            </div>
            <span className="text-danger">
                <small>{error_msg}</small>
              </span>
          </div>}

          <div className="m-timecount-container mt-3">          
            <div>
              <Link
                to={
                  rowdata.poolType === 0
                    ? `/presale-details/${rowdata.poolAddress}${
                        chainId ? `?chainid=${chainId}` : ""
                      }`
                    : rowdata.poolType === 1
                    ? `/private-details/${rowdata.poolAddress}${
                        chainId ? `?chainid=${chainId}` : ""
                      }`
                    : rowdata.poolType === 2
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
    </div>
  );
};

export default ProjectCard;

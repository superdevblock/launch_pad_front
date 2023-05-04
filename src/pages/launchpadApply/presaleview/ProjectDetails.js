import React, { useEffect, useState } from "react";
import { useCommonStats, useAccountStats } from "./helper/useStats";
import Countdown, { zeroPad } from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import dateFormat from "dateformat";
import { getChainId, supportNetwork } from "../../../hooks/network";
import Button from "react-bootstrap-button-loader";
import { formatPrice } from "../../../hooks/contractHelper";
import poolAbi from "../../../json/presalePool.json";
import distributeAbi from "../../../json/distribute.json";
import ERC20Abi from "../../../json/ERC20.json";
import { parseEther } from "ethers/lib/utils";
import { toast } from "react-toastify";
import { getWeb3 } from "../../../hooks/connectors";
import { getContract } from "../../../hooks/contractHelper";
import ReactPlayer from "react-player/youtube";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { contract, trimAddress } from "../../../hooks/constant";
import { AiFillEdit, RiDiscordFill, RiFacebookFill, RiGithubFill, RiGlobalFill, RiInstagramFill, RiRedditFill, RiTelegramFill, RiTwitterFill } from "react-icons/all";

import question from "../../../images/question.png"
import { async } from "q";
import { ethers } from "ethers";

export default function ProjectDetails() {
  const [updater, setUpdater] = useState(1);
  const stats = useCommonStats(updater);
  const accStats = useAccountStats(updater);
  const [currentTime] = useState(Math.floor(new Date().getTime() / 1000.0));
  const [social, setSocial] = useState({});
  const { chainId, account, library } = useWeb3React();
  const [amount, setAmount] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [btndisabled, setBtndisabled] = useState(false);
  const [error_msg, setError_msg] = useState("");
  const [loading, setLoading] = useState(false);
  const [waddloading, setWaddloading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);
  const [wcLoading, setWcLoading] = useState(false);
  const [ctLoading, setCtLoading] = useState(false);
  const [cbtLoading, setCbtLoading] = useState(false);
  const [locklLoading, setLocklLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [refcopy1, setRefcopy1] = useState(false);
  const [refcopy2, setRefcopy2] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [unsetmodalShow, setUnsetmodalShow] = useState(false);
  const [editmodalShow, setEditmodalShow] = useState(false);
  const [enableDistributeModal, setEnableDistributeModal] = useState(false);
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [removeWhitelistAddress, setRemoveWhitelistAddress] = useState("");
  const [allowedDistributors, setAllowedDistributors] = useState("");
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainId");
  const _chainId_ = getChainId(queryChainId, chainId)
  const [error, setError] = useState({
    logourl: "",
    bannerurl: "",
    website: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    youtube: "",
    brief: "",
  });

  const [editSocial, setEditSocial] = useState({
    logourl: "",
    bannerurl: "",
    website: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    youtube: "",
    brief: "",
  });

  const [isValidLogoUrl, setIsValidLogoUrl] = useState(true);
  const [isValidBannerUrl, setIsValidBannerUrl] = useState(true);

  const handleLoadLogo = () => {
    setIsValidLogoUrl(true);
  };

  const handleErrorLogo = () => {
    setIsValidLogoUrl(false);
  };
  const handleLoadBanner = () => {
    setIsValidBannerUrl(true);
  };

  const handleErrorBanner = () => {
    setIsValidBannerUrl(false);
  };
  useEffect(() => {
    async function getDetails() {
      let details = stats.poolDetails.toString().split("$#$");
      const object = {
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

      setSocial(object);
      setEditSocial(object);
    }
    if (stats) {
      getDetails();
    }
  }, [stats]);

  const startTime = new Date(stats.startTime * 1000);
  const endTime = new Date(stats.endTime * 1000);

  const [distributionInfo, setDistributionInfo] = useState({
    enabled: false,
    allowed: false,
    claimed: false,
    claimable: 0
  })
  const [isOperator, setIsOperator] = useState(false)
  useEffect(() => {
    const fetchDistributionInfo = async (account) => {
      try {
        const web3 = getWeb3(_chainId_)
        const distributeContract = new web3.eth.Contract(distributeAbi, contract[_chainId_]["distribute"]);
        const result = await distributeContract.methods.getInfoForUser(stats.token, account).call();
        setDistributionInfo({
          enabled: result[0],
          allowed: result[2],
          claimed: result[1],
          claimable: Number(ethers.utils.formatUnits(result[3], stats.tokenDecimal))
        })

        const _operator = await distributeContract.methods.operator().call()
        if(_operator.toLowerCase() === account.toLowerCase()) {
          setIsOperator(true);
        } else {
          setIsOperator(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if(account) {
      fetchDistributionInfo(account)
    }
  }, [_chainId_, account, library, stats.poolAddress, stats.token, stats.tokenDecimal, updater])

  const checkValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "facebook":
      case "twitter":
      case "github":
      case "telegram":
      case "instagram":
      case "discord":
      case "reddit":
      case "youtube":
      case "blockstart":
        reg = new RegExp(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
        );
        if (inputValue !== "" && !reg.test(inputValue)) {
          terror += 1;
          message = "Please Enter Valid url!";
        } else {
          message = "";
        }
        break;

      case "logourl":
      case "bannerurl":
      case "website":
        reg = new RegExp(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
        );
        if (!reg.test(inputValue)) {
          terror += 1;
          message = "Please Enter Valid url!";
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
    Object.keys(editSocial).map((key, index) => {
      switch (key) {
        case "facebook":
        case "twitter":
        case "github":
        case "telegram":
        case "instagram":
        case "discord":
        case "reddit":
        case "youtube":
        case "blockstart":
          reg = new RegExp(
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
          );
          if (editSocial[key] !== "" && !reg.test(editSocial[key])) {
            terror += 1;
          }

          break;

        case "logourl":
        case "bannerurl":
        case "website":
          reg = new RegExp(
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
          );
          if (!reg.test(editSocial[key])) {
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
    checkValidation(e.target.name, e.target.value);
    setEditSocial({ ...editSocial, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    let check = checkAllValidation();
    if (check) {
      e.preventDefault();
      setEditLoading(true);
      try {
        if (account) {
          let poolContract = getContract(poolAbi, stats.poolAddress, library);
          let detailsset = `${editSocial.logourl}$#$${editSocial.bannerurl}$#$${editSocial.website}$#$$#$${editSocial.facebook}$#$${editSocial.twitter}$#$${editSocial.github}$#$${editSocial.telegram}$#$${editSocial.instagram}$#$${editSocial.discord}$#$${editSocial.reddit}$#$${editSocial.youtube}$#$${editSocial.brief}`;
          let tx = await poolContract.updatePoolDetails(detailsset, {
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
                setEditLoading(false);
                setEditmodalShow(false);
              } else if (response.status === false) {
                toast.error("Error ! Your last transaction is failed.");
                setUpdater(new Date());
                setEditLoading(false);
              } else {
                toast.error("Error ! something went wrong.");
                setUpdater(new Date());
                setEditLoading(false);
              }
            }
          }, 5000);
        } else {
          toast.error("Please Connect to wallet !");
          setEditLoading(false);
        }
      } catch (err) {
        toast.error(err.reason ? err.reason : err.message);
        setEditLoading(false);
      }
    } else {
      toast.error(
        "Required all field or Enter wrong value  ! please check again"
      );
    }
  };

  const countdownrender = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <ul>
          <li>
            <pre>00 D : </pre>
          </li>
          <li>
            <pre>00 H : </pre>
          </li>
          <li>
            <pre>00 M : </pre>
          </li>
          <li>
            <pre>00 S</pre>
          </li>
        </ul>
      );
    } else {
      // Render a countdown
      return (
        <ul>
          <li>
            <pre>{zeroPad(days, 2)} D : </pre>
          </li>
          <li>
            <pre>{zeroPad(hours, 2)} H : </pre>
          </li>
          <li>
            <pre>{zeroPad(minutes, 2)} M : </pre>
          </li>
          <li>
            <pre>{zeroPad(seconds, 2)} S</pre>
          </li>
        </ul>
      );
    }
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
      parseFloat(e.target.value) < parseFloat(stats.minContribution) ||
      parseFloat(e.target.value) > parseFloat(stats.userMaxAllocation)
    ) {
      setError_msg(
        stats.userMaxAllocation > 0 ? `amount must be between ${stats.minContribution} and ${stats.userMaxAllocation}` : `you are unable to purchase because you are not a tier.`
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
      stats.currencyAddress === "0x0000000000000000000000000000000000000000"
        ? parseFloat(accStats.balance) - parseFloat(0.01)
        : parseFloat(accStats.balance);
    if (
      parseFloat(maxamount) < parseFloat(stats.minContribution) ||
      parseFloat(maxamount) > parseFloat(stats.userMaxAllocation)
    ) {
      setError_msg(
        `amount must be between ${stats.minContribution} and ${stats.userMaxAllocation}`
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
        (parseFloat(stats.maxContribution) > parseFloat(amount) ||
          parseFloat(stats.minContribution) < parseFloat(amount))
      ) {
        if (account) {
          if (chainId) {
            if (parseFloat(accStats.balance) >= parseFloat(amount)) {
              let poolContract = getContract(
                poolAbi,
                stats.poolAddress,
                library
              );

              let tokenAmount =
                stats.currencyAddress ===
                "0x0000000000000000000000000000000000000000"
                  ? 0
                  : parseEther(amount);
              let ethAmount =
                stats.currencyAddress ===
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

  const handleApprove = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (account) {
        if (chainId) {
          let currencyContract = getContract(
            ERC20Abi,
            stats.currencyAddress,
            library
          );

          let amount = parseEther("1000000000000000000000000000").toString();
          let tx = await currencyContract.approve(stats.poolAddress, amount, {
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
                toast.success("Success ! Your last transaction is success 👍");
                setUpdater(new Date());
                setLoading(false);
                accStats.allowance = "1000000000000000000000000000";
                setAllowance(accStats.allowance);
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
          toast.error("Please select Smart Chain Network !");
          setLoading(false);
        }
      } else {
        toast.error("Please Connect Wallet!");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.reason);
      setLoading(false);
    }
  };

  const handleWhitelistStatus = async (e) => {
    e.preventDefault();
    // try {
    if (account) {
      if (chainId) {
        let whitelist_status = e.target.value === "1" ? true : false;

        let poolContract = getContract(poolAbi, stats.poolAddress, library);

        let tx = await poolContract.setWhitelisting(whitelist_status, {
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
              toast.success("Success ! Your last transaction is success 👍");
              setUpdater(new Date());
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
            }
          }
        }, 5000);
      } else {
        toast.error("Please select Smart Chain Network !");
      }
    } else {
      toast.error("Please Connect Wallet!");
    }

    // }
    // catch (err) {
    //     toast.error(err.reason);

    // }
  };

  const handleSetWhitelist = async (e) => {
    e.preventDefault();
    setWaddloading(true);
    try {
      const waddress = whitelistAddress.split(/\r?\n/);
      if (waddress.length > 0) {
        if (account) {
          let poolContract = getContract(poolAbi, stats.poolAddress, library);

          let tx = await poolContract.addWhitelistedUsers(waddress, {
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
                toast.success("Success ! Your last transaction is success 👍");
                setUpdater(new Date());
                setWaddloading(false);
              } else if (response.status === false) {
                toast.error("Error ! Your last transaction is failed.");
                setUpdater(new Date());
                setWaddloading(false);
              } else {
                toast.error("Error ! something went wrong.");
                setUpdater(new Date());
                setWaddloading(false);
              }
            }
          }, 5000);
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };

  const handleRemoveWhitelist = async (e) => {
    e.preventDefault();
    setWaddloading(true);
    try {
      const waddress = removeWhitelistAddress.split(/\r?\n/);
      if (waddress.length > 0) {
        if (account) {
          let poolContract = getContract(poolAbi, stats.poolAddress, library);

          let tx = await poolContract.removeWhitelistedUsers(waddress, {
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
                toast.success("Success ! Your last transaction is success 👍");
                setUpdater(new Date());
                setWaddloading(false);
              } else if (response.status === false) {
                toast.error("Error ! Your last transaction is failed.");
                setUpdater(new Date());
                setWaddloading(false);
              } else {
                toast.error("Error ! something went wrong.");
                setUpdater(new Date());
                setWaddloading(false);
              }
            }
          }, 5000);
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };
  
  const handleEnableDistribute = async (e) => {
    e.preventDefault();
    setWaddloading(true);
    try {
      const waddress = allowedDistributors.split(/\r?\n/);
      if (waddress.length > 0) {
        if (account) {
          let distributeContract = getContract(distributeAbi, contract[_chainId_]["distribute"], library);
console.log("sniper: w addresses: ", waddress, stats.token)
          let tx = await distributeContract.enablePool(stats.token, waddress, {
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
                toast.success("Success ! Your last transaction is success 👍");
                setUpdater(new Date());
                setWaddloading(false);
              } else if (response.status === false) {
                toast.error("Error ! Your last transaction is failed.");
                setUpdater(new Date());
                setWaddloading(false);
              } else {
                toast.error("Error ! something went wrong.");
                setUpdater(new Date());
                setWaddloading(false);
              }
            }
          }, 5000);
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    setFinalLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, stats.poolAddress, library);

        let tx = await poolContract.finalize({
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
              setFinalLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setFinalLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setFinalLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setFinalLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setFinalLoading(false);
    }
  };

  const handleWithdrawContribution = async (e) => {
    e.preventDefault();
    setWcLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, stats.poolAddress, library);

        let tx = await poolContract.withdrawContribution({
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
              setWcLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setWcLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setWcLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setWcLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setWcLoading(false);
    }
  };
  
  const handleClaimToken = async (e) => {
    e.preventDefault();
    setCtLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, stats.poolAddress, library);

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
              setCtLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setCtLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setCtLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setCtLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setCtLoading(false);
    }
  };

  const handleClaimBonusToken = async (e) => {
    e.preventDefault();
    setCbtLoading(true);
    try {
      if (account) {
        let distributeContract = getContract(distributeAbi, contract[_chainId_]["distribute"], library);

        let tx = await distributeContract.claimBonus(stats.token, {
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
              setCbtLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setCbtLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setCbtLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setCbtLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setCbtLoading(false);
    }
  };

  const handleWithdrawLiquidity = async (e) => {
    e.preventDefault();
    setLocklLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, stats.poolAddress, library);

        let tx = await poolContract.withdrawLiquidity({
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
              setLocklLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setLocklLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setLocklLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setLocklLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setLocklLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setLocklLoading(true);
    try {
      if (account) {
        let poolContract = getContract(poolAbi, stats.poolAddress, library);

        let tx = await poolContract.cancel({
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
              setLocklLoading(false);
            } else if (response.status === false) {
              toast.error("Error ! Your last transaction is failed.");
              setUpdater(new Date());
              setLocklLoading(false);
            } else {
              toast.error("Error ! something went wrong.");
              setUpdater(new Date());
              setLocklLoading(false);
            }
          }
        }, 5000);
      } else {
        toast.error("Please Connect to wallet !");
        setLocklLoading(false);
      }
    } catch (err) {
      toast.error(err.reason ? err.reason : err.message);
      setLocklLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div className="detail-page container mt-3">
        <section className="item-details-area">
          <div className="row">
            <div className="col-12 col-md-8">
              <div className="card project-card no-hover py-4 px-2">
                <div className="row">
                  {social.logourl && isValidLogoUrl && <div className="col-12 col-md-2 text-center">
                    <img
                      className="card-img-top avatar-max-lg mt-1 "
                      width="100%"
                      height="auto"
                      src={social.logourl}
                      onLoad={handleLoadLogo}
                      onError={handleErrorLogo}
                      alt="iconimage12"
                    />
                  </div>}
                  {!isValidLogoUrl && <div className="col-12 col-md-2 text-center">
                    <img
                      className="card-img-top avatar-max-lg mt-1 "
                      width="100%"
                      height="auto"
                      src={question}
                      alt="iconimage12"
                    />
                  </div>}
                  <div className="col-12 col-md-10">
                    <div className="row align-items-center justify-content-md-start justify-content-center">
                      <h4 className="mt-1 mb-2 text-center text-md-left">
                        {stats.tokenName} Presale
                      </h4>
                      <div className="d-flex gap-1 justify-content-center audit-status">
                        {stats.audit &&
                          (stats.auditStatus ||
                            (stats.auditLink && (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={stats.auditLink}
                              >
                                <h4 className="tag-btn text-uppercase text-center bg-yellow">
                                  Audit
                                </h4>
                              </a>
                            )))}
                        {stats.kyc &&
                          (stats.kycStatus ||
                            (stats.kycLink && (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={stats.kycLink}
                              >
                                <h4 className="tag-btn text-uppercase text-center bg-purple">
                                  KYC
                                </h4>
                              </a>
                            )))}
                      </div>
                    </div>
                    <div className="social-share d-flex justify-content-center justify-content-md-start">
                      <ul className="d-flex list-unstyled">
                        {social.twitter && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.twitter}
                            >
                              <RiTwitterFill />
                            </a>
                          </li>
                        )}
                        {social.telegram && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.telegram}
                            >
                              <RiTelegramFill />
                            </a>
                          </li>
                        )}
                        {social.website && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.website}
                            >
                              <RiGlobalFill />
                            </a>
                          </li>
                        )}
                        {social.discord && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.discord}
                            >
                              <RiDiscordFill />
                            </a>
                          </li>
                        )}
                        {social.facebook && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.facebook}
                            >
                              <RiFacebookFill />
                            </a>
                          </li>
                        )}
                        {social.github && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.github}
                            >
                              <RiGithubFill />
                            </a>
                          </li>
                        )}

                        {social.instagram && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.instagram}
                            >
                              <RiInstagramFill />
                            </a>
                          </li>
                        )}

                        {social.reddit && (
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={social.reddit}
                            >
                              <RiRedditFill />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    <p className="text-center text-md-left">
                      {editSocial.brief}
                    </p>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Presale Address</p>
                    <p className="text-right">
                      {trimAddress(stats.poolAddress)}
                      <CopyToClipboard
                        text={stats.poolAddress}
                        onCopy={() => {
                          setRefcopy1(true);
                          setTimeout(() => {
                            setRefcopy1(false);
                          }, 2000);
                        }}
                      >
                        <img
                          className="ml-2"
                          src={require("../../../images/icon.png").default}
                          alt="project"
                        />
                      </CopyToClipboard>
                      <span>{refcopy1 && "copied"}</span>
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Token Name</p>
                    <p className="text-right">{stats.tokenName}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Token Symbol</p>
                    <p className="text-right">{stats.tokenSymbol}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Token Decimals</p>
                    <p className="text-right">{stats.tokenDecimal}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Token Address</p>
                    <p className="text-right">
                      {trimAddress(stats.token)}
                      <CopyToClipboard
                        text={stats.token}
                        onCopy={() => {
                          setRefcopy2(true);
                          setTimeout(() => {
                            setRefcopy2(false);
                          }, 2000);
                        }}
                      >
                        <img
                          className="ml-2"
                          src={require("../../../images/icon.png").default}
                          alt="project"
                        />
                      </CopyToClipboard>
                      <span>{refcopy2 && "copied"}</span>
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Total Supply</p>
                    <p className="text-right">
                      {formatPrice(stats.tokenSupply)} {stats.tokenSymbol}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Presale Rate </p>
                    <p className="text-right">
                      1 {stats.currencySymbol} = {formatPrice(stats.rate)}{" "}
                      {stats.tokenSymbol}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Listing Rate </p>
                    <p className="text-right">
                      1 {stats.currencySymbol} ~{" "}
                      {formatPrice(stats.liquidityListingRate)}{" "}
                      {stats.tokenSymbol}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Soft Cap </p>
                    <p className="text-right">
                      {stats.softCap} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Hard Cap </p>
                    <p className="text-right">
                      {stats.hardCap} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Unsold Tokens </p>
                    <p className="text-right">{stats.refundType === "0" ? "Refund" : "Burn"}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Presale Start Time </p>
                    <p className="text-right">{dateFormat(startTime, "yyyy-mm-dd HH:MM")}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Presale End Time </p>
                    <p className="text-right">{dateFormat(endTime, "yyyy-mm-dd HH:MM")}</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Listing On </p>
                    <p className="text-right">
                      {contract[queryChainId]
                        ? contract[queryChainId].routername
                        : contract[chainId]
                        ? contract[chainId].routername
                        : contract["default"].routername}
                    </p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Liquidity Percent </p>
                    <p className="text-right">{stats.liquidityPercent} %</p>
                  </div>
                  <div className="col-12 my-2 d-flex justify-content-between">
                    <p>Liquidity Unlocked Time </p>
                    <p className="text-right">{parseFloat(stats.liquidityLockDays) / 60} minutes</p>
                  </div>
                </div>
                <div className="presale-status">
                  {stats.poolState === "1" ? (
                    <h4 className="tag-btn text-uppercase text-center bg-completed">
                      Completed
                    </h4>
                  ) : stats.poolState === "2" ? (
                    <h4 className="tag-btn text-uppercase text-center bg-canceled">
                      Canceled
                    </h4>
                  ) : parseInt(stats.endTime) <
                    Math.floor(new Date().getTime() / 1000.0) ? (
                    <h4 className="tag-btn text-uppercase text-center bg-ended">
                      Ended
                    </h4>
                  ) : parseInt(stats.startTime) >
                    Math.floor(new Date().getTime() / 1000.0) ? (
                    <h4 className="tag-btn text-uppercase text-center bg-upcoming">
                      Upcoming
                    </h4>
                  ) : parseInt(stats.startTime) <
                      Math.floor(new Date().getTime() / 1000.0) &&
                    parseInt(stats.endTime) >
                      Math.floor(new Date().getTime() / 1000.0) ? (
                    <h4 className="tag-btn text-uppercase text-center bg-active">
                      Active
                    </h4>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card project-card no-hover">
                {isValidBannerUrl && <div
                  className="card-header"
                  style={{
                    borderBottom: `1px solid white`,
                    borderRadius: "0",
                    height: "10vw",
                  }}
                ><img
                className=""
                // width="100%"
                // height="100vw"
                src={social.bannerurl}
                onLoad={handleLoadBanner}
                onError={handleErrorBanner}
                alt="iconimage12"
              /></div>}
                
                {/* {isValidBannerUrl && <img
                      className="card-img-top avatar-max-lg mt-1 "
                      // width="100%"
                      height="100vw"
                      src={social.bannerurl}
                      onLoad={handleLoadBanner}
                      onError={handleErrorBanner}
                      alt="iconimage12"
                    />} */}
                <div className="card-body">
                  <div className="mt-md-0 mt-3 d-flex justify-content-center">
                    <div className="countdown">
                      <div
                        className="text-center"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {parseInt(stats.endTime) <
                        Math.floor(new Date().getTime() / 1000.0)
                          ? "Ended"
                          : parseInt(stats.startTime) >
                            Math.floor(new Date().getTime() / 1000.0)
                          ? "Start In"
                          : parseInt(stats.startTime) <
                              Math.floor(new Date().getTime() / 1000.0) &&
                            parseInt(stats.endTime) >
                              Math.floor(new Date().getTime() / 1000.0)
                          ? "End In"
                          : ""}
                      </div>
                      <Countdown
                        key={Math.floor(Math.random() * 10 + 1)}
                        date={
                          stats.startTime > currentTime
                            ? stats.startTime * 1000
                            : stats.endTime * 1000
                        }
                        renderer={countdownrender}
                      />
                    </div>
                  </div>
                  <div className="item-progress">
                    <div className="progress mb-1">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${parseFloat(stats.percentageRaise).toFixed(
                            2
                          )}%`,
                        }}
                        aria-valuenow={parseFloat(
                          stats.percentageRaise
                        ).toFixed(2)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {parseFloat(stats.percentageRaise).toFixed(2)}%
                      </div>
                    </div>
                    <div className="progress-sale d-flex justify-content-between">
                      <span>0 {stats.currencySymbol}</span>
                      <span>
                        {stats.hardCap} {stats.currencySymbol}
                      </span>
                    </div>
                  </div>
                  <div className="staking-area mt-4">
                    <div className="staking-card single-staking">
                      <p>Amount</p>
                      <div className="input-box my-1">
                        <div className="input-area d-flex flex-column">
                          <div className="input-text">
                            <input
                              type="text"
                              value={amount}
                              onChange={(e) => {
                                handleChangeAmount(e);
                              }}
                              placeholder="0.00"
                            />
                            <a
                              href="#sec"
                              onClick={(e) => {
                                handleMaxAmount(e);
                              }}
                            >
                              Max
                            </a>
                          </div>
                          <div className="mt-2">
                            {stats.currencyAddress ===
                              "0x0000000000000000000000000000000000000000" ||
                            accStats.allowance > 0 ||
                            allowance > 0 ? (
                              <Button
                                variant="none"
                                disabled={btndisabled}
                                loading={loading}
                                type="button"
                                onClick={(e) => {
                                  handleSubmitContribution(e);
                                }}
                                className="btn btn-bordered-white"
                              >
                                SUBMIT
                              </Button>
                            ) : (
                              <Button
                                variant="none"
                                loading={loading}
                                type="button"
                                onClick={(e) => {
                                  handleApprove(e);
                                }}
                                className="btn btn-bordered-white"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>
                        <span className="text-danger">
                          <small>{error_msg}</small>
                        </span>
                      </div>
                      {(stats.poolState === "2" || stats.poolState === "0") && (
                        <React.Fragment>
                          <p className="mt-4">Your Contribution</p>
                          <span className="mt-0 mb-3">
                            {accStats.contributionOf
                              ? formatPrice(accStats.contributionOf)
                              : "0"}{" "}
                            {stats.currencySymbol}
                          </span>
                        </React.Fragment>
                      )}
                      {/* <div className="input-area d-flex flex-column flex-md-row mb-3"> */}
                      {stats.poolState === "1" && (
                        <React.Fragment>
                          <p className="mb-15">Your Claimble Token</p>
                          <span className="mt-0 mb-3">
                            {accStats.userAvalibleClaim
                              ? formatPrice(accStats.userAvalibleClaim)
                              : "0"}{" "}
                            {stats.tokenSymbol}
                          </span>
                          <Button
                            loading={ctLoading}
                            variant="none"
                            className="btn input-btn mt-2 mt-md-0 mr-md-3"
                            onClick={(e) => handleClaimToken(e)}
                          >
                            Claim Token
                          </Button>
                        </React.Fragment>
                      )}
                      {distributionInfo.enabled && distributionInfo.allowed && (
                        <React.Fragment>
                          <p className="mb-15">Your Claimble Bonus Token</p>
                          <span className="mt-0 mb-3">
                            {!distributionInfo.claimed
                              ? formatPrice(distributionInfo.claimable)
                              : "0"}{" "}
                            {stats.tokenSymbol}
                          </span>
                          <Button
                            loading={cbtLoading}
                            variant="none"
                            className="btn input-btn mt-2 mt-md-0 mr-md-3"
                            onClick={(e) => handleClaimBonusToken(e)}
                          >
                            Claim Bonus Token
                          </Button>
                        </React.Fragment>
                      )}
                      {accStats.contributionOf > 0 &&
                        (stats.poolState === "2" ||
                          stats.poolState === "0") && (
                          <>
                            <Button
                              loading={wcLoading}
                              className="btn input-btn mt-4 mt-md-0 mr-md-3"
                              onClick={(e) => handleWithdrawContribution(e)}
                            >
                              Withdraw Contribution
                            </Button>
                            <small className="text-danger">
                              *Early withdrawal of 10% penalty
                            </small>
                          </>
                        )}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card project-card no-hover">
                <div className="card no-hover staking-card single-staking">
                  <div className="d-flex justify-content-between mb-2">
                    <p>Sale Type</p>
                    <p className="text-right">Presale</p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Access type</p>
                    <p className="text-right">{stats.useWhitelisting ? "Whitelist" : "Public"}</p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Min. Allocation</p>
                    <p className="text-right">
                      {stats.minContribution} {stats.currencySymbol}
                    </p>
                  </div>
                  {/* <div className="d-flex justify-content-between mb-2">
                    <p>Max. Allocation</p>
                    <p className="text-right">
                      {stats.userMaxAllocation} {stats.currencySymbol}
                    </p>
                  </div> */}
                  <div className="d-flex justify-content-between mb-2 mt-3">
                    <p>Tier0. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (1 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Tier1. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (2 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Tier2. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (3 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Tier3. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (4 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Tier4. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (5 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Tier5. Max. Allocation</p>
                    <p className="text-right">
                      {Number((stats.tokenSupply * (6 * stats.bonusRateperTier) / stats.rate).toFixed(4))} {stats.currencySymbol}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card project-card no-hover staking-card single-staking">
                <div className="d-flex justify-content-between">
                  <h5 className="m-3">Admin Zone</h5>
                  {stats.governance &&
                    account &&
                    stats.governance.toLowerCase() ===
                      account.toLowerCase() && (
                      <a
                        href="#sec"
                        onClick={(e) => setEditmodalShow(!editmodalShow)}
                      >
                        <AiFillEdit fill="balck" />
                      </a>
                    )}
                </div>
                {stats.governance &&
                account &&
                stats.governance.toLowerCase() === account.toLowerCase() ? (
                  <React.Fragment>
                    <ul
                      className="nav nav-tabs staking-tabs border-0 my-3 my-md-4 justify-content-center"
                      role="tablist"
                    >
                      <li className="nav-item mr-1" role="presentation">
                        <button
                          value="1"
                          onClick={(e) => handleWhitelistStatus(e)}
                          className={`btn tab-link ${
                            stats.useWhitelisting ? "active" : ""
                          }`}
                          href="#tab-one"
                          role="tab"
                        >
                          Whitelist
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          value="2"
                          onClick={(e) => handleWhitelistStatus(e)}
                          className={`btn tab-link ${
                            stats.useWhitelisting ? "" : "active"
                          }`}
                          href="#tab-two"
                        >
                          Public
                        </button>
                      </li>
                    </ul>

                    <div className="input-box my-1">
                      <div className="input-area d-flex justify-content-center flex-column flex-md-row mb-3">
                        <button
                          type="button"
                          className="btn input-btn mt-2 mt-md-0 ml-md-3"
                          onClick={(e) => setModalShow(!modalShow)}
                        >
                          Add users whitelist
                        </button>
                        <button
                          type="button"
                          className="btn input-btn mt-2 mt-md-0 ml-md-3"
                          onClick={(e) => setUnsetmodalShow(!unsetmodalShow)}
                        >
                          Remove whitelist users
                        </button>
                      </div>
                    </div>
                    <div className="input-box my-1">
                      <div className="input-area d-flex justify-content-center flex-column flex-md-row mb-3">
                        {stats.poolState === "0" && (
                          <Button
                            variant="none"
                            loading={locklLoading}
                            onClick={(e) => handleCancel(e)}
                            type="button"
                            className="btn btn-bordered-white mt-2 mt-md-0 ml-md-3"
                          >
                            cancel
                          </Button>
                        )}
                        { stats.poolState === "0" &&
                          ((stats.totalRaised === stats.hardCap || parseFloat(stats.hardCap - stats.totalRaised) < parseFloat(stats.minContribution)) ||
                            (stats.totalRaised >= stats.softCap && Math.floor(new Date().getTime() / 1000.0) >= stats.endTime)) && 
                          (
                            <Button
                              variant="none"
                              type="button"
                              loading={finalLoading}
                              onClick={(e) => handleFinalize(e)}
                              className="btn btn-bordered-white mt-2 mt-md-0 ml-md-3"
                            >
                              Finalize
                            </Button>
                          )}
                        {stats.poolState === "1" &&
                          stats.liquidityUnlockTime <=
                            Math.floor(new Date().getTime() / 1000.0) && (
                            <Button
                              type="button"
                              loading={locklLoading}
                              onClick={(e) => handleWithdrawLiquidity(e)}
                              className="btn btn-bordered-white mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw Liquidity
                            </Button>
                          )}
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="d-flex justify-content-center">
                    <h5 className="my-4">You are not owner of pool</h5>
                  </div>
                )}
              </div>
              {isOperator && <div className="card project-card no-hover staking-card single-staking">
                <div className="d-flex justify-content-between">
                  <h5 className="m-3">Operator Zone</h5>
                </div>
                <React.Fragment>
                  <div className="input-box my-1">
                    <div className="input-area d-flex justify-content-center flex-column flex-md-row mb-3">
                      <button
                        type="button"
                        className="btn input-btn mt-2 mt-md-0 ml-md-3"
                        onClick={(e) => setEnableDistributeModal(!enableDistributeModal)}
                      >
                        Enable Distribute
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              </div>}
            </div>
          </div>
        </section>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add user to whitelist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                onChange={(e) => {
                  setWhitelistAddress(e.target.value);
                }}
                rows={8}
                placeholder="Insert address: separate with breaks line."
                value={whitelistAddress}
              />
            </Form.Group>
            <Button
              variant="none"
              className="btn btn-success"
              loading={waddloading}
              onClick={(e) => {
                handleSetWhitelist(e);
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={unsetmodalShow}
        onHide={() => setUnsetmodalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove user from whitelist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                onChange={(e) => {
                  setRemoveWhitelistAddress(e.target.value);
                }}
                rows={8}
                placeholder="Insert address: separate with breaks line."
                value={removeWhitelistAddress}
              />
            </Form.Group>
            <Button
              variant="none"
              className="btn btn-success"
              loading={waddloading}
              onClick={(e) => {
                handleRemoveWhitelist(e);
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={editmodalShow}
        onHide={() => setEditmodalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>
                    Logo URL<span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.logourl}
                    name="logourl"
                    placeholder="e.g. https://blockstar.site/pwa_image/blockstar_pwa.png"
                  />
                  <small className="text-danger">{error.logourl}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>
                    Banner Image URL<span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.bannerurl}
                    name="bannerurl"
                    placeholder="e.g. https://blockstar.site/pwa_image/blockstar_pwa.png"
                  />
                  <small className="text-danger">{error.bannerurl}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>
                    Website*<span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.website}
                    name="website"
                    placeholder="e.g. https://blockstar.site"
                  />
                  <small className="text-danger">{error.website}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.facebook}
                    name="facebook"
                    placeholder="e.g. https://www.facebook.com/"
                  />
                  <small className="text-danger">{error.facebook}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.twitter}
                    name="twitter"
                    placeholder="e.g. https://twitter.com/"
                  />
                  <small className="text-danger">{error.twitter}</small>
                  <br />
                </div>
              </div>

              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Github</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    value={editSocial.github}
                    name="github"
                    placeholder="e.g. https://github.com/"
                  />
                  <small className="text-danger">{error.github}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Telegram</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="telegram"
                    value={editSocial.telegram}
                    placeholder="e.g. https://t.me/BlockStar_Social_Media"
                  />
                  <small className="text-danger">{error.telegram}</small>
                  <br />
                </div>
              </div>

              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="instagram"
                    value={editSocial.instagram}
                    placeholder="e.g. https://www.instagram.com/"
                  />
                  <small className="text-danger">{error.instagram}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Discord</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="discord"
                    value={editSocial.discord}
                    placeholder="e.g. https://discord.com/"
                  />
                  <small className="text-danger">{error.discord}</small>
                  <br />
                </div>
              </div>

              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Reddit</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="reddit"
                    value={editSocial.reddit}
                    placeholder="e.g. https://reddit.com/"
                  />
                  <small className="text-danger">{error.reddit}</small>
                  <br />
                </div>
              </div>
              <div className="col-md-6 mb-0">
                <div className="form-group">
                  <label>Youtube Video</label>
                  <input
                    className="form-control"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="youtube"
                    value={editSocial.youtube}
                    placeholder="e.g. https://www.youtube.com/watch?v=BHACKCNDMW8"
                  />
                  <small className="text-danger">{error.youtube}</small>
                  <br />
                </div>
              </div>

              <div className="col-md-12 mt-4 mb-0"></div>

              <div className="col-md-12 mt-4 mb-0 d-flex justify-content-center">
                <Button
                  className="btn btn-success"
                  loading={editLoading}
                  onClick={(e) => handleEditSubmit(e)}
                >
                  submit
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={enableDistributeModal}
        onHide={() => setEnableDistributeModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add users to get distributed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                onChange={(e) => {
                  setAllowedDistributors(e.target.value);
                }}
                rows={8}
                placeholder="Insert address: separate with breaks line."
                value={allowedDistributors}
              />
            </Form.Group>
            <Button
              variant="none"
              className="btn btn-success"
              loading={waddloading}
              onClick={(e) => {
                handleEnableDistribute(e);
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </React.Fragment>
  );
}

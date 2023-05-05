import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import presalePoolAbi from "../../../../json/FairPool.json";
// import lockAbi from '../../../../json/lockabi.json';
import ERC20Abi from "../../../../json/ERC20.json";
import {
  MulticallContractWeb3,
  multiCallContractConnect,
} from "../../../../hooks/useContracts";
import { getWeb3 } from "../../../../hooks/connectors";
import tokenAbi from "../../../../json/token.json";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { supportNetwork } from "../../../../hooks/network";
import { currencies } from "../../../../hooks/currencies";

export const useCommonStats = (update) => {
  const context = useWeb3React();
  const { chainId } = context;
  let history = useHistory();

  // let poolAddress = "0x6816e27bca20fbbe779ca9725d48c1e01a02943c";

  const location = useLocation();
  let urlAddress = location.pathname.split("/").pop();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const getCurrencyList = (currencies) => {
    let currencyList = [];
    currencies.map((currency, index) => {
      currencyList[currency.address] = currency.symbol;
    });
    return currencyList;
  };

  let currencyList = getCurrencyList(
    currencies[chainId] !== undefined
      ? currencies[chainId]
      : currencies["default"]
  );

  let web3 = getWeb3(queryChainId ? queryChainId : chainId);

  let poolContract = new web3.eth.Contract(presalePoolAbi, urlAddress);

  const [stats, setStats] = useState({
    endTime: 0,
    startTime: 0,
    softCap: 0,
    liquidityLockDays: 0,
    liquidityPercent: 0,
    liquidityUnlockTime: 0,
    poolDetails: 0,
    poolState: 0,
    rate: 0,
    token: 0,
    totalClaimed: 0,
    totalRaised: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: 0,
    tokenSupply: 0,
    percentageRaise: 0,
    refundType: 0,
    poolAddress: 0,
    governance: 0,
    kyc: false,
    audit: false,
    auditStatus: false,
    kycStatus: false,
    totalPresaleToken: 0,
    kycLink: "#",
    auditLink: "#",
    currencyAddress: "0x0000000000000000000000000000000000000000",
    currencySymbol: supportNetwork[queryChainId ? queryChainId : chainId]
      ? supportNetwork[queryChainId ? queryChainId : chainId].symbol
      : supportNetwork["default"].symbol,
  });

  const mc = MulticallContractWeb3(queryChainId ? queryChainId : chainId);

  // let lockAddress = contract[queryChainId ? queryChainId : chainId] ? contract[queryChainId ? queryChainId : chainId].lockAddress : contract['default'].lockAddress;
  // let lmc = new web3.eth.Contract(lockAbi, lockAddress);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          poolContract.methods.endTime(),
          poolContract.methods.startTime(),
          poolContract.methods.softCap(),
          poolContract.methods.liquidityLockDays(),
          poolContract.methods.liquidityPercent(),
          poolContract.methods.liquidityUnlockTime(),
          poolContract.methods.poolDetails(),
          poolContract.methods.poolState(),
          poolContract.methods.getPrice(),
          poolContract.methods.token(),
          poolContract.methods.totalClaimed(),
          poolContract.methods.totalRaised(),
          poolContract.methods.refundType(),
          poolContract.methods.governance(),
          poolContract.methods.kyc(),
          poolContract.methods.audit(),
          poolContract.methods.auditStatus(),
          poolContract.methods.kycStatus(),
          poolContract.methods.totalToken(),
          poolContract.methods.auditLink(),
          poolContract.methods.kycLink(),
          poolContract.methods.currency(), //24
        ]);

        let tokenContract = new web3.eth.Contract(tokenAbi, data[9]);

        const tokendata = await mc.aggregate([
          tokenContract.methods.name(),
          tokenContract.methods.decimals(),
          tokenContract.methods.symbol(),
          tokenContract.methods.totalSupply(),
          tokenContract.methods.balanceOf(
            "0x000000000000000000000000000000000000dead"
          ),
        ]);

        // const lockdata = await mc.aggregate([
        //   lmc.methods.cumulativeLockInfo(data[9])
        // ]);

        setStats({
          endTime: data[0],
          startTime: data[1],
          softCap: data[2] / Math.pow(10, 18),
          liquidityLockDays: data[3],
          liquidityPercent: data[4],
          liquidityUnlockTime: data[5],
          poolDetails: data[6],
          poolState: data[7],
          rate: data[8] / Math.pow(10, tokendata[1]),
          token: data[9],
          totalClaimed: data[10],
          totalRaised: data[11] / Math.pow(10, 18),
          tokenName: tokendata[0],
          tokenDecimal: tokendata[1],
          tokenSymbol: tokendata[2],
          percentageRaise:
            (data[11] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) * 100,
          tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
          refundType: data[12],
          poolAddress: urlAddress,
          governance: data[13],
          kyc: data[14],
          audit: data[15],
          auditStatus: data[16],
          kycStatus: data[17],
          totalPresaleToken: parseFloat(data[18] / Math.pow(10, tokendata[1])),
          currencyAddress: data[21],
          currencySymbol: currencyList[data[21].toLowerCase()],
          PresalePer: (data[19] / tokendata[3]) * 100,
          LiquidityPer: ((data[19] * data[4]) / 100 / tokendata[3]) * 100,
          BurntPer: (tokendata[4] / tokendata[3]) * 100,
          kycLink: data[19],
          auditLink: data[20],
        });
      } catch (err) {
        toast.error("wrong network selected !");
        history.push("/sale-list");
      }
    };

    if (mc) {
      fetch();
    } else {
      setStats({
        endTime: 0,
        startTime: 0,
        softCap: 0,
        liquidityLockDays: 0,
        liquidityPercent: 0,
        liquidityUnlockTime: 0,
        poolDetails: 0,
        poolState: 0,
        rate: 0,
        token: 0,
        totalClaimed: 0,
        totalRaised: 0,
        tokenName: "",
        tokenDecimal: 0,
        tokenSymbol: 0,
        tokenSupply: 0,
        percentageRaise: 0,
        refundType: 0,
        poolAddress: 0,
        governance: 0,
        kyc: false,
        audit: false,
        auditStatus: false,
        kycStatus: false,
        totalPresaleToken: 0,
        insurcePrice: 0,
        kycLink: "#",
        auditLink: "#",
        currencyAddress: "0x0000000000000000000000000000000000000000",
        currencySymbol: supportNetwork[queryChainId ? queryChainId : chainId]
          ? supportNetwork[queryChainId ? queryChainId : chainId].symbol
          : supportNetwork["default"].symbol,
      });
    }
    // eslint-disable-next-line
  }, [update, chainId]);

  return stats;
};

export const useAccountStats = (updater) => {
  const context = useWeb3React();
  const { chainId, account } = context;
  const location = useLocation();
  let history = useHistory();
  let urlAddress = location.pathname.split("/").pop();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  let web3 = getWeb3(queryChainId ? queryChainId : chainId);

  try {
    let poolAddress = web3.utils.isAddress(urlAddress);
    let isCode = web3.eth.getCode(urlAddress);
    if (isCode === "0x" || !poolAddress) {
      history.push("/sale-list");
    }
  } catch (err) {
    history.push("/");
  }

  let poolContract = new web3.eth.Contract(presalePoolAbi, urlAddress);

  const [stats, setStats] = useState({
    allowance: 0,
    balance: 0,
    contributionOf: 0,
    userAvalibleClaim: "",
  });

  const mc = MulticallContractWeb3(queryChainId ? queryChainId : chainId);
  const mcc = multiCallContractConnect(queryChainId ? queryChainId : chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const currency = await mc.aggregate([poolContract.methods.currency()]);

        const data = await mc.aggregate([
          mcc.methods.getEthBalance(account),
          poolContract.methods.contributionOf(account),
          poolContract.methods.userAvalibleClaim(account),
          poolContract.methods.token(),
        ]);

        let tokenContract = new web3.eth.Contract(tokenAbi, data[3]);

        const tokenDecimals = await mc.aggregate([
          tokenContract.methods.decimals(),
        ]);

        if (currency[0] !== "0x0000000000000000000000000000000000000000") {
          let currencyContract = new web3.eth.Contract(ERC20Abi, currency[0]);

          const currencyData = await mc.aggregate([
            currencyContract.methods.allowance(account, urlAddress),
            currencyContract.methods.balanceOf(account),
          ]);

          setStats({
            allowance: currencyData[0],
            balance: currencyData[1] / Math.pow(10, 18),
            contributionOf: data[1] / Math.pow(10, 18),
            userAvalibleClaim: data[2] / Math.pow(10, tokenDecimals),
          });
        } else {
          setStats({
            allowance: 0,
            balance: data[0] / Math.pow(10, 18),
            contributionOf: data[1] / Math.pow(10, 18),
            userAvalibleClaim: data[2] / Math.pow(10, tokenDecimals),
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/sale-list");
      }
    };

    if (mc && account) {
      fetch();
    } else {
      setStats({
        balance: 0,
        contributionOf: 0,
        userAvalibleClaim: "",
      });
    }
    // eslint-disable-next-line
  }, [account, updater, chainId]);

  return stats;
};

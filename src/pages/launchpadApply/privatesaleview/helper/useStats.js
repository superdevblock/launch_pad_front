import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import presalePoolAbi from "../../../../json/presalePool.json";
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
  const location = useLocation();

  let urlAddress = location.pathname.split("/").pop();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainId");

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
    hardCap: 0,
    softCap: 0,
    maxContribution: 0,
    poolDetails: 0,
    poolState: 0,
    rate: 0,
    remainingContribution: 0,
    tgeDate: 0,
    tgeBps: 0,
    cycleBps: 0,
    token: 0,
    totalClaimed: 0,
    totalRaised: 0,
    totalVestedTokens: 0,
    useWhitelisting: 0,
    minContribution: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: "",
    percentageRaise: 0,
    tokenSupply: 0,
    refundType: 0,
    cycle: 0,
    poolAddress: "",
    governance: 0,
    kyc: 0,
    audit: 0,
    auditStatus: 0,
    kycStatus: 0,
    currencyAddress: "0x0000000000000000000000000000000000000000",
    currencySymbol: supportNetwork[queryChainId ? queryChainId : chainId]
      ? supportNetwork[queryChainId ? queryChainId : chainId].symbol
      : supportNetwork["default"].symbol,
  });

  const mc = MulticallContractWeb3(queryChainId ? queryChainId : chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          poolContract.methods.endTime(), //0
          poolContract.methods.startTime(), //1
          poolContract.methods.hardCap(), //2
          poolContract.methods.softCap(), //3
          poolContract.methods.maxContribution(), //4
          poolContract.methods.poolDetails(), //5
          poolContract.methods.poolState(), //6
          poolContract.methods.rate(), //7,
          poolContract.methods.remainingContribution(), //8
          poolContract.methods.tgeDate(), //9
          poolContract.methods.tgeBps(), //10
          poolContract.methods.cycle(), //11
          poolContract.methods.cycleBps(), //12
          poolContract.methods.token(), //13
          poolContract.methods.totalClaimed(), //14
          poolContract.methods.totalRaised(), //15
          poolContract.methods.useWhitelisting(), //16
          poolContract.methods.minContribution(), //17
          poolContract.methods.refundType(), //18
          poolContract.methods.governance(), //19
          poolContract.methods.kyc(), //20
          poolContract.methods.audit(), //21
          poolContract.methods.auditStatus(), //22
          poolContract.methods.kycStatus(), //23
          poolContract.methods.currency(), //24
        ]);

        let tokenContract = new web3.eth.Contract(tokenAbi, data[13]);

        const tokendata = await mc.aggregate([
          tokenContract.methods.name(),
          tokenContract.methods.decimals(),
          tokenContract.methods.symbol(),
          tokenContract.methods.totalSupply(),
        ]);

        setStats({
          endTime: data[0],
          startTime: data[1],
          hardCap: data[2] / Math.pow(10, 18),
          softCap: data[3] / Math.pow(10, 18),
          maxContribution: data[4] / Math.pow(10, 18),
          poolDetails: data[5],
          poolState: data[6],
          rate: data[7] / Math.pow(10, tokendata[1]),
          remainingContribution: data[8] / Math.pow(10, 18),
          tgeDate: data[9],
          tgeBps: data[10],
          cycleBps: data[12],
          token: data[13],
          totalClaimed: data[14],
          totalRaised: data[15] / Math.pow(10, 18),
          useWhitelisting: data[16],
          minContribution: data[17] / Math.pow(10, 18),
          tokenName: tokendata[0],
          tokenDecimal: tokendata[1],
          tokenSymbol: tokendata[2],
          percentageRaise:
            (data[15] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) * 100,
          tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
          refundType: data[18],
          cycle: data[11],
          poolAddress: urlAddress,
          governance: data[19],
          kyc: data[20],
          audit: data[21],
          auditStatus: data[22],
          kycStatus: data[23],
          currencyAddress: data[24],
          currencySymbol: currencyList[data[24].toLowerCase()],
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
        hardCap: 0,
        softCap: 0,
        maxContribution: 0,
        poolDetails: 0,
        poolState: 0,
        rate: 0,
        remainingContribution: 0,
        tgeDate: 0,
        tgeBps: 0,
        cycleBps: 0,
        token: 0,
        totalClaimed: 0,
        totalRaised: 0,
        totalVestedTokens: 0,
        useWhitelisting: 0,
        minContribution: 0,
        tokenName: "",
        tokenDecimal: 0,
        tokenSymbol: "",
        percentageRaise: 0,
        tokenSupply: 0,
        refundType: 0,
        cycle: 0,
        poolAddress: "",
        governance: 0,
        kyc: 0,
        audit: 0,
        auditStatus: 0,
        kycStatus: 0,
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
  const queryChainId = new URLSearchParams(search).get("chainId");

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
    userAvalibleClaim: 0,
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
        // history.push('/sale-list');
      }
    };

    if (mc && account) {
      fetch();
    } else {
      setStats({
        balance: 0,
        contributionOf: 0,
        userAvalibleClaim: 0,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, chainId]);

  return stats;
};

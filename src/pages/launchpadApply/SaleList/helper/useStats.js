import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import poolManagerAbi from "../../../../json/poolManager.json";
import { MulticallContractWeb3 } from "../../../../hooks/useContracts";
import { getWeb3 } from "../../../../hooks/connectors";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { contract } from "../../../../hooks/constant";
import { supportNetwork } from "../../../../hooks/network";
import presalePoolAbi from "../../../../json/presalePool.json";
import { currencies } from "../../../../hooks/currencies";

export const usePoolListStats = (updater) => {
  let { page, pageSize, loading } = updater;
  const context = useWeb3React();
  const { chainId, account } = context;
  let history = useHistory();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  let web3 = getWeb3(queryChainId ? queryChainId : chainId);
  let poolManagerAddress = contract[queryChainId ? queryChainId : chainId]
    ? contract[queryChainId ? queryChainId : chainId].poolmanager
    : contract["default"].poolmanager;
  let poolManagerContract = new web3.eth.Contract(
    poolManagerAbi,
    poolManagerAddress
  );

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

  const [stats, setStats] = useState({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: supportNetwork[queryChainId ? queryChainId : chainId]
      ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
      : supportNetwork["default"].chainId,
  });

  const mc = MulticallContractWeb3(queryChainId ? queryChainId : chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          poolManagerContract.methods.getTotalNumberOfPools(),
        ]);

        if (data[0] > 0) {
          let start = data[0] - 1 - page * pageSize - (pageSize - 1);
          let end = start + pageSize - 1;

          const poolData = await mc.aggregate([
            poolManagerContract.methods.getCumulativePoolInfo(
              start >= 0 ? start : 0,
              end < data[0] ? end : data[0]
            ),
          ]);

          Promise.all(
            poolData[0].map(async (value) => {
              return {
                decimals: value.decimals,
                name: value.name,
                symbol: value.symbol,
                poolAddress: value.poolAddress,
                currencyAddress: value.currency,
                currencySymbol: currencyList[value.currency.toLowerCase()],
                endTime: value.endTime,
                hardCap: value.hardCap / Math.pow(10, 18),
                liquidityListingRate:
                  value.liquidityListingRate / Math.pow(10, value.decimals),
                liquidityPercent: value.liquidityPercent,
                maxContribution: value.maxContribution / Math.pow(10, 18),
                minContribution: value.minContribution / Math.pow(10, 18),
                poolState: value.poolState,
                poolDetails: value.poolDetails,
                poolType: value.poolType,
                rate: value.rate / Math.pow(10, value.decimals),
                softCap: value.softCap / Math.pow(10, 18),
                startTime: value.startTime,
                token: value.token,
                totalRaised: value.totalRaised / Math.pow(10, 18),
                percentageRaise:
                  (value.totalRaised /
                    Math.pow(10, 18) /
                    (value.poolType === "2"
                      ? value.softCap / Math.pow(10, 18)
                      : value.hardCap / Math.pow(10, 18))) *
                  100,
                logourl: value.poolDetails.toString().split("$#$")[0],
                bannerurl: value.poolDetails.toString().split("$#$")[1],
              };
            })
          ).then((result) => {
            setStats({
              getTotalNumberOfPools: data[0] - 1,
              poolList: result,
              page: page,
              pageSize: pageSize,
              loading: !loading,
              chainId: supportNetwork[queryChainId ? queryChainId : chainId]
                ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
                : supportNetwork["default"].chainId,
            });
          });
        } else {
          setStats({
            getTotalNumberOfPools: 0,
            page: page,
            pageSize: pageSize,
            poolList: [],
            loading: false,
            chainId: supportNetwork[queryChainId ? queryChainId : chainId]
              ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
              : supportNetwork["default"].chainId,
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/");
      }
    };

    if (mc) {
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: supportNetwork[queryChainId ? queryChainId : chainId]
          ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
          : supportNetwork["default"].chainId,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, chainId]);

  return stats;
};

export const usePoolListUser = (updater) => {
  let { page, pageSize, loading } = updater;
  const context = useWeb3React();
  const { chainId, account } = context;
  let history = useHistory();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  let web3 = getWeb3(queryChainId ? queryChainId : chainId);
  let poolManagerAddress = contract[queryChainId ? queryChainId : chainId]
    ? contract[queryChainId ? queryChainId : chainId].poolmanager
    : contract["default"].poolmanager;
  let poolManagerContract = new web3.eth.Contract(
    poolManagerAbi,
    poolManagerAddress
  );

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

  const [stats, setStats] = useState({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: supportNetwork[queryChainId ? queryChainId : chainId]
      ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
      : supportNetwork["default"].chainId,
  });

  const mc = MulticallContractWeb3(queryChainId ? queryChainId : chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          poolManagerContract.methods.getTotalNumberOfContributedPools(account),
        ]);

        if (data[0] > 0) {
          let start = data[0] - 1 - page * pageSize - (pageSize - 1);
          let end = start + pageSize - 1;

          const poolData = await mc.aggregate([
            poolManagerContract.methods.getUserContributedPoolInfo(
              account,
              start >= 0 ? start : 0,
              end < data[0] ? end : data[0]
            ),
          ]);

          Promise.all(
            poolData[0].map(async (value, index) => {
              return {
                decimals: value.decimals,
                name: value.name,
                symbol: value.symbol,
                poolAddress: value.poolAddress,
                currencyAddress: value.currency,
                currencySymbol: currencyList[value.currency.toLowerCase()],
                endTime: value.endTime,
                hardCap: value.hardCap / Math.pow(10, 18),
                liquidityListingRate:
                  value.liquidityListingRate / Math.pow(10, value.decimals),
                liquidityPercent: value.liquidityPercent,
                maxContribution: value.maxContribution / Math.pow(10, 18),
                minContribution: value.minContribution / Math.pow(10, 18),
                poolState: value.poolState,
                poolType: value.poolType,
                rate: value.rate / Math.pow(10, value.decimals),
                softCap: value.softCap / Math.pow(10, 18),
                startTime: value.startTime,
                token: value.token,
                totalRaised: value.totalRaised / Math.pow(10, 18),
                percentageRaise:
                  (value.totalRaised /
                    Math.pow(10, 18) /
                    (value.poolType === "2"
                      ? value.softCap / Math.pow(10, 18)
                      : value.hardCap / Math.pow(10, 18))) *
                  100,
                bannerurl: value.poolDetails.toString().split("$#$")[1],
              };
            })
          ).then((result) => {
            setStats({
              getTotalNumberOfPools: data[0] - 1,
              poolList: result,
              page: page,
              pageSize: pageSize,
              loading: !loading,
              chainId: queryChainId ? queryChainId : chainId,
            });
          });
        } else {
          setStats({
            getTotalNumberOfPools: 0,
            page: page,
            pageSize: pageSize,
            poolList: [],
            loading: false,
            chainId: supportNetwork[queryChainId ? queryChainId : chainId]
              ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
              : supportNetwork["default"].chainId,
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/");
      }
    };

    if (mc && account && chainId) {
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: supportNetwork[queryChainId ? queryChainId : chainId]
          ? supportNetwork[queryChainId ? queryChainId : chainId].chainId
          : supportNetwork["default"].chainId,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, chainId]);

  return stats;
};

export const useTopPoolState = (updater) => {
  const context = useWeb3React();
  const { chainId } = context;

  let web3 = getWeb3(chainId);
  let poolManagerAddress = contract[chainId]
    ? contract[chainId].poolmanager
    : contract["default"].poolmanager;
  let poolManagerContract = new web3.eth.Contract(
    poolManagerAbi,
    poolManagerAddress
  );

  const [stats, setStats] = useState({
    topPools: [],
    chainId: supportNetwork[chainId]
      ? supportNetwork[chainId].chainId
      : supportNetwork["default"].chainId,
  });

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

  const mc = MulticallContractWeb3(chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          poolManagerContract.methods.getTopPool(),
        ]);

        let res = [];

        for (let i = 0; i < data[0].length; i++) {
          if (
            data[0][i]["poolAddress"] !==
            "0x0000000000000000000000000000000000000000"
          ) {
            let poolContract = new web3.eth.Contract(
              presalePoolAbi,
              data[0][i]["poolAddress"]
            );
            const poolInfo = await mc.aggregate([
              poolContract.methods.getPoolInfo(),
            ]);
            res.push({
              poolAddress: data[0][i]["poolAddress"],
              poolInfo: poolInfo[0],
            });
          }
        }

        setStats({
          topPools: res,
          chainId: supportNetwork[chainId]
            ? supportNetwork[chainId].chainId
            : supportNetwork["default"].chainId,
        });
      } catch (err) {
        toast.error(err.reason);
      }
    };

    if (mc) {
      fetch();
    } else {
      setStats({
        topPools: [],
        chainId: supportNetwork[chainId]
          ? supportNetwork[chainId].chainId
          : supportNetwork["default"].chainId,
      });
    }
    // eslint-disable-next-line
  }, [updater, chainId]);

  return stats;
};

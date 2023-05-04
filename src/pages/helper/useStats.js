import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MulticallContractWeb3 } from "../../hooks/useContracts";
import { getWeb3 } from "../../hooks/connectors";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getChainId, getProjectOwner, getSubgraphUrl } from "../../hooks/network";
import erc20Abi from "../../json/ERC20.json";
import { currencies } from "../../hooks/currencies";
import { votes } from "../../hooks/votes";
import { getApolloClient } from "./helpers";
import { gql } from "@apollo/client";
import cloneDeep from 'lodash/cloneDeep';
import { ethers } from "ethers";

export const GETPOOLS_QUERY = gql`
  query getPools {
    pools(first: $first, skip: $skip) {
      poolAddress
      currencyAddress
      endTime
      hardCap
      liquidityListingRate
      liquidityPercent
      liquidityRaised
      maxContribution
      minContribution
      participants
      poolDetails
      poolState
      poolType
      rate
      softCap
      startTime
      token
      totalRaised
      totalValueRaised
      createdBy
    }
  }
`

export const CONTRIBUTE_QUERY = gql`
  query getContributes($first: Int!, $skip: Int!, $user: Bytes!) {
    contributes(first: $first, skip: $skip, where: {user: $user}) {
      poolAddress
      user
      currencyAmount
    }
  }
`

export const usePoolListStats = (updater) => {
  let { page, pageSize, loading } = updater;
  const context = useWeb3React();
  const { chainId, account } = context;
  let history = useHistory();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const _chainId_ = getChainId(queryChainId, chainId)

  const getCurrencyList = (currencies) => {
    let currencyList = [];
    currencies.map((currency, index) => {
      currencyList[currency.address] = currency.symbol;
    });
    return currencyList;
  };

  let currencyList = getCurrencyList(
    currencies[_chainId_] !== undefined
      ? currencies[_chainId_]
      : currencies["default"]
  );

  const [stats, setStats] = useState({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: _chainId_
  });

  const apolloClient = getApolloClient(getSubgraphUrl(_chainId_))

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await apolloClient.query({
            query: GETPOOLS_QUERY,
            variables: {
                first: pageSize,
                skip: page * pageSize
            }
        });
        let _pools = cloneDeep(response.data["pools"]);

        if (_pools.length > 0) {
          _pools = _pools.filter((item) => item.createdBy.toLowerCase() !== getProjectOwner(_chainId_).toLowerCase())
          Promise.all(
            _pools.map(async (value) => {
              return {
                decimals: 18,
                name: "",
                symbol: "",
                poolAddress: value.poolAddress,
                currencyAddress: value.currencyAddress,
                currencySymbol: currencyList[value.currencyAddress.toLowerCase()],
                endTime: value.endTime,
                hardCap: Number(ethers.utils.formatUnits(value.hardCap, 18)),
                liquidityListingRate: Number(ethers.utils.formatUnits(value.liquidityListingRate, value.decimals)),
                liquidityPercent: value.liquidityPercent,
                maxContribution: Number(ethers.utils.formatUnits(value.maxContribution, 18)),
                minContribution: Number(ethers.utils.formatUnits(value.minContribution, 18)),
                poolState: value.poolState,
                poolDetails: value.poolDetails,
                poolType: value.poolType,
                rate: value.rate,
                softCap: Number(ethers.utils.formatUnits(value.softCap, 18)),
                startTime: value.startTime,
                token: value.token,
                totalRaised: Number(ethers.utils.formatUnits(value.totalRaised, 18)),
                percentageRaise:
                  (value.totalRaised /
                    Math.pow(10, 18) /
                    (value.poolType === 2
                      ? Number(ethers.utils.formatUnits(value.softCap, 18))
                      : Number(ethers.utils.formatUnits(value.hardCap, 18)))) *
                  100,
                logourl: value.poolDetails.toString().split("$#$")[0],
                bannerurl: value.poolDetails.toString().split("$#$")[1],
              };
            })
          ).then((result) => {
            setStats({
              getTotalNumberOfPools: _pools.length - 1,
              poolList: result,
              page: page,
              pageSize: pageSize,
              loading: !loading,
              chainId: _chainId_,
            });
          });
        } else {
          setStats({
            getTotalNumberOfPools: 0,
            page: page,
            pageSize: pageSize,
            poolList: [],
            loading: false,
            chainId: _chainId_,
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/");
      }
    };

    if (apolloClient) {
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: _chainId_,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, _chainId_]);

  return stats;
};

export const usePoolListUser = (updater) => {
  let { page, pageSize, loading } = updater;
  const context = useWeb3React();
  const { chainId, account } = context;
  let history = useHistory();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");
  
  const _chainId_ = getChainId(queryChainId, chainId)

  const getCurrencyList = (currencies) => {
    let currencyList = [];
    currencies.map((currency, index) => {
      currencyList[currency.address] = currency.symbol;
    });
    return currencyList;
  };

  let currencyList = getCurrencyList(
    currencies[_chainId_] !== undefined
      ? currencies[_chainId_]
      : currencies["default"]
  );

  const [stats, setStats] = useState({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: _chainId_,
  });

  const apolloClient = getApolloClient(getSubgraphUrl(_chainId_))
  useEffect(() => {
    const fetch = async () => {
      try {        
        const response = await apolloClient.query({
          query: CONTRIBUTE_QUERY,
          variables: {
              first: pageSize,
              skip: page * pageSize,
              user: account.toLowerCase()
          }
        });
        let _contributes = cloneDeep(response.data["contributes"]);

        if(_contributes.length > 0) {
          _contributes = _contributes.map((item) => item.poolAddress.toLowerCase())
          const response1 = await apolloClient.query({
              query: GETPOOLS_QUERY,
              variables: {
                  first: pageSize,
                  skip: page * pageSize
              }
          });
          let _pools = cloneDeep(response1.data["pools"]);
  
          if (_pools.length > 0) {
            _pools = _pools.filter((item) => item.createdBy.toLowerCase() !== getProjectOwner(_chainId_).toLowerCase() && _contributes.includes(item.poolAddress.toLowerCase()))
            Promise.all(
              _pools.map(async (value) => {
                return {
                  decimals: 18,
                  name: "",
                  symbol: "",
                  poolAddress: value.poolAddress,
                  currencyAddress: value.currencyAddress,
                  currencySymbol: currencyList[value.currencyAddress.toLowerCase()],
                  endTime: value.endTime,
                  hardCap: Number(ethers.utils.formatUnits(value.hardCap, 18)),
                  liquidityListingRate: Number(ethers.utils.formatUnits(value.liquidityListingRate, value.decimals)),
                  liquidityPercent: value.liquidityPercent,
                  maxContribution: Number(ethers.utils.formatUnits(value.maxContribution, 18)),
                  minContribution: Number(ethers.utils.formatUnits(value.minContribution, 18)),
                  poolState: value.poolState,
                  poolDetails: value.poolDetails,
                  poolType: value.poolType,
                  rate: value.rate,
                  softCap: Number(ethers.utils.formatUnits(value.softCap, 18)),
                  startTime: value.startTime,
                  token: value.token,
                  totalRaised: Number(ethers.utils.formatUnits(value.totalRaised, 18)),
                  percentageRaise:
                    (value.totalRaised /
                      Math.pow(10, 18) /
                      (value.poolType === 2
                        ? Number(ethers.utils.formatUnits(value.softCap, 18))
                        : Number(ethers.utils.formatUnits(value.hardCap, 18)))) *
                    100,
                  logourl: value.poolDetails.toString().split("$#$")[0],
                  bannerurl: value.poolDetails.toString().split("$#$")[1],
                };
              })
            ).then((result) => {
              setStats({
                getTotalNumberOfPools: _pools.length - 1,
                poolList: result,
                page: page,
                pageSize: pageSize,
                loading: !loading,
                chainId: _chainId_,
              });
            });
          } 
        } else {
          setStats({
            getTotalNumberOfPools: 0,
            page: page,
            pageSize: pageSize,
            poolList: [],
            loading: false,
            chainId: _chainId_,
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/");
      }
    };

    if (apolloClient && account) {
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: _chainId_,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, _chainId_]);

  return stats;
};

export const useTokenInfo = (tokenAddress, chainId) => {
  let web3 = getWeb3(chainId);
  let tokenContract = new web3.eth.Contract(
    erc20Abi,
    tokenAddress
  );
  const [stats, setStats] = useState({
    name: "",
    symbol: "",
    decimals: 0,
  });

  const mc = MulticallContractWeb3(chainId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await mc.aggregate([
          tokenContract.methods.name(),
          tokenContract.methods.symbol(),
          tokenContract.methods.decimals(),
        ]);

        if (data) {
          setStats({
            name: data[0],
            symbol: data[1],
            decimals: data[2],
          })
        } else {
          setStats({
            name: "",
            symbol: "",
            decimals: 0,
          });
        }
      } catch (err) {
        toast.error(err.reason);
      }
    };

    
    if (mc && tokenAddress && chainId) {
      fetch();
    } else {
      setStats({
        name: "",
        symbol: "",
        decimals: 0,
      });
    }
    // eslint-disable-next-line
  }, [tokenAddress, chainId]);

  return stats;
};

export const usePoolListOwner = (updater) => {
  let { page, pageSize, loading } = updater;
  const context = useWeb3React();
  const { chainId, account } = context;
  let history = useHistory();
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const _chainId_ = getChainId(queryChainId, chainId)

  const getCurrencyList = (currencies) => {
    let currencyList = [];
    currencies.map((currency, index) => {
      currencyList[currency.address] = currency.symbol;
    });
    return currencyList;
  };

  let currencyList = getCurrencyList(
    currencies[_chainId_] !== undefined
      ? currencies[_chainId_]
      : currencies["default"]
  );

  const [stats, setStats] = useState({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: _chainId_,
  });

  const apolloClient = getApolloClient(getSubgraphUrl(_chainId_))
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await apolloClient.query({
            query: GETPOOLS_QUERY,
            variables: {
                first: pageSize,
                skip: page * pageSize
            }
        });
        let _pools = cloneDeep(response.data["pools"]);

        if (_pools.length > 0) {
          _pools = _pools.filter((item) => item.createdBy.toLowerCase() === getProjectOwner(_chainId_).toLowerCase())
          Promise.all(
            _pools.map(async (value) => {
              return {
                decimals: 18,
                name: "",
                symbol: "",
                poolAddress: value.poolAddress,
                currencyAddress: value.currencyAddress,
                currencySymbol: currencyList[value.currencyAddress.toLowerCase()],
                endTime: value.endTime,
                hardCap: Number(ethers.utils.formatUnits(value.hardCap, 18)),
                liquidityListingRate: Number(ethers.utils.formatUnits(value.liquidityListingRate, value.decimals)),
                liquidityPercent: value.liquidityPercent,
                maxContribution: Number(ethers.utils.formatUnits(value.maxContribution, 18)),
                minContribution: Number(ethers.utils.formatUnits(value.minContribution, 18)),
                poolState: value.poolState,
                poolDetails: value.poolDetails,
                poolType: value.poolType,
                rate: value.rate,
                softCap: Number(ethers.utils.formatUnits(value.softCap, 18)),
                startTime: value.startTime,
                token: value.token,
                totalRaised: Number(ethers.utils.formatUnits(value.totalRaised, 18)),
                percentageRaise:
                  (value.totalRaised /
                    Math.pow(10, 18) /
                    (value.poolType === 2
                      ? Number(ethers.utils.formatUnits(value.softCap, 18))
                      : Number(ethers.utils.formatUnits(value.hardCap, 18)))) *
                  100,
                logourl: value.poolDetails.toString().split("$#$")[0],
                bannerurl: value.poolDetails.toString().split("$#$")[1],
              };
            })
          ).then((result) => {
            setStats({
              getTotalNumberOfPools: _pools.length - 1,
              poolList: result,
              page: page,
              pageSize: pageSize,
              loading: !loading,
              chainId: _chainId_,
            });
          });
        } else {
          setStats({
            getTotalNumberOfPools: 0,
            page: page,
            pageSize: pageSize,
            poolList: [],
            loading: false,
            chainId: _chainId_,
          });
        }
      } catch (err) {
        toast.error(err.reason);
        history.push("/");
      }
    };

    if (apolloClient) {
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: _chainId_,
      });
    }
    // eslint-disable-next-line
  }, [account, updater, _chainId_]);

  return stats;
};

export const useVotes = () => {
  const [result, setResult] = useState([])
  useEffect(() => {
    const fetchVotes = async () => {
        setResult(votes)
    }
    fetchVotes()
  }, [])
  return result
}
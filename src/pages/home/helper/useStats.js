import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { getApolloClient } from "../../helper/helpers";
import { gql } from "@apollo/client";
import cloneDeep from 'lodash/cloneDeep';
import { ethers } from "ethers";
import { useLocation } from "react-router";
import { getChainId, getSubgraphUrl } from "../../../hooks/network";
import { async } from "q";
import { getContract } from "../../../hooks/contractHelper";
import { getWeb3 } from "../../../hooks/connectors";
import feedAbi from "../../../json/PriceFeed.json"
import { contract } from "../../../hooks/constant";

export const GETPOOLS_QUERY = gql`
  query getPools {
    pools {
      totalValueRaised
      participants
      liquidityRaised
    }
  }
`

export const usePadStatus = (updater) => {
  const context = useWeb3React();
  const { chainId } = context;

  const [stats, setStats] = useState({
    totalLiquidityRaised: 0,
    totalProjects: 0,
    totalParticipants: 0,
    totalValueLocked: 0,
  });

  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");
  const _chainId_ = getChainId(queryChainId, chainId)

  const apolloClient = getApolloClient(getSubgraphUrl(_chainId_))

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await apolloClient.query({
            query: GETPOOLS_QUERY,
            variables: {
            }
        });
        let _pools = cloneDeep(response.data["pools"]);
        if(_pools.length > 0) {
          let _totalLiquidityRaised = 0;
          let _totalProjects = _pools.length;
          let _totalParticipants = 0;
          let _totalValueLocked = 0;
          for(let i = 0; i < _pools.length; i++) {
            _totalLiquidityRaised = _totalLiquidityRaised + Number(ethers.utils.formatEther(_pools[i].liquidityRaised))
            _totalParticipants = _totalParticipants + Number(_pools[i].participants)
            _totalValueLocked = _totalValueLocked + Number(ethers.utils.formatEther(_pools[i].totalValueRaised))
          }
          setStats({
            totalLiquidityRaised: _totalLiquidityRaised,
            totalProjects: _totalProjects,
            totalParticipants: _totalParticipants,
            totalValueLocked: _totalValueLocked,
          });
        } else {
          setStats({
            totalLiquidityRaised: 0,
            totalProjects: 0,
            totalParticipants: 0,
            totalValueLocked: 0,
          });
        }
      } catch (err) {
        toast.error(err.reason);
      }
    };

    if (apolloClient) {
      fetch();
    } else {
      setStats({
        totalLiquidityRaised: 0,
        totalProjects: 0,
        totalParticipants: 0,
        totalValueLocked: 0,
      });
    }
    // eslint-disable-next-line
  }, [updater, _chainId_]);

  return stats;
};

export const useEthPrice = () => {
  const context = useWeb3React();
  const { chainId } = context;
  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");
  const _chainId_ = getChainId(queryChainId, chainId)
  
  const [ethPrice, setEthPrice] = useState(0)
  const web3 = getWeb3(_chainId_)

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const feedContract = new web3.eth.Contract(feedAbi, contract[_chainId_]["priceFeed"])
        let _price = await feedContract.methods.latestAnswer().call()
        const _decimal = await feedContract.methods.decimals().call()
        _price = ethers.utils.formatUnits(_price, _decimal)
        setEthPrice(_price)
      } catch (error) {
        console.error(error)
      }
    }
    fetchEthPrice()
  }, [])
  return ethPrice

}
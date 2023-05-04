import { useState, useEffect } from "react"
import { getWeb3 } from "../../../hooks/connectors"
import { useWeb3React } from "@web3-react/core";
import erc20Abi from "../../../json/ERC20.json"
import { useLocation } from "react-router";
import { getChainId, getElevTokenAddress } from "../../../hooks/network";

export const useVotingPower = () => {
    const [votingPower, setVotingPower] = useState(0)
    const {account, chainId} = useWeb3React()

    const search = useLocation().search;
    const queryChainId = new URLSearchParams(search).get("chainid");

    const _chainId_ = getChainId(queryChainId, chainId)
    const web3 = getWeb3(_chainId_)

    useEffect(() => {
        const fetchVotingPower = async (account) => {
            try {
                const contract = new web3.eth.Contract(erc20Abi, getElevTokenAddress(_chainId_))
                const result = await contract.methods.balanceOf(account).call()
                setVotingPower(result / Math.pow(10, 18))
            } catch (error) {
                console.error(error)
            }
        }
        if(account) {
            fetchVotingPower(account)
        }
    }, [_chainId_, account, web3.eth.Contract])

    return votingPower
}
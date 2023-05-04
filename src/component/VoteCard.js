import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { getChainId, getSnapshotHttpUrl, getSpaceId } from "../hooks/network";
import { AiFillTwitterCircle } from "react-icons/ai";
import {
  RiTelegramFill,
  RiDiscordFill,
  RiFacebookCircleFill,
  RiGithubFill,
  RiInstagramFill,
  RiRedditFill,
} from "react-icons/ri";
import logo from "../images/logo2.png"
import ethereum from "../images/ethereum2.png"
import { PROPOSALS_QUERY } from "../pages/Dao/ProposalDetails";
import { getApolloClient } from "../pages/helper/helpers";
import { cloneDeep } from "@apollo/client/utilities";
import { useWeb3React } from "@web3-react/core";

const VoteCard = ({vote}) => {
  const [status, setStatus] = useState("Active")
  const [endTime, setEndTime] = useState(1683646254000)
  const [yes, setYes] = useState(0)
  const [no, setNo] = useState(0)
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const {chainId} = useWeb3React()

  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const _chainId_ = getChainId(queryChainId, chainId)

  const [proposal, setProposal] = useState() 

  useEffect(() => {
    async function fetchProposals(stateFilter = "all", skip = 0, loadBy = 1000, space = getSpaceId(_chainId_)) {
        const subSpaces = []
        try {
            const apolloClient = getApolloClient(getSnapshotHttpUrl(_chainId_))
            const response = await apolloClient.query({
                query: PROPOSALS_QUERY,
                variables: {
                    id: vote.proposalId,
                    first: loadBy,
                    skip: skip,
                    space_in: [space, ...subSpaces],
                    state: stateFilter === 'core' ? 'all' : stateFilter,
                }
            });
            
            const _proposals = cloneDeep(response.data["proposals"]);
            console.log("call _proposals effect: ", _proposals)   
            const _proposal = _proposals.length > 0? _proposals[0] : {}
            setProposal(_proposal);

            if(_proposal && _proposal.scores.length > 0) {
              setYes(_proposal.scores[0])
              setNo(_proposal.scores[1])
            }
        } catch (error) {
            console.error(error)
        }
    }        
    fetchProposals()
  }, [_chainId_, vote.proposalId])


  useEffect(() => {
    let timeRemaining = endTime - new Date().getTime()
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
  }, [endTime]);

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

  return (
    <div
      className="col-12 col-md-6 col-lg-4 item explore-item mb-4"
    >
      <div className="card project-card">
        <div className="card-header py-4 px-2 flex-column">
          <div className="d-flex justify-content-between">
            <div className="project-logo mr-3">
              <img src={vote.logoUrl? vote.logoUrl : logo} width="50px" alt="logo"/>
            </div>
            
            <div className="d-flex align-items-center gap-4">
              <img src={ethereum} width="20px" alt="logo"/>
              <div className="d-flex flex-column justify-content-center ml-2" style={{width: "165px"}}>
                <h4 className="m-state-text mb-1">{status}</h4>
                <div className="d-flex">
                  <span className="m-time-count">{days}D : {hours}H : {minutes}MIN : {seconds}SEC</span>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              <h4 className="mx-0 mt-2 mb-0">
                {vote.name ? vote.name : ""}
              </h4>
              <h6 className="color-primary m-0">{vote.symbol}</h6>
            </div>
            <div className="social-icons">
              {vote.social.twitter && (
                <a target="_blank" rel="noreferrer" href={vote.social.twitter}>
                  <AiFillTwitterCircle />
                </a>
              )}
              {vote.social.facebook && (
                <a target="_blank" rel="noreferrer" href={vote.social.facebook}>
                  <RiFacebookCircleFill />
                </a>
              )}
              {vote.social.instagram && (
                <a target="_blank" rel="noreferrer" href={vote.social.instagram}>
                  <RiInstagramFill />
                </a>
              )}
              {vote.social.reddit && (
                <a target="_blank" rel="noreferrer" href={vote.social.reddit}>
                  <RiRedditFill />
                </a>
              )}
              {vote.social.telegram && (
                <a target="_blank" rel="noreferrer" href={vote.social.telegram}>
                  <RiTelegramFill />
                </a>
              )}
              {vote.social.discord && (
                <a target="_blank" rel="noreferrer" href={vote.social.discord}>
                  <RiDiscordFill />
                </a>
              )}
              {vote.social.github && (
                <a target="_blank" rel="noreferrer" href={vote.social.github}>
                  <RiGithubFill />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="m-timecount-container">            
            <div className="d-flex justify-content-between mt-1 mr-3">
              <span>
                Yes: &nbsp;
                <span className="color-primary">{yes}</span>
              </span>
              <span>
                No: &nbsp;
                <span className="color-primary">{no}</span>
              </span>
            </div>
            <div className="progress mt-md-1 ">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${yes + no <= 0? "50" : parseFloat(yes / (yes + no)).toFixed(2)}%`,
                }}
                aria-valuenow={yes + no <= 0? "50" : parseFloat(yes / (yes + no)).toFixed(2)}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            {/* <div className="d-flex justify-content-between mt-1">
              <span>{parseFloat(vote.percentageRaise).toFixed(2)}%</span>
              <span>
                {(vote.poolType === "0" || vote.poolType === "1") && (
                  <>
                    1 {vote.currencySymbol} = {formatPrice(vote.rate)}{" "}
                    {vote.symbol}
                  </>
                )}
              </span>
            </div> */}
          </div>


          <div className="d-flex justify-content-between align-items-center w-100 mt-3">
            <div className="m-project-container">
              <p>Softcap</p>
              <p className="m-value">
                {vote.softcap} {vote.currency}
              </p>
            </div>
            <div className="m-project-container">
              <p>Swap Rate</p>
              <p className="m-value">
              1ETH = &nbsp;{vote.swapRate}&nbsp;{vote.symbol}
              </p>
            </div>
            <div className="m-project-container">
              <p>Hardcap</p>
              <p className="m-value">
                {vote.hardcap} {vote.currency}
              </p>
            </div>
          </div>

          <div className="m-timecount-container mt-3">          
            <div>
              <Link
                to={`/dao/proposal/${vote.proposalId}`}
                className="btn btn-smaller w-100"
              >
                Vote Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;

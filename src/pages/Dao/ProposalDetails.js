import React, {useEffect, useState} from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaLink, FaMinus, FaPlus } from 'react-icons/fa';
import { VotingTypes2String, getApolloClient } from "../helper/helpers";
import { trimAddress } from "../../hooks/constant";
import { useRouter } from "../../component/Sidebar";
import { gql } from "@apollo/client";
import cloneDeep from 'lodash/cloneDeep';
import { send } from "./hooks/callSnapshot";
import { useVotingPower } from "./hooks/useVotingPower";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { getChainId, getElevTokenAddress, getScanUrl, getSnapshotIpfsUrl, getSnapshotHttpUrl, getSpaceId } from "../../hooks/network";

export const PROPOSALS_QUERY = gql`
  query Proposals(
    $id: String!
    $first: Int!
    $skip: Int!
    $state: String!
    $space: String
    $space_in: [String]
  ) {
    proposals(
      first: $first
      skip: $skip
      where: {
        id: $id
        space: $space
        state: $state
        space_in: $space_in
      }
    ) {
      id
      ipfs
      title
      body
      start
      end
      state
      author
      created
      choices
      space {
        id
        name
        members
        avatar
        symbol
      }
      scores_state
      scores_total
      scores
      votes
      quorum
      symbol
      type
      snapshot
    }
  }
`;

export default function ProposalDetails() {
  const router = useRouter()
  const [proposal, setProposal] = useState()  
  const history = useHistory();
  const votingPower = useVotingPower()
  const {library, account} = useWeb3React()
  const [reload, setReload] = useState(false)

  const {chainId} = useWeb3React()

  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const _chainId_ = getChainId(queryChainId, chainId)

  const [reason, setReason] = useState("")

  const handleBack = () => {
    history.goBack();
  };
  
  useEffect(() => {
    async function fetchProposals(stateFilter = "all", skip = 0, loadBy = 1000, space = getSpaceId(_chainId_)) {
        const subSpaces = []
        try {
          const apolloClient = getApolloClient(getSnapshotHttpUrl(_chainId_))
            const response = await apolloClient.query({
                query: PROPOSALS_QUERY,
                variables: {
                    id: router.query.proposalId,
                    first: loadBy,
                    skip: skip,
                    space_in: [space, ...subSpaces],
                    state: stateFilter === 'core' ? 'all' : stateFilter,
                }
            });
            
            const _proposals = cloneDeep(response.data["proposals"]);
            console.log("call _proposals effect: 1", _proposals)   
            if(_proposals.length > 0) {
              const _proposal = _proposals.length > 0? _proposals[0] : {}
              setProposal(_proposal);
              console.log("call _proposals effect: 2")   
  
              let _checks = []
              let _weighted = []
              let _percentage = []
              let _ranked = []
              for(let i = 0; i < _proposal.choices.length; i++) {
                _checks.push(false)
                _weighted.push(0)
                _percentage.push(0)
                _ranked.push(0)
              }
              setChecks(_checks)
              setWeighted(_weighted)
              setPercentage(_percentage)
              setRanked(_ranked)
            }
        } catch (error) {
            console.error(error)
        }
    }        
    // if()
    fetchProposals()
  }, [router.query.proposalId, reload, _chainId_])

  const [checks, setChecks] = useState([])
  const [weighted, setWeighted] = useState([])
  const [percentage, setPercentage] = useState([])
  const [ranked, setRanked] = useState([])

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if(!proposal) return
    let timeRemaining = proposal.end * 1000 - new Date().getTime()
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
  }, [proposal, proposal?.end]);

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

  async function vote(payload) {
    console.log("sniper: spaceid: ", getSpaceId(_chainId_))
    return send(getSpaceId(_chainId_), 'vote', payload, library, account, _chainId_);
  }

  async function handleVote() {
    if(votingPower <= 0) {
      toast.error("Insufficient Voting Power")
      return
    }
    let result = null
    console.log("sniper: proposal: ", proposal)
    if(proposal.type === "approval") {
      let _choices = []
      checks.map((item, index) => {
        if(item === true) {
          _choices.push(index + 1)
        }
        return 0
      })
      result = await vote({
        proposal: proposal,
        choice: _choices,
        reason: reason
      });  
    } else if(proposal.type === "single-choice") {
      result = await vote({
        proposal: proposal,
        choice: checks.indexOf(true) + 1,
        reason: reason
      });  
    } else if(proposal.type === "quadratic" || proposal.type === "weighted" ) {
      const _choices = {};

      weighted.forEach((value, index) => {
        _choices[index + 1] = value;
      });
      result = await vote({
        proposal: proposal,
        choice: _choices,
        reason: reason
      });  
    } else if(proposal.type === "ranked-choice") {
      result = await vote({
        proposal: proposal,
        choice: ranked,
        reason: reason
      });  
    }
    console.log('Result', result);

    if(result?.id) {
      toast.success("Successfully voted.")
      setReload(!reload)
    }
  }

  const handleCheck = (index) => {
    if(proposal.type === "approval") {
      let _checks = checks.slice()
      _checks[index] = !_checks[index]
      setChecks(_checks)
    } else {
      let _checks = []
      for(let i = 0; i < proposal.choices.length; i++) {
        _checks.push(false)
      }
      _checks[index] = true
      setChecks(_checks)
    }
  }

  const handlePlus = (index) => {
    let _weighted = weighted.slice()
    _weighted[index] = _weighted[index] + 1
    setWeighted(_weighted)
    calculatePercentage(_weighted)
  }

  const handleMinus = (index) => {
    let _weighted = weighted.slice()
    if(_weighted[index] > 0) {
      _weighted[index] = _weighted[index] - 1
      setWeighted(_weighted)
      calculatePercentage(_weighted)
    }
  }

  const handleChangeWeight = (e, index) => {
    let _weighted = weighted.slice()
    _weighted[index] = Number(e.target.value)
    setWeighted(_weighted)
    calculatePercentage(_weighted)
  }

  const calculatePercentage = (_weighted) => {
    const _totalWeight = _weighted.length > 0 ? _weighted.reduce((a, b) => a + b) : 0
    const _percentage = percentage.slice()
    for(let i = 0; i < percentage.length; i++) {
      _percentage[i] = Number((_weighted[i] / _totalWeight * 100).toFixed(2))
    }
    setPercentage(_percentage)
  }

  const handleRanked = (index) => {
    let _ranked = ranked.slice()
    const _max = _ranked.reduce((a, b) => Math.max(a, b));
    console.log(_max); // Output: 8

    if(ranked[index] === 0) {
      _ranked[index] = _max + 1
    }
    setRanked(_ranked)
  }

  const handleReset = () => {
    let _ranked = ranked.slice().map((item) => 0)
    setRanked(_ranked)
  }

  return (
    <React.Fragment>
      <section id="home" className="project-area pt-0">
        <div className="container d-flex flex-column align-items-center">
          <div className="w-100">
            <div className="m-outline d-flex align-items-center cursor-pointer" onClick={handleBack}><FaArrowLeft /> Back</div>
            {proposal && <div className="d-flex" style={{flexWrap: "wrap"}}>
              <div className="m-proposal-detail-left">
                <div className="card m-2">
                  <h3 className="color-primary mb-0">{proposal.title}</h3>
                  <div className="div-line mb-3"></div>
                  <div className="d-flex justify-content-between align-items-center mb-4" style={{flexWrap: "revert"}}>
                    <div className="d-flex align-items-center justify-content-center text-white mt-2">
                      <div className="">
                        <div className="flex flex-nowrap items-center space-x-1">
                          <span className="w-full cursor-pointer truncate text-skin-link">
                            {proposal.author && trimAddress(proposal.author)}
                          </span>
                        </div>
                      </div>
                      <span className="mx-2">|</span>
                      <p className={`m-proposal-state-container ${proposal.state === "active" ? "m-active-background" : "m-closed-background"}`}>{proposal.state}</p>
                    </div>
                    {proposal.state === "active" && <div className="d-flex justify-content-end ml-2">
                      <div className="d-flex flex-column">
                        <span className="m-time-count">End in</span>
                        <span className="m-time-count">{days}D : {hours}H : {minutes}MIN : {seconds}SEC</span>
                      </div>
                    </div>}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: proposal.body.replace(/\n/g, '<br>') }} />
                </div>
                <div className="card m-2">
                  <h4 className="color-primary mb-0">Cast your vote</h4>
                  <div className="div-line mb-3"></div>
                  {["single-choice", "basic", "approval"].includes(proposal.type) && <div className="d-flex flex-column mb-3">
                    {proposal.choices && proposal.choices.map((item, index) => {
                      return <div className="m-outline text-center w-100 cursor-pointer" key={index} onClick={() => handleCheck(index)}>
                        {checks[index] && <FaCheck style={{position: "absolute", left: "25px"}}/>}
                        {item}
                      </div>
                    })}
                  </div>}
                  {["ranked-choice"].includes(proposal.type) && <span className="m-reset-text cursor-pointer" onClick={handleReset}>Reset</span>}
                  {["ranked-choice"].includes(proposal.type) && <div className="d-flex flex-column mb-3">
                    {proposal.choices && proposal.choices.map((item, index) => {
                      return <div className="m-outline w-100 text-center cursor-pointer" key={index} onClick={() => handleRanked(index)}>
                        <div style={{position: "absolute", left: "25px"}}>{`${ranked[index] !== 0? `#${ranked[index]}` : ""}`}</div>
                        {item}
                      </div>
                    })}
                  </div>}
                  {["quadratic", "weighted"].includes(proposal.type) && <div className="d-flex flex-column mb-3">
                    {proposal.choices && proposal.choices.map((item, index) => {
                      return <div className="m-outline d-flex justify-content-between align-items-center w-100 py-0" key={index}>
                        <div className="text-center w-100">{item}</div>
                        <div className="d-flex align-items-center">
                          <FaMinus className="cursor-pointer" onClick={() => handleMinus(index)}/>
                          <input className="m-outline w-1 mx-2" style={{width: "80px"}} value={weighted[index]} onChange={(e) => handleChangeWeight(e, index)} />
                          <FaPlus className="cursor-pointer" onClick={() => handlePlus(index)}/>
                          <div className="text-right ml-2" style={{width: "60px"}}>{percentage[index]? percentage[index] : "0"}%</div>
                        </div>
                      </div>
                    })}
                  </div>}
                  <div className="w-100 text-right">{`Your Voting Power: ${Number(votingPower.toFixed(4))} $ELEV`}</div>
                  <div>
                    <textarea type="" className="w-100 p-3 m-outline" placeholder="Enter reason(Optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                  <button className="btn m-auto" onClick={handleVote}>Vote</button>
                </div>
              </div>
              <div className="m-proposal-detail-right mt-2">
                <div className="card">
                  <h4 className="color-primary mb-0">Information</h4>
                  <div className="div-line"></div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between">
                      <p>Strategie(s)</p>
                      <div className="d-flex justify-content-end flex-column text-right">
                        <p>erc20-balance-of</p>
                        <a href={`${getScanUrl(_chainId_)}/address/${getElevTokenAddress(_chainId_)}`} target="_blank" rel="noreferrer">{trimAddress(getElevTokenAddress(_chainId_))}<FaLink /></a>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>IPFS</p>
                      <a href={`${getSnapshotIpfsUrl(_chainId_)}/ipfs/${proposal.ipfs}`} target="_blank" rel="noreferrer">{trimAddress(proposal.ipfs)}<FaLink /></a>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Voting system</p>
                      <p>{VotingTypes2String[proposal.type]}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Start date</p>
                      <p>{new Date(proposal.start * 1000).toDateString()}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>End date</p>
                      <p>{new Date(proposal.end * 1000).toDateString()}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Snapshot</p>
                      <a href={`${getScanUrl(_chainId_)}/block/${proposal.snapshot}`} target="_blank" rel="noreferrer">{trimAddress(proposal.snapshot)}<FaLink /></a>
                    </div>
                  </div>
                </div>
                <div className="card mt-2">
                  <h4 className="color-primary mb-0">Result</h4>
                  <div className="div-line mb-3"></div>

                  {proposal && proposal.choices && proposal.choices.map((item, index) => {
                    return <div key={index}>
                      <p className="text-right">{proposal.scores.length > 0? proposal.scores[index] : 0}&nbsp;{proposal.symbol}</p>
                      <div className="progress mb-2 m-proposal-score" style={{height: "25px"}}>
                        <div 
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${parseFloat((proposal.scores_total > 0? proposal.scores[index] / proposal.scores_total : 0) * 100).toFixed(2)}%`,
                          }}
                          aria-valuenow={proposal.scores[index]}
                          aria-valuemin="0"
                          aria-valuemax={proposal.scores_total}
                        ></div>
                        <p style={{position: "absolute", left: "35px", color: "white"}}>{item}</p>
                        <p style={{position: "absolute", right: "35px", color: "white"}}>{((proposal.scores_total > 0? proposal.scores[index] / proposal.scores_total : 0) * 100).toFixed(4)}%</p>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

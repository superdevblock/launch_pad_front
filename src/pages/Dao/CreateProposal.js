import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { VotingString2Types } from '../helper/helpers';
import { send } from './hooks/callSnapshot';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import { getChainId, getSpaceId } from '../../hooks/network';

export default function CreateProposal() {
  const {library, account, chainId} = useWeb3React()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [choices, setChoices] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [votingType, setVotingType] = useState("Single choice voting")
  const history = useHistory()

  const search = useLocation().search;
  const queryChainId = new URLSearchParams(search).get("chainid");

  const _chainId_ = getChainId(queryChainId, chainId)

  const handleBack = () => {
    history.goBack();
  };

  const handleAddChoice = () => {
    const _choices = choices.slice()
    _choices.push("")
    setChoices(_choices)
  }

  const handleChoice = (value, index) => {
    const _choices = choices.slice()
    _choices[index] = value
    setChoices(_choices)
  }

  const handleVotingType = (e) => {
    setVotingType(e.target.value)
    
    if(e.target.value === "Approval voting") {
      const _choices = ['For', 'Against', 'Abstain']
      setChoices(_choices)
    }
  }

  const handleCreateProposal = async () => {
    const blockNumber = await library.getBlockNumber();
    const EMPTY_PROPOSAL = {
      name: title,
      body: description,
      discussion: '',
      choices: choices.filter((item) => item.toString().length > 0),
      start: new Date(startTime).getTime() / 1000,
      end: new Date(endTime).getTime() / 1000,
      snapshot: blockNumber - 4,
      metadata: {
        plugins: {}
      },
      type: VotingString2Types[votingType]
    };

    const result = await send(getSpaceId(_chainId_), "proposal", EMPTY_PROPOSAL, library, account, _chainId_)
    if(result.id) {
      toast.success("Successfully created your proposal.")
    }
  }

  return (    
    <React.Fragment>
      <section id="home" className="project-area pt-0">
        <div className="container d-flex flex-column align-items-center">
          <div className=''>
            <div className="m-outline d-flex align-items-center" onClick={handleBack}><FaArrowLeft /> Back</div>
            <div className="card stepcard w-100">
              <div className='d-flex flex-column mb-3'>
                <label>Title</label>
                <input className='m-outline w-100' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className='d-flex flex-column mb-3'>
                <label>Description</label>
                <textarea className='m-outline w-100' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className='d-flex flex-column mb-3'>
                <label>Type</label>
                <select className='m-outline cursor-pointer w-100' type="text" value={votingType} onChange={handleVotingType} >
                  <option>Single choice voting</option>
                  <option>Approval voting</option>
                  <option>Quadratic voting</option>
                  <option>Ranked choice voting</option>
                  <option>Weighted voting</option>
                  <option>Basic voting</option>
                </select>
              </div>
              <div className='d-flex flex-column mb-3'>
                <label>Choices</label>
                {choices && choices.length > 0 && choices.map((item, index) => {
                  return <div className='m-choice-input m-outline w-100' key={index}>
                    <FiMenu color='gray'/>
                    <p className='color-gray mx-1'>Choice&nbsp;{index+1}</p>
                    <input maxLength="32" disabled={votingType === "Basic voting"} className='m-outline w-100' type="text" value={choices[index]} onChange={(e) => handleChoice(e.target.value, index)} />
                    {index+1 === choices.length && votingType !== "Basic voting" && <FaPlus className='cursor-pointer ml-1' onClick={handleAddChoice}/>}
                  </div>
                })}
              </div>
              <div className='d-flex' style={{flexWrap: "wrap"}}>
                <div className='w-100'>
                  <label>Start</label>
                  <input className='m-outline w-100' type='datetime-local' value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
                </div>
                <div className='w-100'>
                  <label>End</label>
                  <input className='m-outline w-100' type='datetime-local' value={endTime} onChange={(e) => setEndTime(e.target.value)}></input>
                </div>
              </div>
              <button className='btn ml-auto mr-auto mt-3' onClick={handleCreateProposal} disabled={loading}>Create Proposal</button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
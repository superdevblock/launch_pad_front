import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { FaVoteYea } from 'react-icons/fa';
import { trimAddress } from "../../../hooks/constant";

export default function ProposalsItem({proposal, voted}) {
  
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
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
  }, [proposal.end]);

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
    <Link className="card mb-4" to={`/dao/proposal/${proposal.id}`}>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="">
            <h4 className="color-primary mt-0">{ proposal.title }
            {voted && <span style={{fontSize: "12px", color: "#ac7fff"}}>
              <FaVoteYea /> voted
            </span>}
            </h4>
          </div>
          <div>
            {proposal.state === "active" && <div className="d-flex justify-content-end mb-2">
              <span className="m-time-count">{days}D : {hours}H : {minutes}MIN : {seconds}SEC</span>
            </div>}
            <div className="d-flex align-items-center justify-content-center text-white">
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
          </div>
        </div>


        <p className="text-white">
          { proposal.body }
        </p>

        <div className="mt-3">
          {proposal && proposal.choices && proposal.choices.map((item, index) => {
            return <div className="progress mb-2 m-proposal-score" style={{height: "25px"}} key={index}>
              <div 
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${parseFloat((proposal.scores[index] / proposal.scores_total) * 100).toFixed(2)}%`,
                }}
                aria-valuenow={proposal.scores[index]}
                aria-valuemin="0"
                aria-valuemax={proposal.scores_total}
              ></div>
              <p style={{position: "absolute", left: "35px", color: "white"}}>{item}</p>
              <p style={{position: "absolute", right: "35px", color: "white"}}>{((proposal.scores.length > 0? proposal.scores[index] / proposal.scores_total : 0) * 100).toFixed(4)}%</p>
              
            </div>
          })}
        </div>
      </div>
    </Link>
  );
}

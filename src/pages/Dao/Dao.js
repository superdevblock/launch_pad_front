import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProposalsItem from "./components/ProposalsItem";
import { useWeb3React } from "@web3-react/core";
import { gql } from '@apollo/client';
import cloneDeep from 'lodash/cloneDeep';
import { getApolloClient } from "../helper/helpers";
import { getChainId, getSnapshotHttpUrl, getSpaceId } from "../../hooks/network";

export const PROPOSALS_QUERY = gql`
  query Proposals(
    $first: Int!
    $skip: Int!
    $state: String!
    $space: String
  ) {
    proposals(
      first: $first
      skip: $skip
      where: {
        space: $space
        state: $state
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
    }
  }
`;


export const USER_VOTED_PROPOSAL_IDS_QUERY = gql`
  query Votes($voter: String!, $proposals: [String]!) {
    votes(where: { voter: $voter, proposal_in: $proposals }) {
      proposal {
        id
      }
    }
  }
`;

export default function Dao() {
    const context = useWeb3React()

    const search = useLocation().search;
    const queryChainId = new URLSearchParams(search).get("chainid");
  
    const _chainId_ = getChainId(queryChainId, context.chainId)
  

    const [proposals, setProposals] = useState([])
    const [userVotedProposalIds, setUserVotedProposalIds] = useState([])

    useEffect(() => {
        async function fetchProposals(stateFilter = "all", skip = 0, loadBy = 1000, space = getSpaceId(_chainId_)) {

            try {
                const apolloClient = getApolloClient(getSnapshotHttpUrl(_chainId_))
                const response = await apolloClient.query({
                    query: PROPOSALS_QUERY,
                    variables: {
                        first: loadBy,
                        skip: skip,
                        space: space,
                        state: stateFilter === 'core' ? 'all' : stateFilter
                    }
                });
                
                const _proposals = cloneDeep(response.data["proposals"]);
                console.log("call _proposals effect: ", _proposals)   
                
                setProposals(_proposals);
            } catch (error) {
                console.error(error)
            }
        }        
        fetchProposals()
    }, [_chainId_])

    useEffect(() => {
        async function fetchUserVotedProposalIds(voter, proposals) {
            if (!voter || !proposals) return;
            try {
                const apolloClient = getApolloClient(getSnapshotHttpUrl(_chainId_))
                const response = await apolloClient.query({
                    query: USER_VOTED_PROPOSAL_IDS_QUERY,
                    variables: {
                      voter,
                      proposals
                    }
                  });
          
                const votes = cloneDeep(response.data["votes"]);
                const proposalId = votes?.map(vote => vote.proposal.id) ?? [];
                setUserVotedProposalIds(proposalId);
            } catch (error) {
                console.log(error);
            }
        }
        if(context && proposals) {
            const proposalsIds = proposals.map((item) => item.id)
            fetchUserVotedProposalIds(context.account, proposalsIds)
        }
    }, [context, context.account, proposals, _chainId_])

  return (
    <React.Fragment>
      <section id="home" className="project-area pt-0">
        <div className="container px-2 px-sm-5 py-5">


          <div className="intro-content text-center mb-5">
            <h1 className="text-white">Elevate <strong className="color-primary">DAO</strong></h1>
            <h5 className="text-white">$ELEV holders will have the power to vote on IDOs, make proposals, and dictate the use of the Elevate Treasury all through our DAPP.  As this global community grows, the range of voices will too, allowing for a truly decentralized ESG launchpad.</h5>
          </div>


          <div className="m-auto" style={{maxWidth: "700px"}}>
            <Link className="btn" to="/dao/create-proposal">
              Create Proposal
            </Link>
            <div className="mt-4">
              {proposals && proposals.length > 0 && proposals.map((item, index) => {
                  return <ProposalsItem proposal={item} voted={userVotedProposalIds.includes(item.id)} key={index} />
              })}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

import React, { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Link } from 'react-router-dom';
import { useVotes, usePoolListOwner } from "../helper/useStats";
import ProjectCard from "../../component/ProjectCard";
import VoteCard from "../../component/VoteCard";

export default function Pad() {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 30,
    loading: true,
  });
  const stats = usePoolListOwner(updater);

  const [pendingProjects, setPendingProjects] = useState([])
  const [openProjects, setOpenProjects] = useState([])
  const [liveProjects, setLiveProjects] = useState([])

  useEffect(() => {
    const filterPools = async (pools) => {
      const _opens = pools.filter((item) => 
        item.poolType === 0 && parseInt(item.startTime) <= Math.floor(new Date().getTime() / 1000.0))
      
      const _pendings = pools.filter((item) => 
        parseInt(item.startTime) > Math.floor(new Date().getTime() / 1000.0))
    
      const _lives = pools.filter((item) => 
        item.poolType === 2)
      
      setPendingProjects(_pendings)
      setOpenProjects(_opens)
      setLiveProjects(_lives)
    }
    if(stats && stats.poolList) {
      filterPools(stats.poolList)
    }
  }, [stats, stats.poolList])

  const votes  = useVotes()

  return (
    <div className="container">
      <React.Fragment>
        <section className="project-area explore-area">
          <div className="intro-content text-center">
            <h1 className="color-primary">Want to <a href="https://swap.happybear.life/" target="_blank" style={{fontSize: "4rem"}}><strong className="text-white">Elevate</strong></a> your project?</h1>
            <h5 className="text-white">Complete our Onboarding Process to Share your Project within a Safe Launchpad Environment.</h5>
            <Link to="/dao" className="btn">Apply Here</Link>
          </div>

          <div className="mt-5">
            <div className="intro-content text-center">
              <h2 className="text-white">Open Projects</h2>
              <h5 className="color-primary">Contribute to Open Projects.</h5>
            </div>
            <div className="row items">
              <React.Fragment>
                {stats.loading ? (
                  <div className="col-md-12">
                    <HashLoader
                      size="100"
                      color="#fff"
                      cssOverride={{
                        left: "50%",
                        textAlign: "center",
                        top: "50%",
                      }}
                    />
                  </div>
                ) : openProjects.length > 0 ? (
                  openProjects
                    .slice(0)
                    .reverse()
                    .map((rowdata, index) => {
                      return <ProjectCard
                      chainId={stats.chainId}
                      rowdata={rowdata}
                      index={index} 
                      key={index}/>
                    })
                ) : (
                  <div className="col-12 item explore-item mt-5">
                    <p className="text-center">No Record Found</p>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>

          <div className="mt-5">
            <div className="intro-content text-center">
              <h2 className="text-white">Projects Under Vote</h2>
              <h5 className="color-primary">Vote if Projects Should Launch Using your $ELEV tokens.</h5>
            </div>
            <div className="row items">
              <React.Fragment>
                {
                votes.length > 0 ? (
                  votes
                    .slice(0)
                    .reverse()
                    .map((vote, index) => {
                      return <VoteCard vote={vote} key={index} />
                    })
                ) : (
                  <div className="col-12 item explore-item mt-5">
                    <p className="text-center">No Record Found</p>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>

          <div className="mt-5">
            <div className="intro-content text-center">
              <h2 className="text-white">Pending Projects</h2>
              <h5 className="color-primary">Projects Approved for Launch but Pending Launch Date.</h5>
            </div>
            <div className="row items">
            <React.Fragment>
                {stats.loading ? (
                  <div className="col-md-12">
                    <HashLoader
                      size="100"
                      color="#fff"
                      cssOverride={{
                        left: "50%",
                        textAlign: "center",
                        top: "50%",
                      }}
                    />
                  </div>
                ) : pendingProjects.length > 0 ? (
                  pendingProjects
                    .slice(0)
                    .reverse()
                    .map((rowdata, index) => {
                      return <ProjectCard
                      chainId={stats.chainId}
                      rowdata={rowdata}
                      index={index} 
                      key={index}/>
                    })
                ) : (
                  <div className="col-12 item explore-item mt-5">
                    <p className="text-center">No Record Found</p>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>

          <div className="mt-5">
            <div className="intro-content text-center">
              <h2 className="text-white">Live Projects</h2>
              <h5 className="color-primary">Previous Projects that have been Completed or Finalised.</h5>
            </div>
            <div className="row items">
              <React.Fragment>
                {stats.loading ? (
                  <div className="col-md-12">
                    <HashLoader
                      size="100"
                      color="#fff"
                      cssOverride={{
                        left: "50%",
                        textAlign: "center",
                        top: "50%",
                      }}
                    />
                  </div>
                ) : liveProjects.length > 0 ? (
                  liveProjects
                    .slice(0)
                    .reverse()
                    .map((rowdata, index) => {
                      return <ProjectCard
                      chainId={stats.chainId}
                      rowdata={rowdata}
                      index={index} 
                      key={index}/>
                    })
                ) : (
                  <div className="col-12 item explore-item mt-5">
                    <p className="text-center">No Record Found</p>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>
        </section>
      </React.Fragment>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePadStatus } from "./helper/useStats";

import logo from "../../images/logo.png";

export default function Home() {
  const stats = usePadStatus();

  return (
    <React.Fragment>
      <section id="home" className="project-area pt-0">
        <div className="container px-2 px-sm-5 py-5">
          <div className="text-center mt-5">
            <h3 className="text-uppercase">
              The launchpad you deserve is here!
            </h3>
            <p>
            Innovating the BASE ecosystem through the BDAI Defi Launchpad
            </p>
          </div>
          <div className="text-center mt-5">
            <Link to="/presale">
              <button className="btn">Create Now</button>
            </Link>
            {/* <a href="#" target="_blank">
              <button className="btn">Learn more</button>
            </a> */}
          </div>
          <div className="row my-5">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>${stats.totalLiquidityRaised}</h3>
                <p className="">Total Liquidity Raised</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>{stats.totalProjects}</h3>
                <p>Total Projects</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>{stats.totalParticipants}</h3>
                <p>Total Participants</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>${stats.totalValueLocked}</h3>
                <p>Total Value Locked</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center mt-5 text-center">
            <h3 className="text-uppercase col-12 col-md-10 text-center">
              A Suite of Tools for Token Sales.
            </h3>
            <p className="col-12 col-md-10 text-center">
              A suite of tools were built to help you create your own tokens and
              launchpads in a fast, simple and cheap way, with no prior code
              knowledge required and 100% decentralized!
            </p>
          </div>
          <div className="row my-5">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Standard</h4>
                <p className="">
                  Create standard tokens on ETH, BSC, AVAX, Fantom, Polygon.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Deflationary</h4>
                <p>
                  Create deflationary tokens with tax and/or charity functions.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Customization</h4>
                <p>Create a token sale for your own custom token easily.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Launchpad</h4>
                <p>
                  Use the token you mint to create a launchpad with just a few
                  clicks
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Branding</h4>
                <p className="">
                  Adding logo, social links, description, listing on BDAI.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Management</h4>
                <p>
                  The portal to help you easily update content for your
                  launchpad.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Community</h4>
                <p>Promote your launchpad to thousands of buyers on BDAI.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img src={logo} alt="Brand Logo" width="50px" />
                <h4 className="my-2">Locking</h4>
                <p>
                  Lock your liquidity to BDAISwap, PancakeSwap after presale.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <p className="text-center">
              Disclaimer: The information provided shall not in any way
              constitute a recommendation as to whether you should invest in any
              product discussed. We accept no liability for any loss occasioned
              to any person acting or refraining from action as a result of any
              material provided or published.
            </p>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

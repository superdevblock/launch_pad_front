import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [updater] = useState({ page: 0, pageSize: 12, loading: true });

  return (
    <React.Fragment>
      <section id="home" className="project-area pt-0">
        <div className="container p-5">
          <div className="text-center mt-5">
            <h3 className="text-uppercase">
              The launchpad you deserve is here!
            </h3>
            <p>
              Innovating the EVM ecosystem through the NovaPad Defi Launchpad
            </p>
          </div>
          <div className="text-center mt-5">
            <Link to="/presale">
              <button className="btn">Create Now</button>
            </Link>
            <Link to="/docs">
              <button className="btn">Learn more</button>
            </Link>
          </div>
          <div className="row my-5">
            <div className="col-12 col-md-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>$0</h3>
                <p className="">Total Liquidity Raised</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>0</h3>
                <p>Total Projects</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>0</h3>
                <p>Total Participants</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card text-center my-2 pt-0 pb-4">
                <h3>$0</h3>
                <p>Total Values Locked</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <h3 className="text-uppercase">
              A Suite of Tools for Token Sales.
            </h3>
            <p className="col-12 col-md-8 text-center">
              A suite of tools were built to help you create your own tokens and
              launchpads in a fast, simple and cheap way, with no prior code
              knowledge required and 100% decentralized!
            </p>
          </div>
          <div className="row my-5">
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Standard</h4>
                <p className="">
                  Create standard tokens on ETH, BSC, AVAX, Fantom, Polygon.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Deflationary</h4>
                <p>
                  Create deflationary tokens with tax and/or charity functions.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Customization</h4>
                <p>Create a token sale for your own custom token easily.</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Launchpad</h4>
                <p>
                  Use the token you mint to create a launchpad with just a few
                  clicks
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Branding</h4>
                <p className="">
                  Adding logo, social links, description, listing on NovaPad.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Management</h4>
                <p>
                  The portal to help you easily update content for your
                  launchpad.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Community</h4>
                <p>Promote your launchpad to thousands of buyers on NovaPad.</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="card d-flex flex-column justify-content-center align-items-center text-center my-2 pt-4 pb-4">
                <img
                  src={require("../images/logo.png").default}
                  alt="Brand Logo"
                  width="50px"
                />
                <h4 className="my-2">Locking</h4>
                <p>
                  Lock your liquidity to NovaSwap, PancakeSwap after presale.
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

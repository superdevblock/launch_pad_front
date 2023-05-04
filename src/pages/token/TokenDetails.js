import React from "react";
import { Link, useLocation } from "react-router-dom";

import "../launchpadApply/index.css";
import Context from "./context/Context";

export default function TokenDetails(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return (
    <Context.Provider>
      <React.Fragment>
        <section className="explore-area create-token">
          <div className="container px-3">
            <div className="intro">
              <div className="intro-content text-center">
                <h2 className="color-primary">Create Token</h2>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="card stepcard">
                <div className="card-body">
                  <h5 className="text-center">
                    Token generation is successful.
                  </h5>
                  <h4 className="text-center my-5 text-uppercase">
                    ADDRESS : {params.get("addr")}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <button className="btn">
                      <a
                        className="text-white"
                        href={`https://etherscan.io/token/${params.get("addr")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on Etherscan
                      </a>
                    </button>
                    <button className="btn">
                      <Link className="text-white" to="/presale">
                        Create Presale
                      </Link>
                    </button>
                    {/* <button className="btn">
                      <Link className="text-white" to="/fairlaunch">
                        Create Fairlaunch
                      </Link>
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    </Context.Provider>
  );
}

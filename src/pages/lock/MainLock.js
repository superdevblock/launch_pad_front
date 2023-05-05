import React, { useState, useContext, useEffect } from "react";
import "../launchpadApply/index.css";
import Lock from "./Lock";
import Context from "./context/Context";
import { useWeb3React } from "@web3-react/core";
import { defaultValue } from "./context/defaults";

export default function MainLock() {
  const appContext = useContext(Context);
  const [context, setContext] = useState(appContext);
  const { chainId, account } = useWeb3React();

  const setValue = (value) => {
    setContext({ ...context, value });
  };

  useEffect(() => {
    setContext({ ...context, value: { ...defaultValue } });
    // eslint-disable-next-line
  }, [chainId, account]);

  const state = {
    ...context,
    setValue: setValue,
  };

  return (
    <Context.Provider value={state}>
      <React.Fragment>
        <section className="explore-area prev-project-area">
          <div className="container px-3">
            <div className="intro">
              <div className="intro-content text-center">
                <span className="intro-text">Create Lock</span>
              </div>
            </div>
            <div className="my-5">
              <div className="card stepcard">
                <div className="card-body">
                  <form className="login-box">
                    <Lock />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    </Context.Provider>
  );
}

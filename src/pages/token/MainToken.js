import React, { useState, useContext, useEffect } from "react";
import "../launchpadApply/index.css";
import StandardToken from "./StandardToken";
import BabyToken from "./BabyToken";
import BuyBackBabyToken from "./BuyBackBabyToken";
import LiquidityToken from "./LiquidityToken";
import Context from "./context/Context";
import { useWeb3React } from "@web3-react/core";
import { defaultValue } from "./context/defaults";

const createFee = 10 ** 17;

export default function MainToken() {
  const appContext = useContext(Context);
  const [context, setContext] = useState(appContext);
  const { chainId, account } = useWeb3React();
  const [type, setType] = useState("1");

  const setValue = (value) => {
    setContext({ ...context, value });
  };

  useEffect(() => {
    setContext({ ...context, value: { ...defaultValue } });
  }, [chainId, account]);

  const state = {
    ...context,
    setValue: setValue,
  };

  const onChangeType = (e) => {
    setType(e.target.value);
  };

  return (
    <Context.Provider value={state}>
      <React.Fragment>
        <section className="explore-area create-token">
          <div className="container px-3">
            <div className="intro">
              <div className="intro-content text-center">
                <span className="intro-text">Create Token</span>
              </div>
            </div>
            <div className="my-5">
              <div className="card stepcard">
                <div className="card-body">
                  <form className="login-box">
                    <div className="">
                      <div
                        className={`tab-pane active mt-3`}
                        role="tabpanel"
                        id="step1"
                      >
                        <div className="row">
                          <div className="col-12 mb-0">
                            <label>
                              Token Type<span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-control"
                              onChange={(e) => onChangeType(e)}
                            >
                              <option value="1">Standard Token</option>
                              <option value="4">Liquidity Token</option>
                              <option value="2">Baby Token</option>
                              <option value="3">BuyBackBaby Token</option>
                            </select>
                            <small>Fee : 0.1 BNB</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    {type === "1" && <StandardToken createFee={createFee} />}
                    {type === "2" && <BabyToken createFee={createFee} />}
                    {type === "3" && <BuyBackBabyToken createFee={createFee} />}
                    {type === "4" && <LiquidityToken createFee={createFee} />}
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

import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";

import { useEffect, useState } from "react";
import { injected, walletconnect, coinbaseWallet } from "../hooks/connectors";
import Modal from "react-bootstrap/Modal";
import { trimAddress } from "../hooks/constant";
import { supportNetwork, networkLists } from "../hooks/network";
import useEagerConnect from "../hooks/useWeb3";

export const Connect = function () {
  const context = useWeb3React();
  const { connector, account, activate, deactivate, chainId, active, error } = context;
  const [show, setShow] = useState(false);
  const [networkshow, setNetworkshow] = useState(false);

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEagerConnect();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
      return "Metamask not deteced";
    }
    if (error instanceof UnsupportedChainIdError) {
      return (
        <span
          className="btn-text"
          onClick={(e) => switchNetwork(supportNetwork["default"].chainId)}
        >
          <img
            src={require("../images/heartbeat.png").default}
            alt="wrong-network"
            height="17px"
            width="17px"
            className="mx-2"
          />
          Wrong Network
        </span>
      );
    }

    deactivate(injected);
  }

  const activating = (connection) => connection === activatingConnector;
  const connected = (connection) => connection === connector;

  const switchNetwork = (networkid) => {
    console.log("switchNetwork");
    try {
      // @ts-ignore
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${networkid.toString(16)}` }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChainList = () => {

  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center">
        <div
          style={{cursor: "pointer"}}
          className="badge badge-outline"
          onClick={() => {
            setNetworkshow(!networkshow);
          }}
        >
          <img
            src={require("../images/logo.png").default}
            alt="Brand Logo"
            width="50px"
            className="show-on-mobile mr-3"
          />
          <img
            src={
              supportNetwork[chainId]
                ? supportNetwork[chainId].image
                : ""
            }
            alt=""
            className="mx-2"
            width="20"
            id="chain-id"
            onClick={handleChainList()}
          />
          <span className="hide-on-mobile">
            {chainId && supportNetwork[chainId]
              ? supportNetwork[chainId].name
              : ""}
          </span>
        </div>
        <div className="d-flex">
          <div>
            {error && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setActivatingConnector();
                }}
              >
                {getErrorMessage(error)}
              </button>
            )}
            {!error && (
              <>
                {active &&
                  (connected(injected) ||
                    connected(walletconnect) ||
                    connected(coinbaseWallet)) && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setActivatingConnector();
                        deactivate(injected);
                        deactivate(walletconnect);
                        deactivate(coinbaseWallet);
                      }}
                    >
                      {account && trimAddress(account)}
                    </button>
                  )}
                {!active &&
                  (!connected(injected) ||
                    !connected(walletconnect) ||
                    !connected(coinbaseWallet)) && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setShow(!show);
                      }}
                    >
                      {(activating(injected) ||
                        activating(walletconnect) ||
                        activating(coinbaseWallet)) && (
                        <span className="btn-text">Connecting...</span>
                      )}
                      {(!activating(injected) ||
                        !activating(walletconnect) ||
                        !activating(coinbaseWallet)) && (
                        <span className="btn-text">Connect</span>
                      )}
                    </button>
                  )}
              </>
            )}
          </div>
          {/* <div style={{paddingTop: '10px', position: 'relative'}}>
            <img
              src={
                supportNetwork[chainId]
                  ? supportNetwork[chainId].image
                  : ""
              }
              alt=""
              className="mx-2"
              width="20"
              id="chain-id"
              onClick={handleChainList()}
            />
            <ul className="chain-ul">
              {
                networkLists.map((network) => (
                  <li className="chain-list" chainId={ network.chainId } onClick={switchNetwork(network.chainId)} >
                    <img
                      src={ network.image }
                      alt=""
                      className="mx-2"
                      width="20"
                    />
                </li>
                ))
              }
            </ul>
          </div> */}
        </div>
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="ms"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>Connect to a wallet</Modal.Title>
          {/* <button type="button" className="btn-close btn-close-white" aria-label="Close"></button> */}
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <button
                  className="btn btn-dark modal-btn-connect"
                  onClick={() => {
                    activate(injected);
                    setShow(false);
                  }}
                >
                  <div className="div-modal-btn">
                    <img
                      src={require("../images/metamask.svg").default}
                      alt="Meta-mask-Im"
                      className="modal-img"
                    />
                    <div className="text-modal-line">Metamask</div>
                  </div>
                </button>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-dark modal-btn-connect"
                  onClick={() => {
                    activate(walletconnect);
                    setShow(false);
                  }}
                >
                  <div className="div-modal-btn">
                    <img
                      src={require("../images/walletconnect.svg").default}
                      alt="walletConnect"
                      className="modal-img"
                    />
                    <div className="text-modal-line">WalletConnect</div>
                  </div>
                </button>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-dark modal-btn-connect"
                  onClick={() => {
                    activate(coinbaseWallet);
                    setShow(false);
                  }}
                >
                  <div className="div-modal-btn">
                    <img
                      src={require("../images/coinbase.svg").default}
                      alt="coinbase"
                      className="modal-img"
                    />
                    <div className="text-modal-line">Coinbase</div>
                  </div>
                </button>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-dark modal-btn-connect"
                  onClick={() => {
                    activate(injected);
                    setShow(false);
                  }}
                >
                  <div className="div-modal-btn">
                    <img
                      src={require("../images/trustwallet.svg").default}
                      alt="coinbase"
                      className="modal-img"
                    />
                    <div className="text-modal-line">TrustWallet</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={networkshow}
        onHide={() => setNetworkshow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        size="ms"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a Network</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {Object.keys(supportNetwork).map(function (key) {
                if (key === "default")
                  return <React.Fragment key={key}></React.Fragment>;
                return (
                  <div className="col-12" key={key}>
                    <button
                      className="btn btn-dark modal-btn-connect"
                      onClick={() => {
                        switchNetwork(supportNetwork[key].chainId);
                        setNetworkshow(false);
                      }}
                    >
                      <div className="div-modal-btn">
                        <img
                          src={supportNetwork[key].image}
                          alt="Meta-mask-Im"
                          className="modal-img"
                        />
                        <div className="text-modal-line">
                          {supportNetwork[key].name}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Connect;

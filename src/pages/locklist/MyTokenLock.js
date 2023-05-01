import React, { useState } from "react";
// import { toast } from 'react-toastify';
import HashLoader from "react-spinners/HashLoader";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { useMyTokenLockStats } from "./helper/useStats";

export default function TokenLockList() {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useMyTokenLockStats(updater);
  const context = useWeb3React();
  const { chainId } = context;

  return (
    <div className="container">
      <React.Fragment>
        <section className="explore-area prev-project-area">
          <div className="intro">
            <div className="intro-content text-center">
              <span className="intro-text">My Locked Token List</span>
            </div>
            <div
              className="explore-menu btn-group btn-group-toggle flex-wrap mt-5 pl-3"
              data-toggle="buttons"
            >
              <label className="btn d-table text-uppercase p-2">
                <Link to="/token-locked" className="explore-btn">
                  <span>Token Lock List</span>
                </Link>
              </label>
              <label className="btn active d-table text-uppercase p-2">
                <Link to="/my-token-lock" className="explore-btn">
                  <span>My Token Lock List</span>
                </Link>
              </label>
            </div>
          </div>

          <section className="card leaderboard-area pt-2">
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.loading ? (
                        <div className="row">
                          <div className="col-12 d-flex justify-content-between">
                            <HashLoader
                              size="100"
                              color="#fff"
                              cssOverride={{ left: "50%", top: "20%" }}
                            />
                          </div>
                        </div>
                      ) : stats.tokenList.length > 0 ? (
                        stats.tokenList
                          .slice(0)
                          .reverse()
                          .map((rowdata, index) => {
                            return (
                              <tr>
                                <td>
                                  {stats.page > 0
                                    ? stats.page * stats.pageSize + 1 + index
                                    : index + 1}
                                </td>
                                <td className="image-row">
                                  {" "}
                                  {rowdata.name} ~ {rowdata.symbol}
                                </td>
                                <td>
                                  {rowdata.amount
                                    ? rowdata.amount /
                                      Math.pow(10, rowdata.decimals)
                                    : "0"}{" "}
                                  {rowdata.symbol}
                                </td>
                                <td>
                                  <Link
                                    style={{ color: "var(--primary-color)" }}
                                    to={`/lock-details/${rowdata.token}${
                                      chainId ? `?chainid=${chainId}` : ""
                                    }`}
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr className="text-center mt-4">
                          <td
                            style={{ backgroundColor: "transparent" }}
                            colSpan="4"
                          >
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <nav>
                  <ul className="page-numbers">
                    <li>
                      {stats.page > 0 && (
                        <a
                          href="#sec"
                          onClick={(e) =>
                            setUpdater({
                              page: stats.page - 1,
                              pageSize: stats.pageSize,
                              loading: true,
                            })
                          }
                        >
                          <i className="icon-Vector mr-2"></i>Previous
                        </a>
                      )}
                    </li>
                    {Math.floor(
                      stats.allNormalTokenLockedCount / stats.pageSize
                    ) > parseFloat(stats.page) && (
                      <li>
                        <a
                          href="#sec"
                          onClick={(e) =>
                            setUpdater({
                              page: stats.page + 1,
                              pageSize: stats.pageSize,
                              loading: true,
                            })
                          }
                        >
                          Next<i className="icon-arrow_right ml-2"></i>
                        </a>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </section>
        </section>
      </React.Fragment>
    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./layouts/main";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import Landing from "./pages/Landing/Landing";
import PreSale from "./pages/launchpadApply/Presale";
import PrivateSale from "./pages/launchpadApply/PrivateSale";
import DetailsComp from "./pages/launchpadApply/presaleview/DetailsComp";
import DetailsCompPrivatesale from "./pages/launchpadApply/privatesaleview/DetailsCompPrivatesale";
import ProjectList from "./pages/launchpadApply/SaleList/ProjectList";
import PrvProjectList from "./pages/launchpadApply/PrvSaleList/PrvProjectList";
import PrvContributions from "./pages/launchpadApply/PrvSaleList/component/PrvContributions";
import MyContributions from "./pages/launchpadApply/SaleList/component/MyContributions";
import Fairsale from "./pages/launchpadApply/Fairsale";
import DetailsFairComp from "./pages/launchpadApply/fairsaleview/DetailsFairComp";
import MainLock from "./pages/lock/MainLock";
import MainToken from "./pages/token/MainToken";
import TokenDetails from "./pages/token/TokenDetails";
import TokenLockList from "./pages/locklist/TokenLockList";
import LockView from "./pages/locklist/LockView";
import LockRecord from "./pages/locklist/LockRecord";
import MyTokenLock from "./pages/locklist/MyTokenLock";
import MyLpLock from "./pages/locklist/MyLpLock";
import LpLockList from "./pages/locklist/LpLockList";
import Pad from "./pages/Pad/Pad";
import Dao from "./pages/Dao/Dao";
import ProposalDetails from "./pages/Dao/ProposalDetails";
import CreateProposal from "./pages/Dao/CreateProposal";

function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer pauseOnFocusLoss={false} />
        <MainLayout>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/presale">
              <PreSale />
            </Route>
            <Route exact path="/sale-list">
              <ProjectList />
            </Route>
            <Route exact path="/my-contribution">
              <MyContributions />
            </Route>
            <Route exact path="/lock">
              <MainLock />
            </Route>
            <Route exact path="/token">
              <MainToken />
            </Route>
            <Route exact path="/token-details">
              <TokenDetails />
            </Route>
            <Route exact path="/token-locked">
              <TokenLockList />
            </Route>
            <Route exact path="/liquidity-locked">
              <LpLockList />
            </Route>
          </Switch>
        </MainLayout>
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./layouts/main";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
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
import KycAudit from "./component/KycAudit";
import LpLockList from "./pages/locklist/LpLockList";

const globalChainID = 56;
// #7f56fe
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
            <Route path="/presale-details">
              <DetailsComp />
            </Route>
            <Route path="/private-details">
              <DetailsCompPrivatesale />
            </Route>
            <Route path="/fairlaunch-details">
              <DetailsFairComp />
            </Route>
            <Route exact path="/presale">
              <PreSale />
            </Route>
            <Route exact path="/privatesale">
              <PrivateSale />
            </Route>
            <Route exact path="/fairlaunch">
              <Fairsale />
            </Route>
            <Route exact path="/sale-list">
              <ProjectList />
            </Route>
            <Route exact path="/prvsale-list">
              <PrvProjectList />
            </Route>
            <Route exact path="/my-contribution">
              <MyContributions />
            </Route>
            <Route exact path="/prv-contribution">
              <PrvContributions />
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
            <Route exact path="/lock-details/:id">
              <LockView />
            </Route>
            <Route exact path="/lock-record/:id">
              <LockRecord />
            </Route>
            <Route exact path="/my-token-lock">
              <MyTokenLock />
            </Route>
            <Route exact path="/my-lp-lock">
              <MyLpLock />
            </Route>
            <Route exact path="/my-lp-lock">
              <MyLpLock />
            </Route>
            <Route exact path="/kycaudit">
              <KycAudit />
            </Route>
          </Switch>
        </MainLayout>
      </Router>
    </div>
  );
}

export default App;

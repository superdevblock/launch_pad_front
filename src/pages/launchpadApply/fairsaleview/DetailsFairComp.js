import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import ProjectDetails from "./ProjectDetails";

export default function DetailsFairComp() {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <div className="SignUp_SignIn_Form_Sect">
          <div className="SignUp_SignIn_Form_SectBG"></div>
          <div className="container">
            <div className="SignUp_SignIn_Form_Content">
              <div className="SignUp_SignIn_Form ForgotPassForm">
                <h2>404</h2>
                <h3 className="mt-3">Look like you're lost</h3>
                <h4 className="mb-3">
                  the page you are looking for not avaible!
                </h4>
                <img src="../assets/images/error.gif" alt="img-error" />
              </div>
              <div className="singUpformShadow"></div>
            </div>
          </div>
        </div>
      </Route>
      <Route path={`${path}/:topicId`}>
        <ProjectDetails />
      </Route>
    </Switch>
  );
}

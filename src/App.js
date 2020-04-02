import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Layout from "components/Layout";
import UserPool from "pages/UserPool";
import OrgManage from "pages/OrgManage";
import AppManage from "pages/AppManage";
import ResManage from "pages/ResManage";
import RoleManage from "pages/RoleManage";

function App() {
    return (
        <Router basename="/console">
            <Layout>
                <Switch>
                    <Route path="/user-pool">
                        <UserPool />
                    </Route>
                    <Route path="/org-manage">
                        <OrgManage />
                    </Route>
                    <Route path="/app-manage">
                        <AppManage />
                    </Route>
                    <Route path="/res-manage">
                        <ResManage />
                    </Route>
                    <Route path="/role-manage">
                        <RoleManage />
                    </Route>
                    <Route path="/">
                        <Redirect to="/org-manage" />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;

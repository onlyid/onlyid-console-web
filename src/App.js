import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Layout from "components/Layout";
import UserPool from "pages/UserPool";
import OrgManage from "pages/OrgManage";
import AppManage from "pages/AppManage";

function App() {
    return (
        <Router>
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
                    <Route path="/">
                        <Redirect to="/org-manage" />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;

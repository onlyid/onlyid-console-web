import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Layout from "components/Layout";
import OAuthRedirect from "pages/OAuthRedirect";
import { Spin } from "antd";

const UserPool = React.lazy(() => import("pages/UserPool"));
const OrgManage = React.lazy(() => import("pages/OrgManage"));
const AppManage = React.lazy(() => import("pages/AppManage"));
const ResManage = React.lazy(() => import("pages/ResManage"));
const RoleManage = React.lazy(() => import("pages/RoleManage"));

const loading = (
    <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
    </div>
);

function App() {
    return (
        <Router basename="/console">
            <Layout>
                <Suspense fallback={loading}>
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
                        <Route path="/oauth-redirect">
                            <OAuthRedirect />
                        </Route>
                        <Route path="/">
                            <Redirect to="/org-manage" />
                        </Route>
                    </Switch>
                </Suspense>
            </Layout>
        </Router>
    );
}

export default App;

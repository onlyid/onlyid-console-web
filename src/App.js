import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Layout from "components/Layout";
import OAuthCallback from "pages/OAuthCallback";
import AliPayCallback from "pages/AliPayCallback";
import { Spin } from "antd";

const UserPool = React.lazy(() => import("pages/UserPool"));
const OrgManage = React.lazy(() => import("pages/OrgManage"));
const AppManage = React.lazy(() => import("pages/AppManage"));
const ResManage = React.lazy(() => import("pages/ResManage"));
const RoleManage = React.lazy(() => import("pages/RoleManage"));
const Statistics = React.lazy(() => import("pages/Statistics"));
const AuditLog = React.lazy(() => import("pages/AuditLog"));
const Admin = React.lazy(() => import("pages/Admin"));

const loading = (
    <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
    </div>
);

function App() {
    return (
        <BrowserRouter basename="/console">
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
                        <Route path="/oauth-callback">
                            <OAuthCallback />
                        </Route>
                        <Route path="/alipay-callback">
                            <AliPayCallback />
                        </Route>
                        <Route path="/statistics">
                            <Statistics />
                        </Route>
                        <Route path="/audit-log">
                            <AuditLog />
                        </Route>
                        <Route path="/admin">
                            <Admin />
                        </Route>
                        <Route path="/">
                            <Redirect to="/org-manage" />
                        </Route>
                    </Switch>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

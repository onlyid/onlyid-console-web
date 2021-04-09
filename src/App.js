import React, { Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Layout from "components/Layout";
import OAuthCallback from "pages/OAuthCallback";
import AliPayCallback from "pages/AliPayCallback";
import { CircularProgress } from "@material-ui/core";

const Statistic = React.lazy(() => import("pages/Statistic"));
const Application = React.lazy(() => import("pages/Application"));
const OtpRecord = React.lazy(() => import("pages/OtpRecord"));
const User = React.lazy(() => import("pages/User"));
const Permission = React.lazy(() => import("pages/Permission"));
const Role = React.lazy(() => import("pages/Role"));
const BehaviorLog = React.lazy(() => import("pages/BehaviorLog"));
const Tenant = React.lazy(() => import("pages/Tenant"));
const MyMessage = React.lazy(() => import("pages/MyMessage"));

const loading = (
    <div style={{ textAlign: "center", padding: "100px 0" }}>
        <CircularProgress />
    </div>
);

function App() {
    return (
        <BrowserRouter basename="/console">
            <Layout>
                <Suspense fallback={loading}>
                    <Switch>
                        <Route path="/oauth-callback">
                            <OAuthCallback />
                        </Route>
                        <Route path="/alipay-callback">
                            <AliPayCallback />
                        </Route>
                        <Route path="/statistics">
                            <Statistic />
                        </Route>
                        <Route path="/applications">
                            <Application />
                        </Route>
                        <Route path="/otp-records">
                            <OtpRecord />
                        </Route>
                        <Route path="/users">
                            <User />
                        </Route>
                        <Route path="/permissions/:clientId?">
                            <Permission />
                        </Route>
                        <Route path="/roles">
                            <Role />
                        </Route>
                        <Route path="/behavior-logs">
                            <BehaviorLog />
                        </Route>
                        <Route path="/tenant">
                            <Tenant />
                        </Route>
                        <Route path="/my-messages">
                            <MyMessage />
                        </Route>
                        <Route path="/">
                            <Redirect to="/statistics" />
                        </Route>
                    </Switch>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

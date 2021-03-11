import React, { PureComponent } from "react";
import { connect } from "react-redux";
import MainHeader from "components/MainHeader";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { CLIENT_TYPE_TEXT } from "my/constants";
import styles from "../index.module.css";
import mainTabs from "components/MainTabs.module.css";
import { Snackbar, Tab, Tabs } from "@material-ui/core";
import Basic from "./Basic";
import Otp from "./Otp";
import OAuth from "./OAuth";
import Danger from "./Danger";
import { Alert } from "@material-ui/lab";

class Client extends PureComponent {
    state = {
        client: {},
        toastOpen: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const client = await http.get(`clients/${match.params.clientId}`);
        this.setState({ client });
    };

    onTabChange = (event, value) => {
        const { dispatch } = this.props;
        dispatch({ type: "application", payload: { currentTab: value } });
    };

    onUpload = async filename => {
        const { match } = this.props;
        const { iconUrl } = await http.put(`clients/${match.params.clientId}/icon`, { filename });
        this.setState(({ client }) => ({ client: { ...client, iconUrl }, toastOpen: true }));
    };

    closeToast = () => {
        this.setState({ toastOpen: false });
    };

    onClientChange = values => {
        this.setState(({ client }) => ({ client: { ...client, ...values } }));
    };

    render() {
        const { client, toastOpen } = this.state;
        const { application } = this.props;

        let content;
        switch (application.currentTab) {
            case "otp":
                content = <Otp />;
                break;
            case "oauth":
                content = <OAuth client={client} onChange={this.onClientChange} />;
                break;
            case "danger":
                content = <Danger />;
                break;
            default:
                content = <Basic client={client} onChange={this.onClientChange} />;
        }

        return (
            <div>
                <MainHeader
                    backText="返回应用列表"
                    imgUrl={client.iconUrl}
                    title={client.name}
                    uploadTip="点击上传新Icon"
                    onUpload={this.onUpload}
                >
                    <ul>
                        <li>
                            <span>ID：</span>
                            <span className={styles.clientId}>{client.id}</span>
                        </li>
                        <li>
                            <span>类型：</span>
                            {CLIENT_TYPE_TEXT[client.type]}
                        </li>
                    </ul>
                </MainHeader>
                <Tabs
                    value={application.currentTab}
                    onChange={this.onTabChange}
                    indicatorColor="primary"
                    className={mainTabs.root}
                >
                    <Tab label="基础设置" value="basic" />
                    <Tab label="OTP 验证码设置" value="otp" />
                    <Tab label="SSO OAuth 设置" value="oauth" />
                    <Tab label="危险设置" value="danger" />
                </Tabs>
                {content}
                <Snackbar
                    open={toastOpen}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    onClose={this.closeToast}
                    autoHideDuration={2000}
                    ClickAwayListenerProps={{ mouseEvent: false }}
                >
                    <Alert elevation={1} severity="success">
                        保存成功
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default connect(({ application }) => ({ application }))(withRouter(Client));

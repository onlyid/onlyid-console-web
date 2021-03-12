import React, { PureComponent } from "react";
import { connect } from "react-redux";
import MainHeader from "components/MainHeader";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { CLIENT_TYPE_TEXT } from "my/constants";
import styles from "../index.module.css";
import mainTabs from "components/MainTabs.module.css";
import { Tab, Tabs } from "@material-ui/core";
import Basic from "./Basic";
import Otp from "./Otp";
import OAuth from "./OAuth";
import Danger from "./Danger";
import { eventEmitter } from "my/utils";

class Client extends PureComponent {
    state = {
        client: {}
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
        this.setState(({ client }) => ({ client: { ...client, iconUrl } }));
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    onClientChange = values => {
        this.setState(({ client }) => ({ client: { ...client, ...values } }));
    };

    render() {
        const { client } = this.state;
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
                content = <Danger onChange={this.onClientChange} />;
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
            </div>
        );
    }
}

export default connect(({ application }) => ({ application }))(withRouter(Client));

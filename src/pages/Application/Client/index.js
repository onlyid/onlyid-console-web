import React, { PureComponent } from "react";
import { connect } from "react-redux";
import MainHeader from "components/MainHeader";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { CLIENT_TYPE_TEXT, IMG_UPLOAD_TIP } from "my/constants";
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
        const client = await http.get(`clients/${match.params.id}`);
        this.setState({ client });
    };

    onTabChange = (event, value) => {
        const { dispatch } = this.props;
        dispatch({ type: "application", currentTab: value });
    };

    onUpload = async (filename) => {
        const { match } = this.props;
        const { iconUrl } = await http.put(`clients/${match.params.id}/icon`, { filename });
        this.setState(({ client }) => ({ client: { ...client, iconUrl } }));
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
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
                content = <OAuth clientType={client.type} />;
                break;
            case "danger":
                content = <Danger onSave={this.initData} />;
                break;
            default:
                content = <Basic client={client} onSave={this.initData} />;
        }

        return (
            <>
                <MainHeader
                    backText="返回应用列表"
                    imgUrl={client.iconUrl}
                    title={client.name}
                    uploadTip={`上传新Icon，${IMG_UPLOAD_TIP}`}
                    onUpload={this.onUpload}
                >
                    <ul>
                        <li>
                            <span>ID：</span>
                            <span className="spanId">{client.id}</span>
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
                    <Tab label="应用详情" value="basic" />
                    <Tab label="OTP 验证码设置" value="otp" />
                    <Tab label="SSO OAuth 设置" value="oauth" />
                    <Tab label="危险设置" value="danger" />
                </Tabs>
                {content}
            </>
        );
    }
}

export default connect(({ application }) => ({ application }))(withRouter(Client));

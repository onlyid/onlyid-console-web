import React, { PureComponent } from "react";
import { message, Modal } from "antd";
import Info from "./Info";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import { eventEmitter } from "my/utils";
import OAuthConfig from "./OAuthConfig";
import OtpConfig from "./OtpConfig";
import CtrlMenu from "components/CtrlMenu";

const MENU_DATA = [
    { icon: "info-circle", title: "应用详情" },
    { icon: "tool", title: "OAuth 设置" },
    { icon: "tool", title: "OTP 验证码设置" },
    { title: "删除应用", key: "delete" }
];

class App extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            appManage: { selectedKey }
        } = this.props;
        if (prevProps.appManage.selectedKey !== selectedKey) this.back2info();
    }

    onMenuClick = ({ key }) => {
        if (key === "delete") {
            this.delete1();
        } else {
            this.setState({ menuCurrent: key });
        }
    };

    delete1 = () => {
        Modal.confirm({
            content: "删除后不可恢复，确认删除？",
            okText: "删除",
            cancelText: "取消",
            okType: "danger",
            onOk: async () => {
                const {
                    appManage: { selectedKey }
                } = this.props;
                await http.delete("clients/" + selectedKey);

                message.success("删除成功");
                eventEmitter.emit("appManage/deleteSelected");
            }
        });
    };

    back2info = () => {
        this.setState({ menuCurrent: "0" });
    };

    render() {
        const { menuCurrent } = this.state;

        let right;
        switch (menuCurrent) {
            case "0":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <Info />
                    </Card>
                );
                break;
            case "1":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <OAuthConfig />
                    </Card>
                );
                break;
            default:
                // 2
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <OtpConfig />
                    </Card>
                );
        }

        return (
            <>
                <div>
                    <CtrlMenu data={MENU_DATA} current={menuCurrent} onClick={this.onMenuClick} />
                </div>
                <div>{right}</div>
            </>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(App);

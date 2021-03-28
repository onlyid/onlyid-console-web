import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { eventEmitter } from "my/utils";
import MainHeader from "components/MainHeader";
import { IMG_UPLOAD_TIP } from "my/constants";
import styles from "./index.module.css";
import { Tab, Tabs } from "@material-ui/core";
import mainTabs from "components/MainTabs.module.css";
import Basic from "./Basic";
import Extra from "./Extra";
import Json from "./Json";
import App from "./App";
import Log from "./Log";
import Role from "./Role";
import Permission from "./Permission";
import Danger from "./Danger";

class User extends PureComponent {
    state = {
        user: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const user = await http.get(`users/${match.params.id}`);
        this.setState({ user });
    };

    onTabChange = (event, value) => {
        const { dispatch } = this.props;
        dispatch({ type: "user", currentTab: value });
    };

    onUpload = async filename => {
        const { match } = this.props;
        const { avatarUrl } = await http.put(`users/${match.params.id}/avatar`, { filename });
        this.setState(({ user }) => ({ user: { ...user, avatarUrl } }));
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    render() {
        const { user } = this.state;
        const {
            user: { currentTab }
        } = this.props;

        let content;
        switch (currentTab) {
            case "extra":
                content = <Extra />;
                break;
            case "json":
                content = <Json />;
                break;
            case "app":
                content = <App />;
                break;
            case "log":
                content = <Log />;
                break;
            case "role":
                content = <Role />;
                break;
            case "permission":
                content = <Permission />;
                break;
            case "danger":
                content = <Danger />;
                break;
            default:
                content = <Basic user={user} onSave={this.initData} />;
        }

        return (
            <>
                <MainHeader
                    backText="返回用户列表"
                    imgUrl={user.avatarUrl}
                    title={user.nickname}
                    uploadTip={!user.activated && `上传新头像，${IMG_UPLOAD_TIP}`}
                    onUpload={this.onUpload}
                >
                    <ul>
                        <li>
                            <span>ID：</span>
                            <span className={styles.userId}>{user.id}</span>
                        </li>
                        <li>
                            <span>手机号：</span>
                            <span>{user.mobile || "-"}</span>
                        </li>
                        <li>
                            <span>邮箱：</span>
                            <span>{user.email || "-"}</span>
                        </li>
                        {!user.activated && (
                            <li>
                                <span />
                                <span className={styles.notActivated}>用户未激活</span>
                            </li>
                        )}
                    </ul>
                </MainHeader>
                <Tabs
                    value={currentTab}
                    onChange={this.onTabChange}
                    indicatorColor="primary"
                    className={mainTabs.root}
                >
                    <Tab label="账号详情" value="basic" />
                    <Tab label="附加信息" value="extra" />
                    <Tab label="预览 JSON" value="json" />
                    <Tab label="授权应用" value="app" />
                    <Tab label="登录历史" value="log" />
                    <Tab label="关联角色" value="role" />
                    <Tab label="合并权限" value="permission" />
                    <Tab label="危险设置" value="danger" />
                </Tabs>
                {content}
            </>
        );
    }
}

export default connect(({ user }) => ({ user }))(withRouter(User));

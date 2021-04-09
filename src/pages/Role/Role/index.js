import React, { PureComponent } from "react";
import { connect } from "react-redux";
import MainHeader from "components/MainHeader";
import http from "my/http";
import { withRouter } from "react-router-dom";
import mainTabs from "components/MainTabs.module.css";
import { Tab, Tabs } from "@material-ui/core";
import Basic from "./Basic";
import Danger from "./Danger";
import Permission from "./Permission";
import User from "./User";

class Role extends PureComponent {
    state = {
        role: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const role = await http.get(`roles/${match.params.id}`);
        this.setState({ role });
    };

    onTabChange = (event, value) => {
        const { dispatch } = this.props;
        dispatch({ type: "role", currentTab: value });
    };

    render() {
        const { role } = this.state;
        const {
            role: { currentTab }
        } = this.props;

        let content;
        switch (currentTab) {
            case "permission":
                content = <Permission />;
                break;
            case "user":
                content = <User />;
                break;
            case "danger":
                content = <Danger />;
                break;
            default:
                content = <Basic role={role} onSave={this.initData} />;
        }

        return (
            <>
                <MainHeader backText="返回角色列表" title={role.name}>
                    <ul>
                        <li>
                            <span>ID：</span>
                            <span className="spanId">{role.id}</span>
                        </li>
                    </ul>
                </MainHeader>
                <Tabs
                    value={currentTab}
                    onChange={this.onTabChange}
                    indicatorColor="primary"
                    className={mainTabs.root}
                >
                    <Tab label="角色详情" value="basic" />
                    <Tab label="分配权限" value="permission" />
                    <Tab label="关联用户" value="user" />
                    <Tab label="危险设置" value="danger" />
                </Tabs>
                {content}
            </>
        );
    }
}

export default connect(({ role }) => ({ role }))(withRouter(Role));

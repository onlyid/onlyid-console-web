import React, { PureComponent } from "react";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import { Dropdown, Menu, Icon } from "antd";
import http from "my/http";
import { eventEmitter } from "my/utils";
import { withRouter } from "react-router-dom";

const { Item } = Menu;

const HOME_URL = "https://www.onlyid.net/home";

class RightAccount extends PureComponent {
    componentDidMount() {
        eventEmitter.on("app/login", () => this.forceUpdate());
    }

    logout = async () => {
        await http.post("logout");

        window.location.replace(HOME_URL);
    };

    onClick = ({ key }) => {
        const { history } = this.props;

        if (key === "logout") this.logout();
        else history.push("/admin/" + key);
    };

    render() {
        const userInfo = localStorage.getObj("userInfo");
        if (!userInfo) return null;

        const menu = (
            <Menu onClick={this.onClick}>
                <Item key="developer">
                    <Icon type="user" />
                    开发者信息
                </Item>
                <Item key="renewal">
                    <Icon type="transaction" />
                    有效期和续费
                </Item>
                <Item key="notification">
                    <Icon type="bell" />
                    通知设置
                </Item>
                <Item key="logout">
                    <Icon type="logout" />
                    退出登录
                </Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <div className={styles.rightAccount}>
                    <Avatar url={userInfo.avatarUrl} width={30} />
                    <span className={styles.accountName}>{userInfo.nickname}</span>
                </div>
            </Dropdown>
        );
    }
}

export default withRouter(RightAccount);

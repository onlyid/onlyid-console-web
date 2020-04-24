import React, { PureComponent } from "react";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import { loginUrl } from "my/http";
import { Dropdown, Menu, Icon } from "antd";
import http from "my/http";
import { eventEmitter } from "my/utils";

const { Item } = Menu;

class RightAccount extends PureComponent {
    componentDidMount() {
        eventEmitter.on("app/login", () => this.forceUpdate());
    }

    logout = async () => {
        await http.post("logout");

        window.location.replace(loginUrl);
    };

    onClick = ({ key }) => {
        if (key === "logout") this.logout();
    };

    render() {
        const userInfo = localStorage.getObj("userInfo");
        if (!userInfo) return null;

        const menu = (
            <Menu onClick={this.onClick}>
                <Item key="logout">
                    <Icon type="logout" />
                    退出登录
                </Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <div className={styles.rightAccount}>
                    <Avatar url={userInfo.avatarUrl} width={30} />
                    <span className={styles.accountName}>{userInfo.nickname}</span>
                </div>
            </Dropdown>
        );
    }
}

export default RightAccount;

import React, { PureComponent } from "react";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import { loginUrl } from "my/http";
import { Dropdown, Menu } from "antd";
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
        const { avatarUrl, nickname } = localStorage;

        const menu = (
            <Menu onClick={this.onClick}>
                <Item key="logout">退出登录</Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <div className={styles.rightAccount}>
                    <Avatar url={avatarUrl} width={30} />
                    <span className={styles.accountName}>{nickname}</span>
                </div>
            </Dropdown>
        );
    }
}

export default RightAccount;

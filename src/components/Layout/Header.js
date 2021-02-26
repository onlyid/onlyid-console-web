import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { ReactComponent as Logo } from "assets/logo.svg";
import { NavLink } from "react-router-dom";
import RightAccount from "./RightAccount";
import { connect } from "react-redux";
import MessageBox from "./MessageBox";
import http from "my/http";
import { eventEmitter } from "my/utils";
import classNames from "classnames";
import { Badge, IconButton, Tooltip } from "@material-ui/core";
import { Help as HelpIcon, Notifications as NotificationsIcon } from "@material-ui/icons";
import HelpDialog from "./HelpDialog";

const MENU_DATA = [
    { title: "统计概览", key: "statistics" },
    { title: "应用管理", key: "applications" },
    { title: "OTP记录", key: "otp-records" },
    { title: "用户管理", key: "users" },
    { title: "权限管理", key: "permissions" },
    { title: "行为日志", key: "behavior-logs" }
];

class Header extends PureComponent {
    state = {
        drawerVisible: false,
        dialogVisible: false
    };

    componentDidMount() {
        // 如果还在登录中，直接请求会报401，所以推迟一点
        setTimeout(this.getMessageCount, 2000);

        eventEmitter.on("message/onMarkRead", this.getMessageCount);
        eventEmitter.on("message/onDelete", this.getMessageCount);
    }

    getMessageCount = async () => {
        const { dispatch } = this.props;

        const { unread, total } = await http.get("messages/count");
        dispatch({ type: "message/save", payload: { unreadCount: unread, total } });
    };

    showDrawer = () => {
        this.setState({ drawerVisible: true });
    };

    closeDrawer = () => {
        this.setState({ drawerVisible: false });
    };

    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
    };

    render() {
        const { drawerVisible, dialogVisible } = this.state;
        const {
            admin: { tenantExpired },
            message: { unreadCount }
        } = this.props;

        return (
            <header className={styles.headerBg}>
                <div className={styles.header}>
                    <Tooltip title="打开官网">
                        <a href="https://www.onlyid.net" target="_blank" rel="noopener noreferrer">
                            <Logo style={{ fill: "#ddd", width: 75, verticalAlign: "middle" }} />
                        </a>
                    </Tooltip>
                    <ul
                        className={classNames(styles.menu, {
                            [styles.disabled]: tenantExpired
                        })}
                    >
                        {MENU_DATA.map(item => (
                            <li key={item.key}>
                                <NavLink to={`/${item.key}`}>{item.title}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.right}>
                        <IconButton
                            color="inherit"
                            className={styles.rightIconButton}
                            onClick={this.showDialog}
                        >
                            <HelpIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            className={styles.rightIconButton}
                            onClick={this.showDrawer}
                        >
                            <Badge badgeContent={unreadCount} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <RightAccount />
                    </div>
                </div>
                <HelpDialog onClose={this.closeDialog} visible={dialogVisible} />
                <MessageBox onClose={this.closeDrawer} visible={drawerVisible} />
            </header>
        );
    }
}

export default connect(({ admin, message }) => ({ admin, message }))(Header);

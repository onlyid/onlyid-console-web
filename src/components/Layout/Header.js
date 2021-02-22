import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { ReactComponent as Logo } from "assets/logo.svg";
import { NavLink, withRouter } from "react-router-dom";
import RightAccount from "./RightAccount";
import { connect } from "react-redux";
import MessageBox from "./MessageBox";
import http from "my/http";
import { eventEmitter } from "my/utils";
import classNames from "classnames";
import { Badge, IconButton, Tooltip } from "@material-ui/core";
import { Help as HelpIcon, Notifications as NotificationsIcon } from "@material-ui/icons";

const MENU_DATA = [
    { title: "统计概览", key: "statistics" },
    { title: "应用管理", key: "applications" },
    { title: "OTP记录", key: "otp-records" },
    { title: "用户管理", key: "users" },
    { title: "权限管理", key: "permissions" },
    { title: "行为日志", key: "behavior-logs" },
    { title: "租户设置", key: "tenant", hidden: true },
    { title: "站内信", key: "my-messages", hidden: true }
];

class Header extends PureComponent {
    state = {
        menuCurrent: null,
        drawerVisible: false
    };

    componentDidMount() {
        const { pathname } = this.props.location;
        const p = pathname.split("/")[1];
        this.setState({ menuCurrent: p });

        // 如果还在登录中，直接请求会报401，所以推迟一点
        setTimeout(this.getMessageCount, 2000);

        eventEmitter.on("message/onMarkRead", this.getMessageCount);
        eventEmitter.on("message/onDelete", this.getMessageCount);
    }

    componentDidUpdate(prevProps) {
        const { pathname } = this.props.location;
        if (prevProps.location.pathname === pathname) return;

        const p = pathname.split("/")[1];
        this.setState({ menuCurrent: p });
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

    render() {
        const { menuCurrent, drawerVisible } = this.state;
        const {
            admin: { tenantExpired },
            message: { unreadCount }
        } = this.props;

        const item = MENU_DATA.find(item => item.key === menuCurrent);

        return (
            <div className={styles.header}>
                <div className={styles.box1bg}>
                    <div className={styles.box1}>
                        <Tooltip title="打开官网">
                            <a
                                href="https://www.onlyid.net"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Logo
                                    style={{ fill: "#ddd", width: 75, verticalAlign: "middle" }}
                                />
                            </a>
                        </Tooltip>
                        <ul
                            className={classNames(styles.menu, {
                                [styles.disabled]: tenantExpired
                            })}
                        >
                            {MENU_DATA.filter(item => !item.hidden).map(item => (
                                <li key={item.key}>
                                    <NavLink to={`/${item.key}`}>{item.title}</NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.right}>
                            <IconButton color="inherit" className={styles.rightIconButton}>
                                <HelpIcon />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                className={styles.rightIconButton}
                                onClick={this.showDrawer}
                            >
                                <Badge badgeContent={unreadCount}>
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <RightAccount />
                        </div>
                    </div>
                </div>
                <div className={styles.box2bg}>
                    <div className={styles.box2}>
                        <div className={styles.left1}>
                            <span style={{ fontSize: 18 }}>{item && item.title}</span>
                            <div id="headerLeft" />
                        </div>
                        <div id="headerRight" />
                    </div>
                </div>
                <MessageBox onClose={this.closeDrawer} visible={drawerVisible} />
            </div>
        );
    }
}

export default connect(({ admin, message }) => ({ admin, message }))(withRouter(Header));

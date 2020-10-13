import React, { PureComponent } from "react";
import { Badge, Icon, Menu, Tooltip } from "antd";
import styles from "./index.module.css";
import logo from "assets/logo.svg";
import { withRouter } from "react-router-dom";
import RightAccount from "./RightAccount";
import { connect } from "react-redux";
import MessageBox from "./MessageBox";
import http from "my/http";
import { eventEmitter } from "my/utils";

const { Item } = Menu;

const MENU_DATA = [
    { title: "用户池", key: "user-pool" },
    { title: "组织机构", key: "org-manage" },
    { title: "应用管理", key: "app-manage" },
    { title: "权限管理", key: "res-manage" },
    { title: "角色管理", key: "role-manage" },
    { title: "统计数据", key: "statistics" },
    { title: "审计日志", key: "audit-logs" },
    { title: "系统设置", key: "admin", hidden: true },
    { title: "站内信", key: "messages", hidden: true }
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

    onMenuClick = ({ key }) => {
        const { history } = this.props;
        this.setState({ menuCurrent: key });
        history.push("/" + key);
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
                            <a href="https://www.onlyid.net" target="_blank">
                                <img src={logo} alt="logo" height="33" />
                            </a>
                        </Tooltip>
                        <Menu
                            onClick={this.onMenuClick}
                            selectedKeys={[menuCurrent]}
                            mode="horizontal"
                            className={styles.menu}
                            theme="dark"
                        >
                            {MENU_DATA.filter(item => !item.hidden).map(item => (
                                <Item key={item.key} disabled={tenantExpired}>
                                    {item.title}
                                </Item>
                            ))}
                        </Menu>
                        <div className={styles.right}>
                            <Tooltip title="文档">
                                <a
                                    href="https://www.onlyid.net/home/docs"
                                    target="_blank"
                                    className={styles.rightIcon}
                                >
                                    <Icon type="question-circle" />
                                </a>
                            </Tooltip>
                            <Badge
                                count={unreadCount}
                                className={styles.rightIcon}
                                onClick={this.showDrawer}
                            >
                                <Icon type="bell" />
                            </Badge>
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

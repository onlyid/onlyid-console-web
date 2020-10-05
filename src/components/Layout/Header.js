import React, { PureComponent } from "react";
import { Icon, Menu, Popover, Tooltip } from "antd";
import styles from "./index.module.css";
import logo from "assets/logo.svg";
import { withRouter } from "react-router-dom";
import RightAccount from "./RightAccount";
import { connect } from "react-redux";

const { Item } = Menu;

const MENU_DATA = [
    { title: "用户池", key: "user-pool" },
    { title: "组织机构", key: "org-manage" },
    { title: "应用管理", key: "app-manage" },
    { title: "权限管理", key: "res-manage" },
    { title: "角色管理", key: "role-manage" },
    { title: "统计数据", key: "statistics" },
    { title: "审计日志", key: "audit-logs" },
    { title: "系统设置", key: "admin", hidden: true }
];

class Header extends PureComponent {
    state = {
        menuCurrent: null
    };

    componentDidMount() {
        const { pathname } = this.props.location;
        const p = pathname.split("/")[1];
        this.setState({ menuCurrent: p });
    }

    componentDidUpdate(prevProps) {
        const { pathname } = this.props.location;
        if (prevProps.location.pathname === pathname) return;

        const p = pathname.split("/")[1];
        this.setState({ menuCurrent: p });
    }

    onMenuClick = ({ key }) => {
        const { history } = this.props;
        this.setState({ menuCurrent: key });
        history.push("/" + key);
    };

    render() {
        const { menuCurrent } = this.state;
        const {
            admin: { tenantExpired }
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
                            <Popover content="暂无新消息">
                                <Icon type="bell" className={styles.rightIcon} />
                            </Popover>
                            {/*<Badge count={5}>*/}
                            {/*    <Icon type="bell" className={styles.notification} />*/}
                            {/*</Badge>*/}
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
            </div>
        );
    }
}

export default connect(({ admin }) => ({ admin }))(withRouter(Header));

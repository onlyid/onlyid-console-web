import React, { PureComponent } from "react";
import { Badge, Icon, Menu, Popover } from "antd";
import styles from "./index.module.css";
import logo from "assets/logo.svg";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import RightAccount from "./RightAccount";

const { Item } = Menu;

const MENU_DATA = {
    userPool: "用户池",
    orgManage: "组织机构",
    appManage: "应用管理",
    resManage: "权限管理",
    roleManage: "角色管理",
    statistics: "统计数据",
    auditLog: "审计日志",
    admin: "系统管理"
};

class Header extends PureComponent {
    state = {
        menuCurrent: "userPool"
    };

    componentDidMount() {
        const { pathname } = this.props.location;
        const p = _.camelCase(pathname.split("/")[1]);
        if (p in MENU_DATA) {
            this.setState({ menuCurrent: p });
        }
    }

    componentDidUpdate(prevProps) {
        const { pathname } = this.props.location;
        if (prevProps.location.pathname === pathname) return;

        const p = _.camelCase(pathname.split("/")[1]);
        if (p in MENU_DATA) {
            this.setState({ menuCurrent: p });
        }
    }

    onMenuClick = ({ key }) => {
        const { history } = this.props;
        this.setState({ menuCurrent: key });
        history.push("/" + _.kebabCase(key));
    };

    render() {
        const { menuCurrent } = this.state;

        return (
            <div className={styles.header}>
                <div className={styles.box1bg}>
                    <div className={styles.box1}>
                        <a href="https://www.onlyid.net">
                            <img src={logo} alt="logo" height="33" />
                        </a>
                        <Menu
                            onClick={this.onMenuClick}
                            selectedKeys={[menuCurrent]}
                            mode="horizontal"
                            className={styles.menu}
                            theme="dark"
                        >
                            {Object.keys(MENU_DATA).map(key => (
                                <Item key={key}>{MENU_DATA[key]}</Item>
                            ))}
                        </Menu>
                        <div className={styles.right}>
                            <Popover content="暂无新消息">
                                <Icon type="bell" className={styles.notification} />
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
                            <span style={{ fontSize: 18 }}>{MENU_DATA[menuCurrent]}</span>
                            <div id="headerLeft" />
                        </div>
                        <div id="headerRight" />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);

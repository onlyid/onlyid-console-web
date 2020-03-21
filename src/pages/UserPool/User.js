import React, { PureComponent } from "react";
import { Menu, Icon, Modal, message } from "antd";
import Info from "./Info";
import UpdatePassword from "./UpdatePassword";
import LinkOrg from "./LinkOrg";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import styles from "./index.module.css";
import { eventEmitter } from "my/utils";
import { TYPE_LABEL } from "my/constants";

const { Item } = Menu;

class User extends PureComponent {
    state = {
        menuCurrent: "1",
        MENU_DATA: [
            {
                icon: "arrow-left",
                title: "返回用户池",
                key: "back",
                className: styles.backMenuItem
            },
            { icon: "info-circle", title: "用户详情" },
            { icon: "link", title: "关联组织机构" },
            { icon: "link", title: "关联岗位" },
            { icon: "link", title: "关联用户组" },
            { icon: "link", title: "关联角色" },
            { icon: "lock", title: "修改密码" },
            { icon: "delete", title: "移除", key: "delete" }
        ]
    };

    componentDidMount() {
        const {
            inOrg,
            orgManage: { selectedType }
        } = this.props;
        const { MENU_DATA } = this.state;

        if (inOrg) {
            MENU_DATA[0].title = `返回 [${TYPE_LABEL[selectedType]}]`;
            this.setState({ MENU_DATA: [...MENU_DATA] });
        }
    }

    componentDidUpdate(prevProps) {
        const {
            userPool: { selectedKey }
        } = this.props;

        if (selectedKey !== prevProps.userPool.selectedKey) this.setState({ menuCurrent: "1" });
    }

    back2info = () => {
        this.setState({ menuCurrent: "1" });
    };

    onMenuClick = ({ key }) => {
        if (key === "delete") {
            this.delete1();
        } else if (key === "back") {
            const { dispatch } = this.props;
            dispatch({ type: "userPool/save", payload: { selectedKey: null } });
            dispatch({ type: "orgManage/save", payload: { showUser: false } });
        } else {
            this.setState({ menuCurrent: key });
        }
    };

    delete1 = () => {
        Modal.confirm({
            content: "将用户从用户池移除（但不会物理删除该用户），确定移除？",
            okType: "danger",
            onOk: async () => {
                const {
                    dispatch,
                    userPool: { selectedKey }
                } = this.props;
                await http.post("users/unlink-tenant", { userId: selectedKey });

                dispatch({ type: "orgManage/save", payload: { showUser: false } });
                message.success("移除成功");
                eventEmitter.emit("userPool/refresh", true);
            }
        });
    };

    render() {
        const { menuCurrent, MENU_DATA } = this.state;

        let right;
        switch (menuCurrent) {
            case "1":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <Info />
                    </Card>
                );
                break;
            case "2":
                right = <LinkOrg key="ORG" type="ORG" />;
                break;
            case "3":
                right = <LinkOrg key="POSITION" type="POSITION" />;
                break;
            case "4":
                right = <LinkOrg key="USER_GROUP" type="USER_GROUP" />;
                break;
            case "5":
                right = <LinkOrg key="ROLE" type="ROLE" />;
                break;
            default:
                // 6
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <UpdatePassword onClose={this.back2info} />
                    </Card>
                );
        }

        return (
            <div className={styles.user}>
                <div>
                    <Menu
                        onClick={this.onMenuClick}
                        selectedKeys={[menuCurrent]}
                        className="ctrlMenu"
                    >
                        {MENU_DATA.map((item, index) => (
                            <Item key={item.key || String(index)} className={item.className}>
                                <Icon type={item.icon} />
                                {item.title}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div className={styles.right}>{right}</div>
            </div>
        );
    }
}

export default connect(({ userPool, orgManage }) => ({ userPool, orgManage }))(User);

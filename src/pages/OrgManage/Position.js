import React, { PureComponent } from "react";
import { Icon, Menu, message, Modal } from "antd";
import Info from "./Info";
import LinkUser from "./LinkUser";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import { eventEmitter } from "my/utils";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "岗位详情" },
    { icon: "link", title: "关联用户" },
    { icon: "delete", title: "删除", key: "delete" }
];

class Position extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            orgManage: { selectedKey }
        } = this.props;
        if (prevProps.orgManage.selectedKey !== selectedKey) this.back2info();
    }

    onMenuClick = ({ key }) => {
        if (key === "delete") {
            this.delete1();
        } else {
            this.setState({ menuCurrent: key });
        }
    };

    delete1 = () => {
        Modal.confirm({
            content: "删除后不可恢复，确认删除？",
            okText: "删除",
            cancelText: "取消",
            okType: "danger",
            onOk: async () => {
                const {
                    orgManage: { selectedKey }
                } = this.props;
                await http.delete("org-nodes/" + selectedKey);

                message.success("删除成功");
                eventEmitter.emit("orgManage/initTree", {
                    selectNode: "neighbor"
                });
            }
        });
    };

    back2info = () => {
        this.setState({ menuCurrent: "0" });
    };

    render() {
        const {
            orgManage: { showUser }
        } = this.props;
        if (showUser) return null;

        const { menuCurrent } = this.state;

        let right;
        switch (menuCurrent) {
            case "0":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <Info />
                    </Card>
                );
                break;
            default:
                // 1
                right = <LinkUser type="POSITION" />;
        }

        return (
            <>
                <div>
                    <Menu
                        onClick={this.onMenuClick}
                        selectedKeys={[menuCurrent]}
                        className="ctrlMenu"
                    >
                        {MENU_DATA.map((item, index) => (
                            <Item key={item.key || String(index)}>
                                <Icon type={item.icon} />
                                {item.title}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div>{right}</div>
            </>
        );
    }
}

export default connect(({ orgManage }) => ({ orgManage }))(Position);

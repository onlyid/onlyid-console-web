import React, { PureComponent } from "react";
import { Icon, Menu, message, Modal } from "antd";
import Info from "./Info";
import AddOrEdit from "../Role/AddOrEdit";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import { eventEmitter } from "my/utils";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "角色组详情" },
    { icon: "plus-circle", title: "新建角色" },
    { icon: "delete", title: "删除", key: "delete" }
];

class RoleGroup extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            roleManage: { selectedKey }
        } = this.props;
        if (prevProps.roleManage.selectedKey !== selectedKey) this.back2info();
    }

    onSelect = ({ key }) => {
        if (key === "delete") {
            this.delete1();
        } else {
            this.setState({ menuCurrent: key });
        }
    };

    delete1 = () => {
        Modal.confirm({
            content: "删除后不可恢复，确定删除？",
            okType: "danger",
            onOk: async () => {
                const {
                    roleManage: { selectedKey }
                } = this.props;
                await http.delete("roles/groups/" + selectedKey);

                message.success("删除成功");
                eventEmitter.emit("roleManage/initTree", { select: "neighbor" });
            }
        });
    };

    back2info = () => {
        this.setState({ menuCurrent: "0" });
    };

    render() {
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
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <AddOrEdit onSave={this.back2info} onCancel={this.back2info} />
                    </Card>
                );
        }

        return (
            <>
                <div>
                    <Menu
                        onSelect={this.onSelect}
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

export default connect(({ roleManage }) => ({ roleManage }))(RoleGroup);
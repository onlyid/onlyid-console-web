import React, { PureComponent } from "react";
import { Menu, Icon, Modal, message } from "antd";
import Info from "./Info";
import AddOrEdit from "./AddOrEdit";
import LinkUser from "./LinkUser";
import { connect } from "react-redux";
import http from "../../http";
import Card from "../../components/Card";
import { eventEmitter } from "../../utils";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "组织机构详情" },
    { icon: "plus-circle", title: "新建组织机构" },
    { icon: "plus-circle", title: "新建岗位" },
    { icon: "plus-circle", title: "新建用户组" },
    { icon: "link", title: "关联用户" },
    { icon: "delete", title: "删除", key: "delete" }
];

class Org extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate({ orgManage: { selectedKey } }) {
        if (selectedKey !== this.props.orgManage.selectedKey) this.setState({ menuCurrent: "0" });
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
            content: "删除后不可恢复，确定删除？",
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
            case "1":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <AddOrEdit type="ORG" onSave={this.back2info} onCancel={this.back2info} />
                    </Card>
                );
                break;
            case "2":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <AddOrEdit
                            type="POSITION"
                            onSave={this.back2info}
                            onCancel={this.back2info}
                        />
                    </Card>
                );
                break;
            case "3":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <AddOrEdit
                            type="USER_GROUP"
                            onSave={this.back2info}
                            onCancel={this.back2info}
                        />
                    </Card>
                );
                break;
            default:
                // 4
                right = <LinkUser type="ORG" />;
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

export default connect(({ orgManage }) => ({ orgManage }))(Org);

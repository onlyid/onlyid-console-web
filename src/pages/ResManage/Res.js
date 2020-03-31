import React, { PureComponent } from "react";
import { Icon, Menu, message, Modal } from "antd";
import Info from "./Info";
import AddOrEdit from "./AddOrEdit";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import { eventEmitter } from "my/utils";
import Operation from "./Operation";

const { Item } = Menu;

const MENU_DATA = [
    { icon: "info-circle", title: "资源详情" },
    { icon: "plus-circle", title: "新建资源" },
    { icon: "number", title: "操作类型" },
    { icon: "delete", title: "删除", key: "delete" }
];

class Org extends PureComponent {
    state = {
        menuCurrent: "0"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            resManage: { selectedKey }
        } = this.props;
        if (prevProps.resManage.selectedKey !== selectedKey) this.back2info();
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
                    resManage: { selectedKey }
                } = this.props;
                await http.delete("res-nodes/" + selectedKey);

                message.success("删除成功");
                eventEmitter.emit("resManage/initTree", { selectNode: "neighbor" });
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
                        <AddOrEdit onSave={this.back2info} onCancel={this.back2info} />
                    </Card>
                );
                break;
            default:
                // 2
                right = <Operation />;
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

export default connect(({ resManage }) => ({ resManage }))(Org);

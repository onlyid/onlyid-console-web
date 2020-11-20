import React, { PureComponent } from "react";
import { message, Modal } from "antd";
import Info from "./Info";
import UpdatePassword from "./UpdatePassword";
import LinkOrg from "./LinkOrg";
import LinkRole from "./LinkRole";
import { connect } from "react-redux";
import http from "my/http";
import Card from "components/Card";
import { eventEmitter } from "my/utils";
import { TYPE_LABEL } from "my/constants";
import CtrlMenu from "components/CtrlMenu";
import UserExtra from "./UserExtra";
import RawJson from "./RawJson";

const MENU_DATA = [
    { title: "", key: "back" },
    { icon: "info-circle", title: "用户账号详情" },
    { icon: "info-circle", title: "用户附加信息" },
    { icon: "info-circle", title: "预览 JSON" },
    { icon: "link", title: "关联组织机构" },
    { icon: "link", title: "关联角色" },
    { icon: "lock", title: "修改密码" },
    { title: "移除用户", key: "delete" }
];

class User extends PureComponent {
    state = {
        menuCurrent: "1"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            userPool: { selectedKey }
        } = this.props;
        if (prevProps.userPool.selectedKey !== selectedKey) this.back2info();
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
        const { menuCurrent } = this.state;
        const {
            inOrg,
            orgManage: { selectedType },
            userPool: { isCreator }
        } = this.props;

        if (inOrg) MENU_DATA[0].title = `返回【${TYPE_LABEL[selectedType]}】`;
        else MENU_DATA[0].title = "返回用户列表";

        MENU_DATA[6].disabled = !isCreator;

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
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <UserExtra />
                    </Card>
                );
                break;
            case "3":
                right = (
                    <Card title={MENU_DATA[menuCurrent].title}>
                        <RawJson />
                    </Card>
                );
                break;
            case "4":
                right = <LinkOrg />;
                break;
            case "5":
                right = <LinkRole />;
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
            <>
                <div>
                    <CtrlMenu data={MENU_DATA} current={menuCurrent} onClick={this.onMenuClick} />
                </div>
                <div>{right}</div>
            </>
        );
    }
}

export default connect(({ userPool, orgManage }) => ({ userPool, orgManage }))(User);

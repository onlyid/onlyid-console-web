import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Button, Drawer, Empty } from "antd";
import AddOrEdit from "./AddOrEdit";
import TreeMenu from "./TreeMenu";
import styles from "./index.module.css";
import { connect } from "react-redux";
import Org from "./Org";
import Position from "./Position";
import UserGroup from "./UserGroup";
import User from "../UserPool/User";

class OrgManage extends PureComponent {
    state = {
        drawerVisible: false
    };

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({ type: "orgManage/save", payload: { showUser: false } });
    }

    showAdd = () => {
        this.setState({ drawerVisible: true });
    };

    closeAdd = () => {
        this.setState({ drawerVisible: false });
    };

    render() {
        const { drawerVisible } = this.state;
        const {
            orgManage: { showEmpty, selectedType, showUser }
        } = this.props;

        const portalNode = window.document.getElementById("headerPortal");

        const createNew = (
            <Button onClick={this.showAdd} icon="plus" type="primary">
                新建顶级组织机构
            </Button>
        );

        let right = null;
        switch (selectedType) {
            case "ORG":
                right = <Org />;
                break;
            case "USER_GROUP":
                right = <UserGroup />;
                break;
            case "POSITION":
                right = <Position />;
                break;
            default:
            // do nothing
        }

        const content = showEmpty ? (
            <div className="emptyBox">
                <Empty description="暂无组织机构，请新建">{createNew}</Empty>
            </div>
        ) : (
            <>
                <TreeMenu />
                {right}
                {showUser && <User inOrg />}
            </>
        );

        return (
            <div className={styles.orgManage}>
                {portalNode && ReactDOM.createPortal(createNew, portalNode)}
                <Drawer
                    title="新建顶级组织机构"
                    placement="right"
                    onClose={this.closeAdd}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit type="TOP_ORG" onSave={this.closeAdd} onCancel={this.closeAdd} />
                </Drawer>
                {content}
            </div>
        );
    }
}

export default connect(({ orgManage }) => ({ orgManage }))(OrgManage);

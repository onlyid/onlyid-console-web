import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.css";
import AppSelect1 from "components/AppSelect";
import { connect } from "react-redux";
import { Button, Drawer, Empty } from "antd";
import Role from "./Role";
import RoleGroup from "./RoleGroup";
import TreeMenu from "./TreeMenu";
import AddOrEdit from "./RoleGroup/AddOrEdit";

const AppSelect = connect(
    state => ({ selectedApp: state.roleManage.selectedApp }),
    dispatch => ({ savePayload: payload => dispatch({ type: "roleManage/save", payload }) })
)(AppSelect1);

class RoleManage extends PureComponent {
    state = {
        drawerVisible: false
    };

    componentDidMount() {
        this.forceUpdate();
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
            roleManage: { selectedApp, showEmpty, groupId }
        } = this.props;

        const headerLeft = document.getElementById("headerLeft");
        const headerRight = document.getElementById("headerRight");

        const createNew = (
            <Button onClick={this.showAdd} icon="plus" type="primary">
                新建角色组
            </Button>
        );

        const right = groupId ? <Role /> : <RoleGroup />;

        const content = showEmpty ? (
            <div className="emptyBox">
                {selectedApp ? (
                    <Empty description="暂无角色组，请新建">{createNew}</Empty>
                ) : (
                    <Empty description="暂无应用，请到应用管理页新建" />
                )}
            </div>
        ) : (
            <>
                <div>
                    <TreeMenu />
                </div>
                {right}
            </>
        );

        return (
            <div className={styles.roleManage}>
                {headerLeft && ReactDOM.createPortal(<AppSelect />, headerLeft)}
                {headerRight && ReactDOM.createPortal(createNew, headerRight)}
                <Drawer
                    title="新建角色组"
                    placement="right"
                    onClose={this.closeAdd}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit onSave={this.closeAdd} onCancel={this.closeAdd} />
                </Drawer>
                {content}
            </div>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(RoleManage);

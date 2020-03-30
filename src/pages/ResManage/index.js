import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.css";
import AppSelect from "./AppSelect";
import { connect } from "react-redux";
import { Button, Drawer, Empty } from "antd";
import Res from "./Res";
import TreeMenu from "./TreeMenu";
import AddOrEdit from "./AddOrEdit";

class ResManage extends PureComponent {
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
            resManage: { selectedApp, showEmpty }
        } = this.props;

        const headerLeft = document.getElementById("headerLeft");
        const headerRight = document.getElementById("headerRight");

        const createNew = (
            <Button onClick={this.showAdd} icon="plus" type="primary">
                新建权限
            </Button>
        );

        const content = showEmpty ? (
            <div className="emptyBox">
                {selectedApp ? (
                    <Empty description="暂无权限，请新建">{createNew}</Empty>
                ) : (
                    <Empty description="暂无应用，请到应用管理页新建" />
                )}
            </div>
        ) : (
            <>
                <div>
                    <TreeMenu />
                </div>
                <Res />
            </>
        );

        return (
            <div className={styles.resManage}>
                {headerLeft && ReactDOM.createPortal(<AppSelect />, headerLeft)}
                {headerRight && ReactDOM.createPortal(createNew, headerRight)}
                <Drawer
                    title="新建权限"
                    placement="right"
                    onClose={this.closeAdd}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit isTop onSave={this.closeAdd} onCancel={this.closeAdd} />
                </Drawer>
                {content}
            </div>
        );
    }
}

export default connect(({ resManage }) => ({ resManage }))(ResManage);

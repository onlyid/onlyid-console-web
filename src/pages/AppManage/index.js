import React, { PureComponent } from "react";
import styles from "./index.module.css";
import ReactDOM from "react-dom";
import { Button, Drawer, Empty } from "antd";
import AddOrEdit from "./AddOrEdit";
import AppMenu from "./AppMenu";
import App from "./App";

class AppManage extends PureComponent {
    state = {
        drawerVisible: false,
        showEmpty: false
    };

    componentDidMount() {
        this.forceUpdate();
    }

    showAdd = () => {
        this.setState({ drawerVisible: true });
    };

    cancelAdd = () => {
        this.setState({ drawerVisible: false });
    };

    saveAdd = () => {
        this.setState({ drawerVisible: false, showEmpty: false });
    };

    render() {
        const { drawerVisible, showEmpty } = this.state;

        const portalNode = window.document.getElementById("headerRight");

        const createNew = (
            <Button onClick={this.showAdd} icon="plus" type="primary">
                新建应用
            </Button>
        );

        const content = showEmpty ? (
            <div className="emptyBox">
                <Empty description="暂无应用，请新建">{createNew}</Empty>
            </div>
        ) : (
            <>
                <div>
                    <AppMenu onShowEmptyChange={showEmpty => this.setState({ showEmpty })} />
                </div>
                <App />
            </>
        );

        return (
            <div className={styles.appManage}>
                {portalNode && ReactDOM.createPortal(createNew, portalNode)}
                <Drawer
                    title="新建应用"
                    placement="right"
                    onClose={this.cancelAdd}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit onSave={this.saveAdd} onCancel={this.cancelAdd} />
                </Drawer>
                {content}
            </div>
        );
    }
}

export default AppManage;

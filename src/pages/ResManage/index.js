import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.css";
import AppSelect from "./AppSelect";
import { connect } from "react-redux";
import { Button, Empty } from "antd";
import Res from "./Res";
import TreeMenu from "./TreeMenu";

class ResManage extends PureComponent {
    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const {
            appManage: { selectedApp, showEmpty }
        } = this.props;

        const portalNode1 = document.getElementById("headerPortal1");

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
                {portalNode1 && ReactDOM.createPortal(<AppSelect />, portalNode1)}
                {content}
            </div>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(ResManage);

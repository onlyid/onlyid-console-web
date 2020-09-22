import React, { PureComponent } from "react";
import styles from "./index.module.css";
import ReactDOM from "react-dom";
import { Button, Drawer, Empty, Modal } from "antd";
import AddOrEdit from "./AddOrEdit";
import AppMenu1 from "components/AppMenu";
import App from "./App";
import { connect } from "react-redux";

const AppMenu = connect(
    state => ({ selectedKey: state.appManage.selectedKey }),
    dispatch => ({ savePayload: payload => dispatch({ type: "appManage/save", payload }) })
)(AppMenu1);

function GuideDialog(props) {
    const { visible, onClose } = props;

    return (
        <Modal
            visible={visible}
            title="接入引导"
            footer={[
                <Button key="ok" onClick={onClose}>
                    关闭
                </Button>
            ]}
            onCancel={onClose}
        >
            <p>已新建第一个应用，接下来你可能想：</p>
            <p className={styles.guideText}>
                <i className="material-icons">star_half</i>
                使用唯ID OTP 发送无限量短信验证码：
            </p>
            <div className={styles.guideButtonBox}>
                <a href="https://www.onlyid.net/home/docs/otp" target="_blank">
                    <Button type="link" icon="question-circle">
                        使用文档
                    </Button>
                </a>
            </div>
            <p className={styles.guideText}>
                <i className="material-icons">star</i>
                接入唯ID SSO 彻底解耦认证和业务，把琐事交给唯ID：
            </p>
            <div className={styles.guideButtonBox}>
                <a href="https://www.onlyid.net/home/docs/sso/web" target="_blank">
                    <Button type="link" icon="question-circle">
                        网站接入文档
                    </Button>
                </a>
                <a href="https://www.onlyid.net/home/docs/sso/android" target="_blank">
                    <Button type="link" icon="question-circle">
                        Android接入文档
                    </Button>
                </a>
                <a href="https://www.onlyid.net/home/docs/sso/ios" target="_blank">
                    <Button type="link" icon="question-circle">
                        iOS接入文档
                    </Button>
                </a>
            </div>
        </Modal>
    );
}

class AppManage extends PureComponent {
    state = {
        drawerVisible: false,
        showEmpty: false,
        dialogVisible: false
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
        const { showEmpty } = this.state;
        if (showEmpty) this.setState({ dialogVisible: true });

        this.setState({ drawerVisible: false, showEmpty: false });
    };

    render() {
        const { drawerVisible, showEmpty, dialogVisible } = this.state;

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
                <GuideDialog
                    visible={dialogVisible}
                    onClose={() => this.setState({ dialogVisible: false })}
                />
            </div>
        );
    }
}

export default AppManage;

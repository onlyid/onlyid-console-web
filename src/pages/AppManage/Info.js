import React, { PureComponent } from "react";
import { Descriptions, Button } from "antd";
import http from "my/http";
import AddOrEdit from "./AddOrEdit";
import { connect } from "react-redux";
import styles from "./index.module.css";
import { CLIENT_TYPE_TEXT } from "my/constants";

const { Item } = Descriptions;

class Info extends PureComponent {
    state = {
        info: {},
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps) {
        const {
            appManage: { selectedKey: prevSelectedKey }
        } = prevProps;
        const {
            appManage: { selectedKey }
        } = this.props;
        if (prevSelectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const {
            appManage: { selectedKey }
        } = this.props;

        if (!selectedKey) return;

        const info = await http.get("clients/" + selectedKey);
        this.setState({ info });
    };

    showEdit = () => {
        this.setState({ isEdit: true });
    };

    onSave = () => {
        this.setState({ isEdit: false });
        this.initData();
    };

    onCancel = () => {
        this.setState({ isEdit: false });
    };

    render() {
        const { info, isEdit } = this.state;

        if (isEdit) return <AddOrEdit info={info} onSave={this.onSave} onCancel={this.onCancel} />;

        return (
            <>
                <div style={{ marginBottom: 20 }}>
                    <img src={info.iconUrl} alt="icon" className={styles.infoIcon} />
                </div>
                <Descriptions column={1} layout="vertical" colon={false}>
                    <Item label="应用名称">{info.name}</Item>
                    <Item label="应用类型">{CLIENT_TYPE_TEXT[info.type]}</Item>
                    <Item label="应用描述">{info.description || "-"}</Item>
                </Descriptions>
                <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
                    编辑
                </Button>
            </>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(Info);

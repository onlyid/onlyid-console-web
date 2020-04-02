import React, { PureComponent } from "react";
import { Descriptions, Button } from "antd";
import http from "my/http";
import AddOrEdit from "./AddOrEdit";
import { connect } from "react-redux";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";

const { Item } = Descriptions;

class Info extends PureComponent {
    state = {
        info: {},
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            roleManage: { selectedKey }
        } = this.props;
        if (prevProps.roleManage.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const {
            roleManage: { selectedKey }
        } = this.props;

        const info = await http.get("roles/" + selectedKey);
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
                <Descriptions column={1} layout="vertical" colon={false}>
                    <Item label="角色名称">{info.name}</Item>
                    <Item label="角色描述">{info.description || "-"}</Item>
                    <Item label="所属角色组">{info.group && info.group.name}</Item>
                    <Item label="创建日期">{moment(info.createDate).format(DATE_TIME_FORMAT)}</Item>
                </Descriptions>
                <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
                    编辑
                </Button>
            </>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(Info);

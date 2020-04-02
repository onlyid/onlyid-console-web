import React, { PureComponent } from "react";
import { Descriptions, Button } from "antd";
import http from "my/http";
import AddOrEdit from "./AddOrEdit";
import { connect } from "react-redux";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../my/constants";

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
            resManage: { selectedKey }
        } = this.props;
        if (prevProps.resManage.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const {
            resManage: { selectedKey }
        } = this.props;
        if (!selectedKey) return;

        const info = await http.get("res-nodes/" + selectedKey);
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
                    <Item label="资源名称">{info.name}</Item>
                    <Item label="资源描述">{info.description || "-"}</Item>
                    <Item label="上级资源">{info.parent && info.parent.name}</Item>
                    <Item label="是否菜单">{info.isMenu ? "是" : "否"}</Item>
                    <Item label="资源uri" className="uri">
                        {info.uri || "-"}
                    </Item>
                    <Item label="创建日期">{moment(info.createDate).format(DATE_TIME_FORMAT)}</Item>
                </Descriptions>
                <Button onClick={this.showEdit} style={{ marginTop: 10, marginBottom: 24 }}>
                    编辑
                </Button>
            </>
        );
    }
}

export default connect(({ resManage }) => ({ resManage }))(Info);

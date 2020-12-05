import React, { PureComponent } from "react";
import { Button, Descriptions, Tooltip } from "antd";
import http from "my/http";
import AddOrEdit from "./AddOrEdit";
import { connect } from "react-redux";
import { DATE_FORMAT, DATE_TIME_FORMAT, GENDER_TEXT } from "my/constants";
import Avatar from "components/Avatar";
import { eventEmitter } from "my/utils";
import moment from "moment";

const { Item } = Descriptions;

class Info extends PureComponent {
    state = {
        info: {},
        isEdit: false
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate({ userPool: { selectedKey } }) {
        if (this.props.userPool.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const info = await http.get("users/" + this.props.userPool.selectedKey);
        this.setState({ info });
    };

    showEdit = () => {
        this.setState({ isEdit: true });
    };

    onSave = () => {
        this.setState({ isEdit: false });
        this.initData();
        eventEmitter.emit("userPool/refresh");
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
                    <Avatar url={info.avatarUrl} />
                </div>
                <Descriptions column={1} layout="vertical" colon={false}>
                    <Item label="昵称">{info.nickname}</Item>
                    <Item label="手机号">{info.mobile || "-"}</Item>
                    <Item label="邮箱">{info.email || "-"}</Item>
                    <Item label="性别">{info.gender ? GENDER_TEXT[info.gender] : "-"}</Item>
                    <Item label="生日">
                        {info.birthday ? moment(info.birthday).format(DATE_FORMAT) : "-"}
                    </Item>
                    <Item label="地区">
                        {info.location ? info.location.split(" ").join("-") : "-"}
                    </Item>
                    <Item label="简介">{info.bio || "-"}</Item>
                    <Item label="创建日期">{moment(info.createDate).format(DATE_TIME_FORMAT)}</Item>
                </Descriptions>
                <Tooltip title={info.activated && "该用户不是你创建的或者已经激活，你不能编辑"}>
                    <Button
                        onClick={this.showEdit}
                        style={{ marginTop: 10, marginBottom: 24 }}
                        disabled={info.activated}
                    >
                        编辑
                    </Button>
                </Tooltip>
            </>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(Info);

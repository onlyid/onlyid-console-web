import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Input, message, Modal } from "antd";
import http from "my/http";
import NoCard from "components/NoCard";
import SelectRoleDialog from "./SelectRoleDialog";

const { Search } = Input;

class LinkRole extends PureComponent {
    columns = [
        {
            title: "名称",
            dataIndex: "name"
        },
        {
            title: "描述",
            dataIndex: "description",
            ellipsis: true
        },
        {
            title: "所属角色组",
            dataIndex: "group.name"
        },
        {
            title: "操作",
            dataIndex: "id",
            render: value => {
                return (
                    <Button
                        onClick={() => this.delete1(value)}
                        icon="delete"
                        shape="circle"
                        type="danger"
                        className="buttonPlain"
                    />
                );
            }
        }
    ];

    state = {
        list: [],
        keyword: "",
        loading: true,
        dialogVisible: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { keyword } = this.state;
        const {
            userPool: { selectedKey }
        } = this.props;
        const params = { keyword, userId: selectedKey };
        const list = await http.get("roles", { params });

        this.setState({ list, loading: false });
    };

    delete1 = roleId => {
        Modal.confirm({
            content: "确定移除？",
            okType: "danger",
            onOk: async () => {
                const {
                    userPool: { selectedKey }
                } = this.props;
                const params = { userId: selectedKey, roleId };
                await http.delete("roles/user-links", { params });

                message.success("移除成功");
                this.initData();
            }
        });
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    onSelect = async roleId => {
        const {
            userPool: { selectedKey }
        } = this.props;

        await http.post("roles/user-links", { userId: selectedKey, roleId });

        message.success("保存成功");
        this.setState({ dialogVisible: false });
        this.initData();
    };

    onCancel = () => {
        this.setState({ dialogVisible: false });
    };

    render() {
        const { list, loading, dialogVisible } = this.state;

        return (
            <NoCard
                title="关联角色列表"
                right={
                    <Button
                        onClick={() => this.setState({ dialogVisible: true })}
                        type="primary"
                        icon="plus"
                    >
                        关联更多
                    </Button>
                }
            >
                <Search
                    onSearch={this.onSearch}
                    placeholder="搜索角色名称"
                    enterButton
                    style={{ marginBottom: 20 }}
                />
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={this.columns}
                    loading={loading}
                    pagination={false}
                />
                <SelectRoleDialog
                    visible={dialogVisible}
                    onCancel={this.onCancel}
                    onSelect={this.onSelect}
                />
            </NoCard>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(LinkRole);

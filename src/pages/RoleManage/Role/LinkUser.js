import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Input, message, Modal } from "antd";
import http from "my/http";
import SelectUserDialog from "components/SelectUserDialog";
import Avatar from "components/Avatar";
import NoCard from "components/NoCard";

const { Search } = Input;

class LinkUser extends PureComponent {
    columns = [
        {
            title: "头像",
            dataIndex: "avatarUrl",
            width: 70,
            render: value => <Avatar url={value} width={40} />
        },
        {
            title: "昵称",
            dataIndex: "nickname",
            ellipsis: true
        },
        {
            title: "手机号",
            dataIndex: "mobile",
            ellipsis: true
        },
        {
            title: "邮箱",
            dataIndex: "email",
            ellipsis: true
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
        current: 1,
        pageSize: 10,
        total: 0,
        keyword: "",
        loading: true,
        dialogVisible: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const {
            roleManage: { selectedKey }
        } = this.props;
        const params = { current, pageSize, keyword, roleId: selectedKey };

        const { list, total } = await http.get("users", { params });

        if (list.length || current === 1) this.setState({ list, total, loading: false });
        else this.setState({ current: current - 1 }, this.initData);
    };

    delete1 = id => {
        Modal.confirm({
            content: "确定移除？",
            okType: "danger",
            onOk: async () => {
                const {
                    roleManage: { selectedKey }
                } = this.props;
                await http.delete("roles/user-links", {
                    params: { userId: id, roleId: selectedKey }
                });

                message.success("移除成功");
                this.initData();
            }
        });
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, this.initData);
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
        this.initData();
    };

    onSelect = async userId => {
        const {
            roleManage: { selectedKey, selectedApp }
        } = this.props;

        await http.post("roles/user-links", {
            userId,
            roleId: selectedKey,
            clientId: selectedApp.id
        });

        message.success("保存成功");
    };

    render() {
        const { list, current, pageSize, total, loading, dialogVisible } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <NoCard
                title="关联用户列表"
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
                    placeholder="搜索昵称、手机号、邮箱"
                    enterButton
                    style={{ marginBottom: 20 }}
                />
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={this.columns}
                    loading={loading}
                    pagination={pagination}
                    onChange={this.onChange}
                />
                <SelectUserDialog
                    visible={dialogVisible}
                    onClose={this.closeDialog}
                    onSelect={this.onSelect}
                />
            </NoCard>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(LinkUser);

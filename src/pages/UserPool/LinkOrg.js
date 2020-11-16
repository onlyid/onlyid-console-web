import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Input, message, Modal } from "antd";
import http from "my/http";
import SelectOrgDialog from "./SelectOrgDialog";
import { TYPE_LABEL } from "my/constants";
import NoCard from "components/NoCard";

const { Search } = Input;

class LinkOrg extends PureComponent {
    columns = [
        {
            title: "名称",
            dataIndex: "name",
            ellipsis: true
        },
        {
            title: "描述",
            dataIndex: "description",
            ellipsis: true
        },
        {
            title: "上级机构",
            dataIndex: "parent.name",
            ellipsis: true
        },
        {
            title: "类型",
            dataIndex: "type",
            width: 90,
            render: value => TYPE_LABEL[value]
        },
        {
            title: "操作",
            dataIndex: "id",
            width: 80,
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

        const list = await http.get("org-nodes/by-user-link", { params });
        this.setState({ list, loading: false });
    };

    delete1 = id => {
        Modal.confirm({
            content: "确定移除？",
            okType: "danger",
            onOk: async () => {
                const {
                    userPool: { selectedKey }
                } = this.props;
                await http.post("org-nodes/unlink-user", {
                    userId: selectedKey,
                    orgNodeId: id
                });

                message.success("移除成功");
                this.initData();
            }
        });
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    onSelect = async orgNodeId => {
        const {
            userPool: { selectedKey: userId }
        } = this.props;
        await http.post("org-nodes/link-user", { userId, orgNodeId });

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
                title="关联组织机构列表"
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
                    placeholder="搜索机构、岗位、用户组名称"
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
                <SelectOrgDialog
                    visible={dialogVisible}
                    onCancel={this.onCancel}
                    onSelect={this.onSelect}
                />
            </NoCard>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(LinkOrg);

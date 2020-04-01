import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Input, message, Modal } from "antd";
import http from "my/http";
import TreeLinkDialog from "./TreeLinkDialog";
import { TYPE_LABEL } from "my/constants";
import NoCard from "components/NoCard";

const { Search } = Input;

class LinkOrg extends PureComponent {
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
            title: "上级组织机构",
            dataIndex: "parent.name"
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
            userPool: { selectedKey },
            type
        } = this.props;
        const params = { keyword, userId: selectedKey, type };

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

    closeDialog = refresh => {
        this.setState({ dialogVisible: false });
        if (refresh) this.initData();
    };

    render() {
        const { list, loading, dialogVisible } = this.state;
        const { type } = this.props;

        return (
            <NoCard
                title={`关联${TYPE_LABEL[type]}列表`}
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
                    placeholder={`搜索${TYPE_LABEL[type]}名称`}
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
                <TreeLinkDialog visible={dialogVisible} type={type} onClose={this.closeDialog} />
            </NoCard>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(LinkOrg);

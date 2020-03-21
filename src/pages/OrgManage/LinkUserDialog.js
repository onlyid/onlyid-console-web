import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Empty, Input, message, Modal } from "antd";
import http from "my/http";
import Avatar from "components/Avatar";
import Table from "components/Table";

const { Search } = Input;

class LinkUserDialog extends PureComponent {
    columns = [
        {
            title: "头像",
            dataIndex: "avatarUrl",
            render: value => <Avatar url={value} width={40} />
        },
        {
            title: "昵称",
            dataIndex: "nickname"
        },
        {
            title: "手机号",
            dataIndex: "mobile"
        },
        {
            title: "邮箱",
            dataIndex: "email"
        },
        {
            title: "操作",
            dataIndex: "id",
            render: value => {
                return (
                    <Button
                        onClick={() => this.link(value)}
                        icon="plus"
                        shape="circle"
                        type="primary"
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
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    cancel = () => {
        const { onClose } = this.props;
        onClose();
    };

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const params = { current, pageSize, keyword };

        const { list, total } = await http.get("users", { params });

        if (list.length || current === 1) this.setState({ list, total, loading: false });
        else this.setState({ current: current - 1 }, this.initData);
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, this.initData);
    };

    link = async userId => {
        const {
            orgManage: { selectedKey: orgNodeId }
        } = this.props;

        await http.post("org-nodes/link-user", { userId, orgNodeId });

        message.success("保存成功");
    };

    render() {
        const { list, current, pageSize, total, loading } = this.state;
        const { visible } = this.props;

        const pagination = { current, pageSize, total };

        return (
            <Modal
                visible={visible}
                title="关联更多"
                onCancel={this.cancel}
                footer={false}
                width={800}
            >
                {list.length || loading ? (
                    <>
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
                            pagination={pagination}
                            loading={loading}
                            onChange={this.onChange}
                        />
                    </>
                ) : (
                    <Empty description={`暂无用户，请到用户池页新建`} />
                )}
            </Modal>
        );
    }
}

export default connect(({ orgManage }) => ({ orgManage }))(LinkUserDialog);

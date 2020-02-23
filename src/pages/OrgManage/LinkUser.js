import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "../../components/Table";
import { Button, Input, message, Modal } from "antd";
import http from "../../http";
import styles from "./index.module.css";
import LinkUserDialog from "./LinkUserDialog";
import Avatar from "../../components/Avatar";

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
                    <>
                        <Button
                            onClick={() => this.delete1(value)}
                            icon="delete"
                            shape="circle"
                            type="danger"
                            className="buttonPlain"
                        />
                        <Button
                            onClick={() => this.onAction(value)}
                            icon="arrow-right"
                            shape="circle"
                            style={{ marginLeft: 10 }}
                            type="primary"
                            className="buttonPlain"
                        />
                    </>
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

    componentDidUpdate(prevProps) {
        const {
            orgManage: { showUser }
        } = this.props;

        if (prevProps.orgManage.showUser && !showUser) this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const {
            orgManage: { selectedKey }
        } = this.props;
        const params = { current, pageSize, keyword, orgNodeId: selectedKey };

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
                    orgManage: { selectedKey }
                } = this.props;
                await http.post("org-nodes/unlink-user", {
                    userId: id,
                    orgNodeId: selectedKey
                });

                message.success("移除成功");
                this.initData();
            }
        });
    };

    onAction = userId => {
        const { dispatch } = this.props;
        dispatch({ type: "orgManage/save", payload: { showUser: true } });
        dispatch({ type: "userPool/save", payload: { selectedKey: userId } });
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
        this.initData();
    };

    render() {
        const { list, current, pageSize, total, loading, dialogVisible } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <div className={styles.linkUser}>
                <div className={styles.titleBox}>
                    <span className={styles.title}>关联用户列表</span>
                    <Button
                        onClick={() => this.setState({ dialogVisible: true })}
                        type="primary"
                        icon="plus"
                    >
                        关联更多
                    </Button>
                </div>
                <Search
                    onSearch={this.onSearch}
                    placeholder={`搜索昵称、手机号、邮箱`}
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
                <LinkUserDialog visible={dialogVisible} onClose={this.closeDialog} />
            </div>
        );
    }
}

export default connect(({ orgManage }) => ({ orgManage }))(LinkUser);

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Descriptions, Drawer, Input } from "antd";
import http from "my/http";
import NoCard from "components/NoCard";
import moment from "moment";
import { DATE_TIME_FORMAT, GENDER_TEXT, ACTIVE_TYPE_TEXT, AUTH_TYPE_TEXT } from "my/constants";
import Avatar from "components/Avatar";

const { Search } = Input;
const { Item } = Descriptions;

class UsersActiveTable extends PureComponent {
    columns = [
        {
            title: "昵称",
            dataIndex: "nickname",
            width: 100,
            ellipsis: true
        },
        {
            title: "手机号",
            dataIndex: "mobile"
        },
        {
            title: "邮箱",
            dataIndex: "email",
            ellipsis: true
        },
        {
            title: "时间",
            dataIndex: "history.createDate",
            ellipsis: true,
            render: text => moment(text).format(DATE_TIME_FORMAT)
        },
        {
            title: "查看",
            key: "action",
            width: 70,
            render: record => {
                return (
                    <Button
                        onClick={() => this.showDetail(record)}
                        icon="arrow-right"
                        shape="circle"
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
        drawerVisible: false,
        currentRecord: { history: {} }
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isNew } = this.props;
        if (prevProps.isNew !== isNew) this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const {
            statistics: { selectedKey },
            isNew
        } = this.props;
        const params = { current, pageSize, keyword, isNew };
        if (selectedKey !== "all") params.clientId = selectedKey;

        const { list, total } = await http.get("statistic/users-active", { params });

        if (list.length || current === 1) this.setState({ list, total, loading: false });
        else this.setState({ current: current - 1 }, this.initData);
    };

    showDetail = record => {
        this.setState({ currentRecord: record, drawerVisible: true });
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, this.initData);
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    render() {
        const {
            list,
            current,
            pageSize,
            total,
            loading,
            drawerVisible,
            currentRecord
        } = this.state;
        const { isNew } = this.props;

        const pagination = { current, pageSize, total };
        const { history: activeHistory } = currentRecord;

        return (
            <NoCard title={`最近${isNew ? "新增" : "活跃"}用户列表`}>
                <Search
                    onSearch={this.onSearch}
                    placeholder="搜索昵称、手机号、邮箱"
                    enterButton
                    style={{ marginBottom: 20 }}
                />
                <Table
                    rowKey={record => record.id + record.history.createDate}
                    dataSource={list}
                    columns={this.columns}
                    loading={loading}
                    pagination={pagination}
                    onChange={this.onChange}
                />
                <Drawer
                    title="详情"
                    placement="right"
                    onClose={() => this.setState({ drawerVisible: false })}
                    visible={drawerVisible}
                    width="600"
                >
                    <div style={{ marginBottom: 20 }}>
                        <Avatar url={currentRecord.avatarUrl} />
                    </div>
                    <Descriptions
                        column={1}
                        style={{ borderBottom: "1px solid #eee", paddingBottom: 10 }}
                    >
                        <Item label="昵称">{currentRecord.nickname}</Item>
                        <Item label="手机号">{currentRecord.mobile || "-"}</Item>
                        <Item label="邮箱">{currentRecord.email || "-"}</Item>
                        <Item label="性别">
                            {currentRecord.gender ? GENDER_TEXT[currentRecord.gender] : "-"}
                        </Item>
                        <Item label="备注">{currentRecord.description || "-"}</Item>
                        <Item label="创建日期">
                            {moment(currentRecord.createDate).format(DATE_TIME_FORMAT)}
                        </Item>
                    </Descriptions>
                    <Descriptions column={1} style={{ marginTop: 25 }}>
                        <Item label="活跃类型">{ACTIVE_TYPE_TEXT[activeHistory.type]}</Item>
                        <Item label="活跃时间">
                            {moment(activeHistory.createDate).format(DATE_TIME_FORMAT)}
                        </Item>
                        <Item label="IP地址">{activeHistory.ip || "-"}</Item>
                        <Item label="认证方式">{AUTH_TYPE_TEXT[activeHistory.authType]}</Item>
                        <Item label="是否成功">
                            {activeHistory.success ? (
                                <span style={{ color: "#52c41a" }}>成功</span>
                            ) : (
                                <span style={{ color: "#f5222d" }}>失败</span>
                            )}
                        </Item>
                        <Item label="所属应用">{activeHistory.clientName}</Item>
                        <Item label="是否新用户">{activeHistory.isNew ? "是" : "否"}</Item>
                    </Descriptions>
                </Drawer>
            </NoCard>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(UsersActiveTable);

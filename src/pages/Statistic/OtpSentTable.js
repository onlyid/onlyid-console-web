import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Descriptions, Drawer, Icon, Input, Tooltip } from "antd";
import http from "my/http";
import moment from "moment";
import { CHANNEL_TEXT, DATE_TIME_FORMAT, DATE_TIME_FORMAT_SHORT } from "my/constants";
import SuccessStatus from "../../components/SuccessStatus";

const { Search } = Input;
const { Item } = Descriptions;

class OtpSentTable extends PureComponent {
    columns = [
        {
            title: "接收者",
            dataIndex: "recipient",
            width: 150,
            ellipsis: true
        },
        {
            title: "验证码",
            dataIndex: "code",
            width: 130
        },
        {
            title: "发送时间",
            dataIndex: "createDate",
            render: text => moment(text).format(DATE_TIME_FORMAT_SHORT)
        },
        {
            title: "频道",
            dataIndex: "channel",
            width: 100,
            render: text => CHANNEL_TEXT[text]
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
        currentRecord: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const {
            statistic: { selectedKey }
        } = this.props;
        const params = { current, pageSize, keyword };
        if (selectedKey !== "all") params.clientId = selectedKey;

        const { list, total } = await http.get("statistics/otp-sent", { params });

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

        const pagination = { current, pageSize, total };

        return (
            <>
                <Search
                    onSearch={this.onSearch}
                    placeholder="搜索手机号、邮箱"
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
                <Drawer
                    title="详情"
                    placement="right"
                    onClose={() => this.setState({ drawerVisible: false })}
                    visible={drawerVisible}
                    width="600"
                >
                    <Descriptions column={1}>
                        <Item label="接收者">{currentRecord.recipient}</Item>
                        <Item label="验证码">{currentRecord.code}</Item>
                        <Item label="发送时间">
                            {moment(currentRecord.createDate).format(DATE_TIME_FORMAT)}
                        </Item>
                        <Item label="过期时间">
                            {moment(currentRecord.expireDate).format(DATE_TIME_FORMAT)}
                        </Item>
                        <Item label="频道">{CHANNEL_TEXT[currentRecord.channel]}</Item>
                        <Item label="是否成功">
                            <SuccessStatus success={currentRecord.sendSuccess} />
                            <Tooltip
                                title={
                                    <span>
                                        1. 受网络、运营商等不可控因素影响，发送状态可能不完全准确。
                                        <br />
                                        2. 如果你的应用持续发送失败，请及时联系客服处理。
                                    </span>
                                }
                            >
                                <Icon type="question-circle" style={{ marginLeft: 10 }} />
                            </Tooltip>
                        </Item>
                        <Item label="所属应用">{currentRecord.clientName}</Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }
}

export default connect(({ statistic }) => ({ statistic }))(OtpSentTable);

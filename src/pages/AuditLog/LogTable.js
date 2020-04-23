import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Input, Select } from "antd";
import { AUDIT_TYPE_LABEL, DATE_TIME_FORMAT_SHORT, OPERATION_TYPE_TEXT } from "my/constants";
import moment from "moment";
import http from "my/http";
import styles from "./index.module.css";

const { Search } = Input;
const { Option } = Select;

class LogTable extends PureComponent {
    columns = [
        {
            title: "应用",
            dataIndex: "clientName"
        },
        {
            title: "类型",
            dataIndex: "resType",
            render: text => AUDIT_TYPE_LABEL[text]
        },
        {
            title: "ID",
            dataIndex: "resId"
        },
        {
            title: "名称",
            dataIndex: "resValue"
        },
        {
            title: "操作",
            dataIndex: "operation",
            render: text => OPERATION_TYPE_TEXT[text] || text
        },
        {
            title: "附加信息",
            dataIndex: "extra"
        },
        {
            title: "IP地址",
            dataIndex: "ip"
        },
        {
            title: "日期",
            dataIndex: "createDate",
            render: text => moment(text).format(DATE_TIME_FORMAT_SHORT)
        }
    ];

    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        keyword: "",
        loading: true,
        resType: ""
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            auditLog: { selectedKey }
        } = this.props;
        if (prevProps.auditLog.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const { current, pageSize, keyword, resType } = this.state;
        const {
            auditLog: { selectedKey }
        } = this.props;

        this.setState({ loading: true });
        const params = { current, pageSize, keyword, resType, clientId: selectedKey };
        const { list, total } = await http.get("audit-logs", { params });

        if (list.length || current === 1) this.setState({ list, total, loading: false });
        else this.setState({ current: current - 1 }, this.initData);
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, this.initData);
    };

    onTypeChange = resType => {
        this.setState({ resType }, this.initData);
    };

    render() {
        const { list, current, pageSize, total, loading } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <div className={styles.app}>
                <div className={styles.searchBox}>
                    <Select
                        placeholder="选择类型"
                        style={{ width: 150 }}
                        onChange={this.onTypeChange}
                    >
                        {Object.keys(AUDIT_TYPE_LABEL).map(key => (
                            <Option key={key} value={key === "ALL" ? "" : key}>
                                {AUDIT_TYPE_LABEL[key]}
                            </Option>
                        ))}
                    </Select>
                    <Search
                        onSearch={this.onSearch}
                        placeholder="搜索名称、IP地址"
                        enterButton
                        style={{ marginLeft: 20 }}
                    />
                </div>
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={this.columns}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default connect(({ auditLog }) => ({ auditLog }))(LogTable);

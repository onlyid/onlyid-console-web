import React, { PureComponent } from "react";
import { Button, Input } from "antd";
import styles from "./index.module.css";
import Table from "components/Table";
import { CATEGORY_TEXT, DATE_TIME_FORMAT } from "my/constants";
import moment from "moment";
import http from "my/http";
import { connect } from "react-redux";
import classNames from "classnames";
import { eventEmitter } from "my/utils";

const { Search } = Input;

class Inbox extends PureComponent {
    columns = [
        {
            title: "标题",
            dataIndex: "title",
            render: (text, record) => (
                <Button size="small" type="link" onClick={() => this.onAction(record.id)}>
                    {text}
                </Button>
            )
        },
        {
            title: "时间",
            dataIndex: "createDate",
            render: value => moment(value).format(DATE_TIME_FORMAT)
        },
        {
            title: "类别",
            dataIndex: "category",
            render: value => CATEGORY_TEXT[value]
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
        this.initData("first");

        eventEmitter.on("message/onDelete", this.onDelete);
        eventEmitter.on("message/onMarkRead", this.onMarkRead);
    }

    componentWillUnmount() {
        eventEmitter.off("message/onDelete", this.onDelete);
        eventEmitter.off("message/onMarkRead", this.onMarkRead);
    }

    initData = async select => {
        this.setState({ loading: true });

        const { current, pageSize, keyword, list: prevList } = this.state;
        const {
            dispatch,
            message: { selectedKey }
        } = this.props;

        const params = { current, pageSize, keyword };
        const { list, total } = await http.get("messages", { params });

        if (!list.length && current > 1) {
            this.setState({ current: current - 1 }, () => this.initData(select));
            return;
        }

        this.setState({ list, total, loading: false });

        if (select === "first") {
            if (selectedKey || !list.length) return;

            dispatch({ type: "message/save", payload: { selectedKey: list[0].id } });
        } else if (select === "forceFirst") {
            let newKey = null;

            if (list.length) newKey = list[0].id;

            dispatch({ type: "message/save", payload: { selectedKey: newKey } });
        } else if (select === "neighbor") {
            let newKey = null;

            // 尝试找上一个
            const index = prevList.findIndex(item => item.id === selectedKey);
            if (index - 1 >= 0) newKey = prevList[index - 1].id;

            // 如果上一个找到了，尝试在新的list中找到上一个的下一个
            if (newKey) {
                const index = list.findIndex(item => item.id === newKey);
                if (index !== -1 && index + 1 < list.length) newKey = list[index + 1].id;
            }

            // 没找到 且list不为空 默认第一个
            if (!newKey && list.length) newKey = list[0].id;

            // 找没找到都dispatch一下
            dispatch({
                type: "message/save",
                payload: { selectedKey: newKey }
            });
        }
    };

    onDelete = () => {
        this.initData("neighbor");
    };

    onMarkRead = id => {
        const { list } = this.state;

        if (id) {
            const item = list.find(item => item.id === id);
            if (item) {
                item.isRead = true;
                this.forceUpdate();
            }
        }
        // 没有id 就刷新全部
        else {
            this.initData();
        }
    };

    onAction = id => {
        const { dispatch } = this.props;
        dispatch({ type: "message/save", payload: { selectedKey: id } });
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, () => this.initData("forceFirst"));
    };

    rowClassName = ({ id, isRead }) => {
        const {
            message: { selectedKey }
        } = this.props;

        return classNames(
            styles.row,
            { [styles.selected]: id === selectedKey },
            { [styles.isRead]: isRead }
        );
    };

    render() {
        const { list, current, pageSize, total, loading } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <div className={styles.inbox}>
                <Search
                    onSearch={this.onSearch}
                    placeholder="搜索消息标题"
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
                    rowClassName={this.rowClassName}
                />
            </div>
        );
    }
}

export default connect(({ message }) => ({ message }))(Inbox);

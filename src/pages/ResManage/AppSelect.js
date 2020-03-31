import React, { PureComponent } from "react";
import http from "my/http";
import { connect } from "react-redux";
import styles from "./index.module.css";
import { Modal, Input, Button } from "antd";
import Table from "components/Table";
import { CLIENT_TYPE_TEXT } from "my/constants";

const { Search } = Input;

class Dialog extends PureComponent {
    columns = [
        {
            title: "应用icon",
            dataIndex: "iconUrl",
            render: value => <img className={styles.appIcon} src={value} alt="icon" />
        },
        {
            title: "应用名称",
            dataIndex: "name"
        },
        {
            title: "应用类型",
            dataIndex: "type",
            render: value => CLIENT_TYPE_TEXT[value]
        },
        {
            title: "操作",
            key: "action",
            render: record => {
                return (
                    <Button
                        onClick={() => this.select(record)}
                        icon="arrow-right"
                        shape="circle"
                        type="primary"
                    />
                );
            }
        }
    ];

    state = {
        list: [],
        keyword: ""
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { keyword } = this.state;
        const params = { keyword };
        const list = await http.get("clients", { params });
        this.setState({ list });
    };

    select = selectedApp => {
        const { dispatch, onClose } = this.props;
        dispatch({ type: "resManage/save", payload: { selectedApp, showEmpty: false } });
        onClose();
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    render() {
        const { visible, onClose } = this.props;
        const { list } = this.state;

        return (
            <Modal visible={visible} title="选择应用" onCancel={onClose} footer={false}>
                <>
                    <Search
                        onSearch={this.onSearch}
                        placeholder="搜索应用名称"
                        enterButton
                        style={{ marginBottom: 20 }}
                    />
                    <Table
                        rowKey="id"
                        dataSource={list}
                        columns={this.columns}
                        pagination={false}
                    />
                </>
            </Modal>
        );
    }
}

const SelectDialog = connect(({ resManage }) => ({ resManage }))(Dialog);

class AppSelect extends PureComponent {
    state = {
        visible: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { dispatch } = this.props;

        const list = await http.get("clients");
        if (list.length) {
            dispatch({ type: "resManage/save", payload: { selectedApp: list[0] } });
        } else {
            dispatch({ type: "resManage/save", payload: { showEmpty: true } });
        }
    };

    showDialog = () => {
        this.setState({ visible: true });
    };

    closeDialog = () => {
        this.setState({ visible: false });
    };

    render() {
        const {
            resManage: { selectedApp }
        } = this.props;
        const { visible } = this.state;

        if (!selectedApp) return null;

        return (
            <div className={styles.appSelect}>
                <SelectDialog visible={visible} onClose={this.closeDialog} />/
                <div className={styles.appBox} onClick={this.showDialog}>
                    <img src={selectedApp.iconUrl} alt="icon" />
                    <span>{selectedApp.name}</span>
                </div>
            </div>
        );
    }
}

export default connect(({ resManage }) => ({ resManage }))(AppSelect);

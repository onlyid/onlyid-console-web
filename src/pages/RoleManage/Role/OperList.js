import React, { PureComponent } from "react";
import http from "my/http";
import { Table } from "antd";
import { eventEmitter } from "my/utils";
import styles from "../index.module.css";

class OperList extends PureComponent {
    columns = [
        {
            title: "名称",
            dataIndex: "name",
            ellipsis: true,
            align: "center"
        },
        {
            title: "标识",
            dataIndex: "code",
            ellipsis: true,
            align: "center"
        }
    ];

    state = {
        dataSource: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { resId } = this.props;
        if (resId !== prevProps.resId) this.initData(resId);
    }

    initData = async resId => {
        const params = { resId };
        const dataSource = await http.get("res-nodes/operations", { params });
        this.setState({ dataSource });
    };

    onChange = selectedRowKeys => {
        const { onCheck } = this.props;

        if (selectedRowKeys.length) eventEmitter.emit("roleManage/checkSelectedRes");

        onCheck(selectedRowKeys);
    };

    render() {
        const { dataSource } = this.state;
        const { checkedKeys } = this.props;

        const rowSelection = {
            onChange: this.onChange,
            columnWidth: 30,
            selectedRowKeys: checkedKeys
        };

        return (
            <Table
                className={styles.operList}
                rowKey="id"
                columns={this.columns}
                dataSource={dataSource}
                size="small"
                rowSelection={rowSelection}
                pagination={false}
            />
        );
    }
}

export default OperList;

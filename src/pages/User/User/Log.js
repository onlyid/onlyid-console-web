import React, { PureComponent } from "react";
import styles from "./Table.module.css";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import { AUTH_METHOD, DATE_TIME_FORMAT } from "my/constants";
import MyTable from "components/MyTable";
import http from "my/http";
import { withRouter } from "react-router-dom";
import SuccessStatus from "components/SuccessStatus";

class Log extends PureComponent {
    state = {
        list: [],
        loading: true,
        current: 1,
        pageSize: 10,
        total: 0
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { match } = this.props;
        const { current, pageSize } = this.state;

        const params = { userId: match.params.id, current, pageSize };
        const { list, total } = await http.get("logs/user-active/by-user", { params });
        this.setState({ list, total, loading: false });
    };

    onPaginationChange = async ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    noteCell = item => {
        let note;
        if (item.signUp) note = "用户新注册账号";
        else if (item.resetPassword) note = "用户重置了密码";

        return <TableCell className={note && styles.smallBox}>{note || "-"}</TableCell>;
    };

    render() {
        const { list, loading, current, pageSize, total } = this.state;
        const pagination = { current, pageSize, total };

        return (
            <>
                <p style={{ marginTop: 30 }}>保留最长三个月的登录日志。</p>
                <MyTable
                    length={list.length}
                    loading={loading}
                    className={styles.table1}
                    pagination={pagination}
                    onPaginationChange={this.onPaginationChange}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>应用</TableCell>
                            <TableCell>时间</TableCell>
                            <TableCell>认证方式</TableCell>
                            <TableCell>状态</TableCell>
                            <TableCell>IP</TableCell>
                            <TableCell>地点</TableCell>
                            <TableCell>错误信息</TableCell>
                            <TableCell>备注</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <div className={styles.clientBox}>
                                        <img src={item.clientIconUrl} alt="icon" />
                                        {item.clientName}
                                    </div>
                                </TableCell>
                                <TableCell style={{ width: 120 }}>
                                    {moment(item.createDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell>{AUTH_METHOD[item.authMethod]}</TableCell>
                                <TableCell>
                                    <SuccessStatus success={item.success} />
                                </TableCell>
                                <TableCell>{item.ip || "-"}</TableCell>
                                <TableCell style={{ maxWidth: 140 }}>
                                    {item.location || "-"}
                                </TableCell>
                                <TableCell className={item.errMsg && styles.smallBox}>
                                    {item.errMsg || "-"}
                                </TableCell>
                                {this.noteCell(item)}
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
            </>
        );
    }
}

export default withRouter(Log);

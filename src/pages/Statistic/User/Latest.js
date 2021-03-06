import React, { PureComponent } from "react";
import http from "my/http";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import styles from "../Latest.module.css";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import Empty from "components/Empty";
import GenderSymbol from "components/GenderSymbol";

class Latest extends PureComponent {
    state = {
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clientId } = this.props;
        if (clientId !== prevProps.clientId) this.initData();
    }

    initData = async () => {
        const { clientId, type } = this.props;

        const params = { type };
        if (clientId !== "all") params.clientId = clientId;

        const list = await http.get("statistics/users", { params });
        this.setState({ list });
    };

    render() {
        const { list } = this.state;
        const { type } = this.props;

        return (
            <div className={styles.root}>
                <h3>最近{type === "new" ? "新增" : "活跃"}</h3>
                <Table className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{type === "new" ? "新增" : "活跃"}用户</TableCell>
                            <TableCell>手机号</TableCell>
                            <TableCell>邮箱</TableCell>
                            <TableCell>性别</TableCell>
                            <TableCell className={styles.borderLeft}>登录应用</TableCell>
                            <TableCell>登录时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={styles.userBody}>
                        {list.map(item => (
                            <TableRow key={item.id + item.firstDate}>
                                <TableCell>
                                    <div className={styles.userBox}>
                                        <img src={item.avatarUrl} alt="avatar" />
                                        {item.nickname}
                                    </div>
                                </TableCell>
                                <TableCell>{item.mobile || "-"}</TableCell>
                                <TableCell>{item.email || "-"}</TableCell>
                                <TableCell>
                                    <GenderSymbol gender={item.gender} dense />
                                </TableCell>
                                <TableCell className={styles.borderLeft}>
                                    <div className={styles.clientBox}>
                                        <img src={item.clientIconUrl} alt="icon" />
                                        {item.clientName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {type === "new"
                                        ? moment(item.firstDate).format(DATE_TIME_FORMAT)
                                        : moment(item.lastDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!list.length && (
                    <div className={styles.emptyBox}>
                        <Empty simple description="暂无数据" />
                    </div>
                )}
            </div>
        );
    }
}

export default Latest;

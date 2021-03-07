import React, { PureComponent } from "react";
import http from "my/http";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import styles from "../index.module.css";
import moment from "moment";
import { DATE_TIME_FORMAT, GENDER_TEXT } from "my/constants";
import Empty from "components/Empty";
import Avatar from "../../../components/Avatar";

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
        if (clientId !== -1) params.clientId = clientId;

        const list = await http.get("statistics/users", { params });
        this.setState({ list });
    };

    render() {
        const { list } = this.state;
        const { type } = this.props;

        return (
            <div className={styles.latest}>
                <h3>最近{type === "new" ? "新增" : "活跃"}</h3>
                <Table className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell>头像</TableCell>
                            <TableCell>昵称</TableCell>
                            <TableCell>手机号</TableCell>
                            <TableCell>邮箱</TableCell>
                            <TableCell>性别</TableCell>
                            <TableCell className={styles.clientName}>登录应用</TableCell>
                            <TableCell>登录时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id + item.loginDate}>
                                <TableCell className={styles.userAvatar}>
                                    <Avatar url={item.avatarUrl} width={40} height={40} />
                                </TableCell>
                                <TableCell>{item.nickname}</TableCell>
                                <TableCell>{item.mobile || "-"}</TableCell>
                                <TableCell>{item.email || "-"}</TableCell>
                                <TableCell>{GENDER_TEXT[item.gender] || "-"}</TableCell>
                                <TableCell className={styles.clientName}>
                                    {item.clientName}
                                </TableCell>
                                <TableCell>
                                    {moment(item.loginDate).format(DATE_TIME_FORMAT)}
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

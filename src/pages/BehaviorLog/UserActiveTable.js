import React, { PureComponent } from "react";
import styles from "./Table.module.css";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import MyTable from "components/MyTable";
import Avatar from "components/Avatar";
import moment from "moment";
import { AUTH_METHOD, DATE_TIME_FORMAT } from "my/constants";
import SuccessStatus from "components/SuccessStatus";

export default class extends PureComponent {
    noteCell = item => {
        let list = [];
        if (item.signUp) list.push("用户新注册账号");
        if (item.resetPassword) list.push("用户重置了密码");
        if (item.isNew) list.push("用户首次登录应用");

        if (!list.length) return <TableCell>-</TableCell>;

        return (
            <TableCell className={styles.note}>
                {list.map((item, index) => (
                    <p style={{ margin: "5px 0" }} key={index}>
                        {item}
                    </p>
                ))}
            </TableCell>
        );
    };

    render() {
        const { list, loading, current, pageSize, total, onPaginationChange } = this.props;
        const pagination = { current, pageSize, total };

        return (
            <MyTable
                className={styles.table1}
                length={list.length}
                loading={loading}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>用户</TableCell>
                        <TableCell>登录应用</TableCell>
                        <TableCell>方式、IP、地点、时间</TableCell>
                        <TableCell>状态、错误信息</TableCell>
                        <TableCell>备注</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map(item => (
                        <TableRow key={item.id} hover>
                            <TableCell>
                                <div className={styles.userBox}>
                                    <Avatar
                                        url={item.userAvatarUrl}
                                        width={40}
                                        height={40}
                                        style={{ marginRight: 15 }}
                                    />
                                    <span>
                                        {item.userNickname}
                                        <br />
                                        {item.userMobile || "-"}
                                        <br />
                                        {item.userEmail || "-"}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className={styles.clientBox}>
                                    <img src={item.clientIconUrl} alt="icon" />
                                    {item.clientName}
                                </div>
                            </TableCell>
                            <TableCell className={styles.info}>
                                {AUTH_METHOD[item.authMethod]}
                                <br />
                                {item.ip || "-"}
                                <br />
                                {item.location || "-"}
                                <br />
                                {moment(item.createDate).format(DATE_TIME_FORMAT)}
                            </TableCell>
                            <TableCell className={styles.status}>
                                <SuccessStatus success={item.success} />
                                {!item.success && <p>{item.errMsg}</p>}
                            </TableCell>
                            {this.noteCell(item)}
                        </TableRow>
                    ))}
                </TableBody>
            </MyTable>
        );
    }
}

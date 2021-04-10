import React from "react";
import styles from "./index.module.css";
import { IconButton, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Avatar from "components/Avatar";
import GenderSymbol from "components/GenderSymbol";
import MyTable from "components/MyTable";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";

export default function({
    list,
    current,
    pageSize,
    total,
    loading,
    onPaginationChange,
    onAction,
    inDialog
}) {
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
                    <TableCell>手机号</TableCell>
                    <TableCell>邮箱</TableCell>
                    <TableCell>性别</TableCell>
                    {!inDialog && <TableCell>关联时间</TableCell>}
                    <TableCell align="center">操作</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index} hover>
                        <TableCell>
                            <div className={styles.userBox}>
                                <Avatar
                                    url={item.avatarUrl}
                                    width={40}
                                    height={40}
                                    style={{ marginRight: 15 }}
                                />
                                {item.nickname}
                            </div>
                        </TableCell>
                        <TableCell>{item.mobile || "-"}</TableCell>
                        <TableCell>{item.email || "-"}</TableCell>
                        <TableCell>
                            <GenderSymbol gender={item.gender} dense />
                        </TableCell>
                        {!inDialog && (
                            <TableCell>{moment(item.linkDate).format(DATE_TIME_FORMAT)}</TableCell>
                        )}
                        <TableCell align="center">
                            <IconButton onClick={() => onAction(item.id)}>
                                <span className="material-icons">
                                    {inDialog ? "add" : "delete"}
                                </span>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MyTable>
    );
}

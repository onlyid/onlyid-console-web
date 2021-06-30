import React from "react";
import styles from "./index.module.css";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import SuccessStatus from "components/SuccessStatus";
import MyTable from "components/MyTable";

export default function({ list, loading, current, pageSize, total, onPaginationChange }) {
    const pagination = { current, pageSize, total };

    return (
        <MyTable
            className={styles.table1}
            length={list.length}
            loading={loading}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
        >
            <TableHead className={styles.otpThead}>
                <TableRow>
                    <TableCell>接收人</TableCell>
                    <TableCell>验证码</TableCell>
                    <TableCell>创建时间</TableCell>
                    <TableCell>过期时间</TableCell>
                    <TableCell>发送状态</TableCell>
                    <TableCell>
                        当前
                        <br />
                        失败次数
                    </TableCell>
                    <TableCell>
                        最多
                        <br />
                        失败次数
                    </TableCell>
                    <TableCell>校验状态</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map(item => (
                    <TableRow key={item.id} hover>
                        <TableCell>{item.recipient}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{moment(item.createDate).format(DATE_TIME_FORMAT)}</TableCell>
                        <TableCell>{moment(item.expireDate).format(DATE_TIME_FORMAT)}</TableCell>
                        <TableCell>
                            <SuccessStatus success={item.sendSuccess} />
                        </TableCell>
                        <TableCell>{item.failCount}</TableCell>
                        <TableCell>{item.maxFailCount}</TableCell>
                        <TableCell>
                            <SuccessStatus success={item.verifySuccess} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MyTable>
    );
}

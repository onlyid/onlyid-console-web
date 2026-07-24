import React, { PureComponent } from "react"
import styles from "./Table.module.css"
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import MyTable from "components/MyTable"
import moment from "moment"
import { DATE_TIME_FORMAT } from "my/constants"
import SuccessStatus from "components/SuccessStatus"

export default class UserActiveTable extends PureComponent {
    render() {
        const { list, loading, current, pageSize, total, onPaginationChange } = this.props
        const pagination = { current, pageSize, total }

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
                        <TableCell>IP、地点、时间</TableCell>
                        <TableCell>状态、错误信息</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item) => (
                        <TableRow key={item.id} hover>
                            <TableCell>
                                <div className={styles.userBox}>
                                    <img src={item.userAvatar} alt="avatar" />
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
                        </TableRow>
                    ))}
                </TableBody>
            </MyTable>
        )
    }
}

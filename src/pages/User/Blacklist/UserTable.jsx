import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import styles from "./UserTable.module.css"
import { Link, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import moment from "moment"
import { DATE_TIME_FORMAT } from "@/my/constants"
import MyTable from "@/components/MyTable"
import GenderSymbol from "@/components/GenderSymbol"

export default function UserTable({ list, loading, current, pageSize, total, onPaginationChange }) {
    const dispatch = useDispatch()
    const history = useHistory()

    const onClick = (event, id) => {
        event.preventDefault()

        dispatch({ type: "user", currentTab: "danger" })
        history.push(id, { fromBlacklist: true })
    }

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
                    <TableCell>手机号</TableCell>
                    <TableCell>邮箱</TableCell>
                    <TableCell>性别</TableCell>
                    <TableCell className={styles.paddingLeft}>拉黑时间</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index} hover>
                        <TableCell>
                            <Link
                                className={styles.userBox}
                                href="#"
                                onClick={(event) => onClick(event, item.id)}
                            >
                                <img src={item.avatar} alt="avatar" />
                                {item.nickname}
                            </Link>
                        </TableCell>
                        <TableCell>{item.mobile || "-"}</TableCell>
                        <TableCell>{item.email || "-"}</TableCell>
                        <TableCell>
                            <GenderSymbol gender={item.gender} dense />
                        </TableCell>
                        <TableCell className={styles.paddingLeft}>
                            {moment(item.blockDate).format(DATE_TIME_FORMAT)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MyTable>
    )
}

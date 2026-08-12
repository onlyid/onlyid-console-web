import { useState, useEffect } from "react"
import styles from "./ClientTable.module.css"
import MyTable from "components/MyTable"
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import moment from "moment"
import { DATE_TIME_FORMAT } from "my/constants"
import request from "my/request"
import { useRouteMatch } from "react-router-dom"

export default function ClientTable() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const match = useRouteMatch()

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        const params = { userId: match.params.id }
        const list = await request.get("clients/by-user", { params })
        setList(list)
        setLoading(false)
    }

    return (
        <>
            <p style={{ marginTop: 30 }}>用户授权的应用列表，这些应用可以访问该用户的账号数据</p>
            <MyTable length={list.length} loading={loading} className={styles.table1}>
                <TableHead>
                    <TableRow>
                        <TableCell>应用</TableCell>
                        <TableCell>最近登录时间</TableCell>
                        <TableCell>最近登录IP</TableCell>
                        <TableCell>最近登录地点</TableCell>
                        <TableCell>首次登录时间</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item, index) => (
                        <TableRow key={index} hover>
                            <TableCell>
                                <div className={styles.clientBox}>
                                    <img src={item.iconUrl} alt="icon" />
                                    {item.name}
                                </div>
                            </TableCell>
                            <TableCell>{moment(item.lastDate).format(DATE_TIME_FORMAT)}</TableCell>
                            <TableCell className={styles.borderLeft}>
                                {item.lastIp || "-"}
                            </TableCell>
                            <TableCell>{item.lastLocation || "-"}</TableCell>
                            <TableCell>{moment(item.firstDate).format(DATE_TIME_FORMAT)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MyTable>
        </>
    )
}

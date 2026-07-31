import { useEffect, useState } from "react"
import http from "my/http"
import styles from "./index.module.css"
import MyTable from "components/MyTable"
import { Button, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import moment from "moment"
import { DATE_TIME_FORMAT } from "my/constants"

const separateNumber = (num) => {
    const s = num.toString()

    if (s.length < 5) return s

    const part1 = s.substring(0, s.length - 4)
    const part2 = s.substring(s.length - 4)
    return part1 + "," + part2
}

export default function ChargeTable() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        setLoading(true)
        const list = await http.get("tenant/charges")
        setList(list)
        setLoading(false)
    }

    const statusCell = (item) => {
        if (item.paid) return <span style={{ color: "#4caf50" }}>已支付</span>

        if (moment(item.expireDate).isBefore(moment())) return <span>已过期</span>

        return <span style={{ color: "#f50057" }}>未支付</span>
    }

    const actionCell = (item) => {
        if (item.paid || moment(item.expireDate).isBefore(moment())) return "-"

        return (
            <Button
                color="primary"
                onClick={() => {
                    document.body.innerHTML = item.formHtml
                    document.forms[0].submit()
                }}
            >
                支付
            </Button>
        )
    }

    const countCell = (item) => {
        if (item.type === "Renew") return item.count + " 年"

        return separateNumber(item.count) + " 条"
    }

    return (
        <MyTable length={list.length} loading={loading}>
            <TableHead>
                <TableRow>
                    <TableCell>费用ID</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>数量</TableCell>
                    <TableCell>总金额</TableCell>
                    <TableCell>创建时间</TableCell>
                    <TableCell>支付状态</TableCell>
                    <TableCell align="center">操作</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((item) => (
                    <TableRow key={item.id} hover>
                        <TableCell style={{ minWidth: 100 }}>{item.id}</TableCell>
                        <TableCell style={{ minWidth: 100 }}>
                            {item.type === "Renew" ? "订阅续费" : "购买短信"}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }}>{countCell(item)}</TableCell>
                        <TableCell className={styles.amount} style={{ minWidth: 100 }}>
                            {item.amount}
                        </TableCell>
                        <TableCell>{moment(item.createDate).format(DATE_TIME_FORMAT)}</TableCell>
                        <TableCell>{statusCell(item)}</TableCell>
                        <TableCell align="center">{actionCell(item)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MyTable>
    )
}

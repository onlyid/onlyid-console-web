import React, { PureComponent } from "react"
import http from "my/http"
import styles from "./index.module.css"
import MyTable from "components/MyTable"
import { Button, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import moment from "moment"
import { DATE_TIME_FORMAT } from "my/constants"

export default class ChargeTable extends PureComponent {
    state = {
        list: [],
        loading: true
    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        this.setState({ loading: true })
        const list = await http.get("tenant/charges")
        this.setState({ list, loading: false })
    }

    statusCell = (item) => {
        if (item.paid) return <span style={{ color: "#4caf50" }}>已支付</span>

        if (moment(item.expireDate).isBefore(moment())) return <span>已过期</span>

        return <span style={{ color: "#f50057" }}>未支付</span>
    }

    actionCell = (item) => {
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

    separateNumber = (num) => {
        const s = num.toString()

        if (s.length > 5) {
            const part1 = s.substring(0, s.length - 4)
            const part2 = s.substring(s.length - 4)
            return part1 + "," + part2
        }

        return s
    }

    countCell = (item) => {
        if (item.type === "Renew") return item.count + " 年"

        return this.separateNumber(item.count) + " 条"
    }

    render() {
        const { loading, list } = this.state

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
                            <TableCell style={{ minWidth: 100 }}>{this.countCell(item)}</TableCell>
                            <TableCell className={styles.amount} style={{ minWidth: 100 }}>
                                {item.amount}
                            </TableCell>
                            <TableCell>
                                {moment(item.createDate).format(DATE_TIME_FORMAT)}
                            </TableCell>
                            <TableCell>{this.statusCell(item)}</TableCell>
                            <TableCell align="center">{this.actionCell(item)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MyTable>
        )
    }
}

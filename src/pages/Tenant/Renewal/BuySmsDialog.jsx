import React, { PureComponent } from "react"
import request from "my/request"
import styles from "./BuySmsDialog.module.css"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core"
import DialogClose from "components/DialogClose"

export default class BuySmsDialog extends PureComponent {
    state = {
        num: "1",
        unit: "1000"
    }

    submit = async () => {
        const { num, unit } = this.state
        const { formHtml } = await request.post("tenant/pay", { count: num * unit, type: "sms" })
        document.body.innerHTML = formHtml
        document.forms[0].submit()
    }

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
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

    render() {
        const { open, onCancel, smsRemain } = this.props
        const { num, unit } = this.state

        return (
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>
                    购买短信
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    <div className={styles.countBox}>
                        购买条数：
                        <FormControl style={{ marginLeft: 15, marginRight: 15 }}>
                            <Select name="num" value={num} onChange={this.onChange}>
                                <MenuItem key="1" value="1">
                                    1
                                </MenuItem>
                                <MenuItem key="2" value="2">
                                    2
                                </MenuItem>
                                <MenuItem key="3" value="3">
                                    3
                                </MenuItem>
                                <MenuItem key="4" value="4">
                                    4
                                </MenuItem>
                                <MenuItem key="5" value="5">
                                    5
                                </MenuItem>
                                <MenuItem key="6" value="6">
                                    6
                                </MenuItem>
                                <MenuItem key="7" value="7">
                                    7
                                </MenuItem>
                                <MenuItem key="8" value="8">
                                    8
                                </MenuItem>
                                <MenuItem key="9" value="9">
                                    9
                                </MenuItem>
                            </Select>
                        </FormControl>
                        X
                        <FormControl style={{ marginLeft: 15 }}>
                            <Select name="unit" value={unit} onChange={this.onChange}>
                                <MenuItem key="1000" value="1000">
                                    1000 条
                                </MenuItem>
                                <MenuItem key="10000" value="10000">
                                    10000 条
                                </MenuItem>
                                <MenuItem key="100000" value="100000">
                                    10,0000 条
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <table className={styles.table1}>
                        <thead>
                            <tr>
                                <td>当前余量</td>
                                <td>购买之后</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.separateNumber(smsRemain)}</td>
                                <td>{this.separateNumber(smsRemain + num * unit)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.fee}>
                        <p>
                            总计费用<span>{(num * unit * 0.035).toFixed()}</span>元
                        </p>
                        <p className={styles.tip1}>点击“支付”将跳转支付宝页面进行支付</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>取 消</Button>
                    <Button onClick={this.submit} color="primary">
                        支 付
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

import React, { PureComponent } from "react";
import http from "my/http";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import styles from "./RenewDialog.module.css";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@material-ui/core";
import DialogClose from "components/DialogClose";

export default class extends PureComponent {
    state = {
        year: "2"
    };

    submit = async () => {
        const { year } = this.state;
        const { formHtml } = await http.post("tenant/renew", { year });
        document.body.innerHTML = formHtml;
        document.forms[0].submit();
    };

    onChange = e => {
        this.setState({ year: e.target.value });
    };

    newExpireDate = () => {
        const { expireDate } = this.props;
        const { year } = this.state;

        const now = moment();
        let date = moment(expireDate);

        if (date.isBefore(now)) date = now;

        date.add(year, "y");

        return date;
    };

    render() {
        const { open, onCancel, expireDate } = this.props;
        const { year } = this.state;

        return (
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>
                    续费
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    <div className={styles.yearBox}>
                        续费时长：
                        <FormControl variant="outlined" style={{ marginLeft: 20 }}>
                            <RadioGroup row name="type" value={year} onChange={this.onChange}>
                                <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="1 年"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio color="primary" />}
                                    label="2 年"
                                />
                                <FormControlLabel
                                    value="3"
                                    control={<Radio color="primary" />}
                                    label="3 年"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <table className={styles.table1}>
                        <thead>
                            <tr>
                                <td>订阅产品</td>
                                <td>当前有效期</td>
                                <td>续费有效期</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>统一账号和认证解决方案</td>
                                <td>{moment(expireDate).format(DATE_TIME_FORMAT)}</td>
                                <td>{this.newExpireDate().format(DATE_TIME_FORMAT)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.fee}>
                        <p>
                            总计费用<span>{year * 200}</span>元
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
        );
    }
}

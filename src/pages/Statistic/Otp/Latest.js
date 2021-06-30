import React, { PureComponent } from "react";
import http from "my/http";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import styles from "../Latest.module.css";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import SuccessStatus from "components/SuccessStatus";
import Empty from "components/Empty";

class Latest extends PureComponent {
    state = {
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clientId } = this.props;
        if (clientId !== prevProps.clientId) this.initData();
    }

    initData = async () => {
        const { clientId } = this.props;

        const params = { current: 1, pageSize: 5, days: 90 };
        if (clientId !== "all") params.clientId = clientId;

        const { list } = await http.get("otp", { params });
        this.setState({ list });
    };

    render() {
        const { list } = this.state;

        return (
            <div className={styles.root}>
                <h3>最近发送</h3>
                <Table className={styles.table1}>
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
                            <TableRow key={item.id}>
                                <TableCell>{item.recipient}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>
                                    {moment(item.createDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell>
                                    {moment(item.expireDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
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
                </Table>
                {!list.length && (
                    <div className={styles.emptyBox}>
                        <Empty simple description="暂无数据" />
                    </div>
                )}
            </div>
        );
    }
}

export default Latest;

import React, { PureComponent } from "react";
import ClientSelect from "components/ClientSelect";
import {
    Button,
    FormControl,
    Input,
    InputAdornment,
    MenuItem,
    Select,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import styles from "./index.module.css";
import classNames from "classnames";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import SuccessStatus from "components/SuccessStatus";
import http from "my/http";
import MyTable from "components/MyTable";
import selectBar from "components/SelectBar.module.css";
import ExportDialog from "./ExportDialog";

class OtpRecord extends PureComponent {
    state = {
        clientId: "all",
        days: 7,
        sendSuccess: "all",
        verifySuccess: "all",
        keyword: "",
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        exportOpen: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const {
            clientId,
            days,
            sendSuccess,
            verifySuccess,
            keyword,
            current,
            pageSize
        } = this.state;

        const params = { current, pageSize, keyword, days };
        if (clientId !== "all") params.clientId = clientId;
        if (sendSuccess !== "all") params.sendSuccess = sendSuccess;
        if (verifySuccess !== "all") params.verifySuccess = verifySuccess;

        const { list, total } = await http.get("otp", { params });
        this.setState({ list, total, loading: false });
    };

    onClientChange = clientId => {
        this.setState({ clientId });
    };

    onChange = ({ target }) => {
        let key;
        switch (target.name) {
            case "days-select":
                key = "days";
                break;
            case "send-select":
                key = "sendSuccess";
                break;
            case "verify-select":
                key = "verifySuccess";
                break;
            default:
                key = target.name;
        }
        this.setState({ [key]: target.value });
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    onSearch = () => {
        this.setState({ current: 1 }, this.initData);
    };

    toggleExport = () => {
        this.setState(({ exportOpen }) => ({ exportOpen: !exportOpen }));
    };

    render() {
        const {
            clientId,
            days,
            sendSuccess,
            verifySuccess,
            keyword,
            list,
            total,
            pageSize,
            current,
            loading,
            exportOpen
        } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <div className={styles.root}>
                <h1>OTP记录</h1>
                <p>
                    查看最近的OTP发送、校验记录。
                    <span style={{ color: "#7f7f7f" }}>（保留三个月数据）</span>
                </p>
                <div className={selectBar.root}>
                    <ClientSelect value={clientId} onChange={this.onClientChange} />
                    <FormControl>
                        <Select
                            name="days-select"
                            value={days}
                            onChange={this.onChange}
                            startAdornment={<InputAdornment position="start">时间</InputAdornment>}
                        >
                            <MenuItem value={7}>最近7天</MenuItem>
                            <MenuItem value={30}>最近30天</MenuItem>
                            <MenuItem value={90}>最近90天</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Select
                            name="send-select"
                            value={sendSuccess}
                            onChange={this.onChange}
                            startAdornment={
                                <InputAdornment position="start">发送状态</InputAdornment>
                            }
                        >
                            <MenuItem value="all">查看全部</MenuItem>
                            <MenuItem value="true">只看成功</MenuItem>
                            <MenuItem value="false">只看失败</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Select
                            name="verify-select"
                            value={verifySuccess}
                            onChange={this.onChange}
                            startAdornment={
                                <InputAdornment position="start">校验状态</InputAdornment>
                            }
                        >
                            <MenuItem value="all">查看全部</MenuItem>
                            <MenuItem value="true">只看成功</MenuItem>
                            <MenuItem value="false">只看失败</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={selectBar.root}>
                    <FormControl>
                        <Input
                            name="keyword"
                            onChange={this.onChange}
                            value={keyword}
                            startAdornment={
                                <InputAdornment position="start">手机号</InputAdornment>
                            }
                            placeholder="请输入"
                        />
                    </FormControl>
                    <Button
                        color="primary"
                        variant="contained"
                        className="small"
                        startIcon={<span className="material-icons">search</span>}
                        onClick={this.onSearch}
                    >
                        查 询
                    </Button>
                    <Button variant="contained" className="small" onClick={this.toggleExport}>
                        导出数据
                    </Button>
                </div>
                <MyTable
                    className={styles.table1}
                    length={list.length}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={this.onPaginationChange}
                >
                    <TableHead className={classNames({ [styles.otpThead]: list.length })}>
                        <TableRow>
                            <TableCell>接收人</TableCell>
                            <TableCell>验证码</TableCell>
                            <TableCell>发送内容</TableCell>
                            <TableCell>创建时间</TableCell>
                            <TableCell>过期时间</TableCell>
                            <TableCell>发送状态</TableCell>
                            <TableCell>校验失败次数</TableCell>
                            <TableCell>最多失败次数</TableCell>
                            <TableCell>校验状态</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.recipient}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell className={styles.otpContent}>{item.content}</TableCell>
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
                </MyTable>
                <ExportDialog
                    open={exportOpen}
                    onClose={this.toggleExport}
                    clientId={clientId}
                    days={days}
                    sendSuccess={sendSuccess}
                    verifySuccess={verifySuccess}
                    keyword={keyword}
                    key={Date()}
                />
            </div>
        );
    }
}

export default OtpRecord;

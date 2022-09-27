import React, { PureComponent } from "react";
import styles from "./index.module.css";
import http from "my/http";
import ExportDialog from "./ExportDialog";
import SelectBar from "./SelectBar";
import OtpTable from "./OtpTable";

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
        const { clientId, days, sendSuccess, verifySuccess, keyword, current, pageSize } =
            this.state;

        const params = { current, pageSize, keyword, days };
        if (clientId !== "all") params.clientId = clientId;
        if (sendSuccess !== "all") params.sendSuccess = sendSuccess;
        if (verifySuccess !== "all") params.verifySuccess = verifySuccess;

        const { list, total } = await http.get("otp", { params });
        this.setState({ list, total, loading: false });
    };

    onClientChange = (clientId) => {
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

        return (
            <div className={styles.root}>
                <h1>OTP记录</h1>
                <p>
                    查看最近的OTP发送、校验记录。
                    <span style={{ color: "#7f7f7f" }}>（保留三个月数据）</span>
                </p>
                <SelectBar
                    clientId={clientId}
                    days={days}
                    sendSuccess={sendSuccess}
                    verifySuccess={verifySuccess}
                    keyword={keyword}
                    onClientChange={this.onClientChange}
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                    onExport={this.toggleExport}
                />
                <OtpTable
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                />
                <ExportDialog
                    open={exportOpen}
                    onClose={this.toggleExport}
                    clientId={clientId}
                    days={days}
                    sendSuccess={sendSuccess}
                    verifySuccess={verifySuccess}
                    keyword={keyword}
                />
            </div>
        );
    }
}

export default OtpRecord;

import React, { PureComponent } from "react";
import styles from "./index.module.css";
import http from "my/http";
import SelectBar from "./SelectBar";
import UserActiveTable from "./UserActiveTable";
import tipBox from "components/TipBox.module.css";

class UserLog extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        keyword: "",
        clientId: "all",
        gteDate: "",
        lteDate: "",
        success: "all"
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const { clientId, keyword, current, pageSize, gteDate, lteDate, success } = this.state;

        const params = { current, pageSize, keyword };
        if (clientId !== "all") params.clientId = clientId;
        if (success !== "all") params.success = success;
        if (gteDate) params.gteDate = gteDate;
        if (lteDate) params.lteDate = lteDate;

        const { list, total } = await http.get("user-logs", { params });
        this.setState({ list, total, loading: false });
    };

    onClientChange = (clientId) => {
        this.setState({ clientId });
    };

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    };

    onSearch = () => {
        this.setState({ current: 1 }, this.initData);
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    render() {
        const {
            clientId,
            lteDate,
            gteDate,
            success,
            keyword,
            list,
            loading,
            current,
            pageSize,
            total
        } = this.state;

        return (
            <div className={styles.root}>
                <h1>用户日志</h1>
                <p>
                    查看最近的用户登录行为日志。
                    <span style={{ color: "#7f7f7f" }}>（保留三个月数据）</span>
                </p>
                <SelectBar
                    clientId={clientId}
                    lteDate={lteDate}
                    gteDate={gteDate}
                    success={success}
                    keyword={keyword}
                    onClientChange={this.onClientChange}
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                />
                <UserActiveTable
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                />
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            本页只记录通过SSO完成的登录，对于通过OTP验证码完成的认证，不认为是正式的登录，不会记录。
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default UserLog;

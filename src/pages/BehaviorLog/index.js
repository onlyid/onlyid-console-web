import React, { PureComponent } from "react";
import styles from "./index.module.css";
import http from "my/http";
import SelectBar from "./SelectBar";
import OperationTable from "./OperationTable";
import UserActiveTable from "./UserActiveTable";
import moment from "moment";
import { DATE_FORMAT } from "my/constants";
import tipBox from "components/TipBox.module.css";

class BehaviorLog extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        type: "userActive",
        realType: "userActive",
        keyword: "",
        clientId: "all",
        gteDate: null,
        lteDate: null,
        success: "all"
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const {
            clientId,
            keyword,
            current,
            pageSize,
            gteDate,
            lteDate,
            success,
            type
        } = this.state;

        const params = {
            current,
            pageSize,
            keyword
        };
        if (clientId !== "all") params.clientId = clientId;
        if (success !== "all") params.success = success;
        if (gteDate) {
            params.gteDate = moment(gteDate).format(DATE_FORMAT);
            params.lteDate = moment(lteDate).format(DATE_FORMAT);
        }

        let url = "logs/";
        if (type === "userActive") url += "user-active";
        else url += "operation";

        const { list, total } = await http.get(url, { params });
        this.setState({ list, total, loading: false, realType: type });
    };

    onClientChange = clientId => {
        this.setState({ clientId });
    };

    onDateChange = (key, value) => {
        this.setState({ [key]: value });
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
            type,
            lteDate,
            gteDate,
            success,
            keyword,
            list,
            loading,
            current,
            pageSize,
            total,
            realType
        } = this.state;

        return (
            <div className={styles.root}>
                <h1>行为日志</h1>
                <p>
                    查看用户登录日志和开发者操作日志（控制台和Open API）。
                    <span style={{ color: "#7f7f7f" }}>（保留三个月数据）</span>
                </p>
                <SelectBar
                    type={type}
                    clientId={clientId}
                    lteDate={lteDate}
                    gteDate={gteDate}
                    success={success}
                    keyword={keyword}
                    onClientChange={this.onClientChange}
                    onDateChange={this.onDateChange}
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                />
                {realType === "userActive" ? (
                    <UserActiveTable
                        list={list}
                        loading={loading}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        onPaginationChange={this.onPaginationChange}
                    />
                ) : (
                    <OperationTable
                        list={list}
                        loading={loading}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        onPaginationChange={this.onPaginationChange}
                    />
                )}
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            用户登录日志只记录通过SSO完成的登录，对于通过OTP验证码完成的认证，不认为是正式的登录，不会记录。
                        </li>
                        <li>
                            为了节省磁盘空间，控制台日志不会记录查询操作，而Open
                            API日志则会完整记录所有调用请求。
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default BehaviorLog;

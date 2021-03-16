import React, { PureComponent } from "react";
import http from "my/http";
import CountItem from "../CountItem";
import styles from "../index.module.css";

class Summary extends PureComponent {
    state = {
        totalCount: 0,
        yesterdayRequest: 0,
        yesterdaySendSuccess: 0,
        yesterdayVerifySuccess: 0,
        periodRequest: 0,
        periodSendSuccess: 0,
        periodVerifySuccess: 0
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clientId, days } = this.props;
        if (clientId !== prevProps.clientId || days !== prevProps.days) this.initData();
    }

    initData = async () => {
        const { clientId, days } = this.props;
        const params = {};
        if (clientId !== "all") params.clientId = clientId;
        const { totalCount } = await http.get("statistics/otp/total-count", { params });

        params.days = 1;
        const {
            request: yesterdayRequest,
            sendSuccess: yesterdaySendSuccess,
            verifySuccess: yesterdayVerifySuccess
        } = await http.get("statistics/otp/summary", { params });

        params.days = days;
        const {
            request: periodRequest,
            sendSuccess: periodSendSuccess,
            verifySuccess: periodVerifySuccess
        } = await http.get("statistics/otp/summary", { params });

        this.setState({
            totalCount,
            yesterdayRequest,
            yesterdaySendSuccess,
            yesterdayVerifySuccess,
            periodRequest,
            periodSendSuccess,
            periodVerifySuccess
        });
    };

    render() {
        const {
            totalCount,
            yesterdayRequest,
            yesterdaySendSuccess,
            yesterdayVerifySuccess,
            periodRequest,
            periodSendSuccess,
            periodVerifySuccess
        } = this.state;
        const { days } = this.props;

        return (
            <div className={styles.summary}>
                <h3>
                    汇总数据
                    <span className={styles.otpTotalCount}>
                        （已累计为你发送验证码
                        <span> {totalCount} </span>
                        条，节省费用
                        <span> {(totalCount * 0.05).toFixed(1)} </span>元）
                    </span>
                </h3>
                <div className={styles.countBox}>
                    <CountItem title="请求发送" days="昨天" count={yesterdayRequest} />
                    <CountItem title="发送成功" days="昨天" count={yesterdaySendSuccess} />
                    <CountItem title="校验成功" days="昨天" count={yesterdayVerifySuccess} />
                    <CountItem title="请求发送" days={`最近${days}天`} count={periodRequest} />
                    <CountItem title="发送成功" days={`最近${days}天`} count={periodSendSuccess} />
                    <CountItem
                        title="校验成功"
                        days={`最近${days}天`}
                        count={periodVerifySuccess}
                    />
                </div>
            </div>
        );
    }
}

export default Summary;

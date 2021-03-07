import React, { PureComponent } from "react";
import http from "my/http";
import CountItem from "../CountItem";
import styles from "../index.module.css";

class Summary extends PureComponent {
    state = {
        totalCount: 0,
        yesterdayNew: 0,
        yesterdayActive: 0,
        periodNew: 0,
        periodActive: 0
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
        if (clientId !== -1) params.clientId = clientId;
        const { totalCount } = await http.get("statistics/users/total-count", { params });

        params.days = 1;
        const {
            active: yesterdayActive,
            new: yesterdayNew
        } = await http.get("statistics/users/summary", { params });

        params.days = days;
        const { active: periodActive, new: periodNew } = await http.get(
            "statistics/users/summary",
            { params }
        );

        this.setState({
            totalCount,
            yesterdayNew,
            yesterdayActive,
            periodNew,
            periodActive
        });
    };

    render() {
        const { totalCount, yesterdayNew, yesterdayActive, periodNew, periodActive } = this.state;
        const { days } = this.props;

        return (
            <div className={styles.summary}>
                <h3>汇总数据</h3>
                <div className={styles.countBox}>
                    <CountItem title="总用户数" days="历史总共" count={totalCount} />
                    <CountItem title="新增用户" days="昨天" count={yesterdayNew} />
                    <CountItem title="活跃用户" days="昨天" count={yesterdayActive} />
                    <CountItem title="新增用户" days={`最近${days}天`} count={periodNew} />
                    <CountItem title="活跃用户" days={`最近${days}天`} count={periodActive} />
                </div>
            </div>
        );
    }
}

export default Summary;

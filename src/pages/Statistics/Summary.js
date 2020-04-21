import React, { PureComponent } from "react";
import { Descriptions } from "antd";
import http from "my/http";
import { connect } from "react-redux";
import styles from "./index.module.css";

const { Item } = Descriptions;

class Summary extends PureComponent {
    state = {
        data: {}
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            statistics: { selectedKey }
        } = this.props;
        if (prevProps.statistics.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const {
            statistics: { selectedKey }
        } = this.props;

        if (!selectedKey) return;

        const params = { clientId: selectedKey === "all" ? null : selectedKey };
        const data = await http.get("statistic/summary", { params });
        this.setState({ data });
    };

    render() {
        const { data } = this.state;
        const {
            statistics: { selectedKey }
        } = this.props;

        return (
            <>
                <Descriptions column={2} bordered>
                    <Item label="总用户数" span={2}>
                        {data.userTotal}
                    </Item>
                    <Item label="昨天新增用户数">{data.userNewYesterday}</Item>
                    <Item label="最近7天新增用户数">{data.userNewLastWeek}</Item>
                    <Item label="最近30天新增用户数" span={2}>
                        {data.userNewLastMonth}
                    </Item>
                    <Item label="昨天活跃用户数">{data.userActiveYesterday}</Item>
                    <Item label="最近7天活跃用户数">{data.userActiveLastWeek}</Item>
                    <Item label="最近30天活跃用户数" span={2}>
                        {data.userActiveLastMonth}
                    </Item>
                </Descriptions>
                <Descriptions column={2} bordered style={{ marginTop: 30 }}>
                    <Item label="昨天发送验证码数">{data.otpSentYesterday}</Item>
                    <Item label="最近7天发送验证码数">{data.otpSentLastWeek}</Item>
                    <Item label="最近30天发送验证码数" span={2}>
                        {data.otpSentLastMonth}
                    </Item>
                </Descriptions>
                {selectedKey === "all" && (
                    <p className={styles.otpSentTotal}>
                        「唯ID OTP」服务已累计为你发送验证码
                        <span> {data.otpSentTotal} </span>
                        条，节省费用
                        <span> {data.otpSentTotal * 0.05} </span>元。
                    </p>
                )}
            </>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(Summary);

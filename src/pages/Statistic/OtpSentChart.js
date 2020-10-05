import React, { PureComponent } from "react";
import http from "my/http";
import { connect } from "react-redux";
import BaseChart from "./BaseChart";

class OtpSentChart extends PureComponent {
    state = {
        failList: [],
        successList: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            statistics: { selectedKey }
        } = this.props;
        const params = {};
        if (selectedKey !== "all") params.clientId = selectedKey;
        const { failList, successList } = await http.get("statistics/otp-sent/by-day", {
            params
        });

        this.setState({ failList, successList });
    };

    render() {
        const { failList, successList } = this.state;

        return <BaseChart failList={failList} successList={successList} />;
    }
}

export default connect(({ statistics }) => ({ statistics }))(OtpSentChart);

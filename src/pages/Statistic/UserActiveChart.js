import React, { PureComponent } from "react";
import http from "my/http";
import { connect } from "react-redux";
import BaseChart from "./BaseChart";

class UserActiveChart extends PureComponent {
    state = {
        failList: [],
        successList: []
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isNew } = this.props;
        if (isNew !== prevProps.isNew) this.initData();
    }

    initData = async () => {
        const {
            statistics: { selectedKey },
            isNew
        } = this.props;
        const params = { isNew };
        if (selectedKey !== "all") params.clientId = selectedKey;
        const { failList, successList } = await http.get("statistics/users-active/by-day", {
            params
        });

        this.setState({ failList, successList });
    };

    render() {
        const { failList, successList } = this.state;

        return <BaseChart failList={failList} successList={successList} />;
    }
}

export default connect(({ statistics }) => ({ statistics }))(UserActiveChart);

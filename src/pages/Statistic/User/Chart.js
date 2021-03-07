import React, { PureComponent } from "react";
import http from "my/http";
import BaseChart from "../BaseChart";

class Chart extends PureComponent {
    state = {
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clientId, days, type } = this.props;
        if (clientId !== prevProps.clientId || days !== prevProps.days || type !== prevProps.type)
            this.initData();
    }

    initData = async () => {
        const { clientId, days, type } = this.props;
        const params = { days, type };
        if (clientId !== -1) params.clientId = clientId;
        const list = await http.get("statistics/users/group-by-date", {
            params
        });
        this.setState({ list });
    };

    render() {
        const { list } = this.state;
        const { typeList, type, days } = this.props;

        const name = typeList.find(item => item.value === type).label;

        return <BaseChart days={days} list={list} name={name} />;
    }
}

export default Chart;

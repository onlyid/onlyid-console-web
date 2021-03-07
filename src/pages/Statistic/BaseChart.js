import React, { PureComponent } from "react";
import moment from "moment";
import echarts from "echarts";
import styles from "./index.module.css";

const CHART_OPTION = {
    series: [
        {
            type: "line",
            data: [],
            itemStyle: { color: "rgba(63, 81, 181, 0.9)" },
            lineStyle: { width: 1 },
            smooth: true
        }
    ],
    tooltip: { trigger: "axis" },
    grid: { left: "1%", right: "2%", bottom: "0", top: "1%", containLabel: true },
    xAxis: { boundaryGap: false, data: [] },
    yAxis: { minInterval: 1 }
};

class BaseChart extends PureComponent {
    chart;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.chart = echarts.init(this.ref.current);
        this.chart.setOption(CHART_OPTION);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { list } = this.props;
        if (list !== prevProps.list) this.showChart(this.formatData(list));
    }

    /**
     * 补齐空项 转换成count数组
     */
    formatData = list => {
        const { days } = this.props;

        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - days + 1);
        const countArr = [];
        let index = 0;
        for (let i = 0; i < days; i++) {
            if (index >= list.length) {
                countArr.push(0);
                continue;
            }

            const item = list[index];
            const d = new Date(item.date);
            // 时区是GMT+8 所以要减
            d.setHours(d.getHours() - 8);
            if (d > date) {
                countArr.push(0);
            }
            // 此时d == date
            else {
                countArr.push(item.count);
                index++;
            }
            date.setDate(date.getDate() + 1);
        }

        return countArr;
    };

    showChart = countArr => {
        const { days, name } = this.props;

        const xAxisData = [];
        const date = new Date();
        date.setDate(date.getDate() - days + 1);
        for (let i = 0; i < days; i++) {
            xAxisData.push(moment(date).format("MM-DD"));
            date.setDate(date.getDate() + 1);
        }

        const chartOption = {
            series: [{ name, data: countArr }],
            xAxis: { data: xAxisData }
        };
        this.chart.setOption(chartOption);
    };

    render() {
        return (
            <div className={styles.chart}>
                <div ref={this.ref} />
            </div>
        );
    }
}

export default BaseChart;

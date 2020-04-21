import React, { PureComponent } from "react";
import echarts from "echarts";
import moment from "moment";
import http from "my/http";
import { connect } from "react-redux";
import styles from "./index.module.css";
import { Button } from "antd";

const CHART_OPTION = {
    tooltip: { trigger: "axis" },
    grid: { left: "0%", right: "1%", bottom: "0%", top: "1%", containLabel: true },
    xAxis: { boundaryGap: false, data: [] },
    yAxis: { minInterval: 1 }
};

class UsersActiveChart extends PureComponent {
    xAxisData = [];
    chart1;
    successCountArr = [];
    failCountArr = [];

    state = {
        isRecent30: true
    };

    componentDidMount() {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        for (let i = 0; i < 30; i++) {
            this.xAxisData.push(moment(date).format("MM-DD"));
            date.setDate(date.getDate() + 1);
        }

        this.chart1 = echarts.init(document.getElementById("chart1"));
        this.chart1.setOption(CHART_OPTION);

        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isNew } = this.props;
        if (isNew !== prevProps.isNew) this.initData();
    }

    /**
     * 补齐空项 转换成count数组
     */
    formatData = list => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - 30);
        const countArr = [];
        let index = 0;
        for (let i = 0; i < 30; i++) {
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

    initData = async () => {
        const {
            statistics: { selectedKey },
            isNew
        } = this.props;
        const params = { isNew };
        if (selectedKey !== "all") params.clientId = selectedKey;
        const { failList, successList } = await http.get("statistic/users-active/by-day", {
            params
        });

        this.successCountArr = this.formatData(successList);
        this.failCountArr = this.formatData(failList);

        this.showChart();
    };

    showChart = () => {
        const { isRecent30 } = this.state;
        let arr1, arr2, x;
        if (isRecent30) {
            arr1 = this.successCountArr;
            arr2 = this.failCountArr;
            x = this.xAxisData;
        } else {
            arr1 = this.successCountArr.slice(23, 30);
            arr2 = this.failCountArr.slice(23, 30);
            x = this.xAxisData.slice(23, 30);
        }

        const chartOption = {
            series: [
                {
                    name: "成功",
                    type: "line",
                    data: arr1,
                    itemStyle: { color: "#52c41a" }
                },
                {
                    name: "失败",
                    type: "line",
                    data: arr2,
                    itemStyle: { color: "#f5222d" }
                }
            ],
            xAxis: { data: x }
        };
        this.chart1.setOption(chartOption);
    };

    toggleRecent = () => {
        this.setState(({ isRecent30 }) => ({ isRecent30: !isRecent30 }), this.showChart);
    };

    render() {
        const { isRecent30 } = this.state;

        return (
            <div className={styles.chart}>
                <div className={styles.recentButtonBox}>
                    切换：
                    <Button type="link" onClick={this.toggleRecent} size="small">
                        最近{isRecent30 ? 7 : 30}天
                    </Button>
                </div>
                <div id="chart1" style={{ height: 570 }} />
            </div>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(UsersActiveChart);

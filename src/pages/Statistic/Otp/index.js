import React, { PureComponent } from "react";
import TitleWithSelect from "../TitleWithSelect";
import Chart from "./Chart";
import Summary from "./Summary";
import Latest from "./Latest";

class Otp extends PureComponent {
    state = {
        clientId: -1,
        days: 30,
        type: "request"
    };

    onChange = (key, value) => {
        this.setState({ [key]: value });
    };

    render() {
        const { clientId, days, type } = this.state;

        const typeList = [
            { label: "请求发送量", value: "request" },
            { label: "发送成功量", value: "sendSuccess" },
            { label: "校验成功量", value: "verifySuccess" }
        ];

        return (
            <>
                <TitleWithSelect
                    title="OTP 最近发送验证码"
                    clientId={clientId}
                    days={days}
                    type={type}
                    typeList={typeList}
                    onChange={this.onChange}
                />
                <Chart clientId={clientId} days={days} type={type} typeList={typeList} />
                <Summary clientId={clientId} days={days} />
                <Latest clientId={clientId} />
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            汇总数据受应用和时间筛选栏影响，如：时间筛选栏选择
                            "最近7天"，则右侧展示的是最近7天的发送/校验数据。
                        </li>
                        <li>
                            最近发送列表受应用筛选栏影响，如：应用筛选栏选择
                            "某应用A"，则列表展示的是应用A的最近5条发送记录。
                        </li>
                        <li>
                            本页只统计通过OTP Open
                            API发送的验证码，不包括应用接入SSO后通过SSO发送的验证码。
                        </li>
                    </ol>
                </div>
            </>
        );
    }
}

export default Otp;

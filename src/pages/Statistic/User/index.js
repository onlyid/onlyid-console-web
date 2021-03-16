import React, { PureComponent } from "react";
import TitleWithSelect from "../TitleWithSelect";
import Chart from "./Chart";
import Summary from "./Summary";
import Latest from "./Latest";

class User extends PureComponent {
    state = {
        clientId: "all",
        days: 30,
        type: "new"
    };

    onChange = (key, value) => {
        this.setState({ [key]: value });
    };

    render() {
        const { clientId, days, type } = this.state;

        const typeList = [
            { label: "新增用户", value: "new" },
            { label: "活跃用户", value: "active" }
        ];

        return (
            <>
                <TitleWithSelect
                    title="SSO 最近 新增 / 活跃 用户"
                    clientId={clientId}
                    days={days}
                    type={type}
                    typeList={typeList}
                    onChange={this.onChange}
                />
                <Chart clientId={clientId} days={days} type={type} typeList={typeList} />
                <Summary clientId={clientId} days={days} />
                <Latest clientId={clientId} key="new" type="new" />
                <Latest clientId={clientId} key="active" type="active" />
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            汇总数据受应用和时间筛选栏影响，如：时间筛选栏选择
                            "最近7天"，则右侧展示的是最近7天的新增/活跃用户数。
                        </li>
                        <li>
                            最近新增和最近活跃列表受应用筛选栏影响，如：应用筛选栏选择
                            "某应用A"，则两个列表展示的是应用A的最近5条新增/活跃记录。
                        </li>
                        <li>
                            本页所有新增/活跃数据只统计登录成功的用户，不包括各种原因（如密码错误）登录失败的用户。
                        </li>
                        <li>
                            用户新增仅代表该用户首次使用你的应用，不代表该用户首次注册账号（可能在使用其他开发者的应用时已注册）。
                        </li>
                        <li>
                            折线图和汇总数据的活跃用户是去重的，如：最近30天的活跃用户是100，则表示30天内有100个不同的用户登录；相反，最近活跃列表不去重。
                        </li>
                        <li>
                            活跃用户包含新增用户，如：最近30天的活跃用户是100，则可能有90个是老用户，还有10个是新用户（只登录了一次）。
                        </li>
                    </ol>
                </div>
            </>
        );
    }
}

export default User;

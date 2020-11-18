import React, { PureComponent } from "react";
import { Checkbox, message } from "antd";
import styles from "./index.module.css";
import http from "my/http";

class NotificationSetting extends PureComponent {
    state = {
        product: [],
        warn: [],
        news: [],
        other: [],
        finance: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const notificationSetting = await http.get("admin/notification-setting");
        this.setState({ ...notificationSetting });
    };

    submit = async () => {
        await http.put("admin/notification-setting", this.state);
        message.success("保存成功");
    };

    onChange = async ({ target: { name, checked } }) => {
        const arr = name.split(" ");
        const category = arr[0];
        const channel = arr[1];

        const { [category]: channelArray } = this.state;

        if (checked) {
            channelArray.push(channel);
        } else {
            const index = channelArray.indexOf(channel);
            channelArray.splice(index, 1);
        }

        this.setState({ [category]: [...channelArray] });

        this.submit();
    };

    render() {
        const { product, warn, news, other, finance } = this.state;

        return (
            <div>
                <p>选择你希望接收唯ID发送的哪些通知。</p>
                <table className={styles.notificationTable}>
                    <tbody>
                        <tr>
                            <td>类型</td>
                            <td>站内信</td>
                            <td>邮件</td>
                            <td>短信</td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.category}>财务消息</span>
                                （服务即将过期预警、服务已过期通知、账单出账通知等）
                            </td>
                            <td>
                                <Checkbox disabled checked={finance.includes("MSG")} />
                            </td>
                            <td>
                                <Checkbox
                                    checked={finance.includes("EMAIL")}
                                    name="finance EMAIL"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={finance.includes("SMS")}
                                    name="finance SMS"
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.category}>产品消息</span>
                                （重大版本升级需开发者配合、重要产品变更通知等）
                            </td>
                            <td>
                                <Checkbox disabled checked={product.includes("MSG")} />
                            </td>
                            <td>
                                <Checkbox
                                    checked={product.includes("EMAIL")}
                                    name="product EMAIL"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={product.includes("SMS")}
                                    name="product SMS"
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.category}>警告消息</span>
                                （应用被举报或API请求异常导致服务暂停、安全事件通知等）
                            </td>
                            <td>
                                <Checkbox disabled checked={warn.includes("MSG")} />
                            </td>
                            <td>
                                <Checkbox
                                    checked={warn.includes("EMAIL")}
                                    name="warn EMAIL"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={warn.includes("SMS")}
                                    name="warn SMS"
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.category}>唯ID动态</span>
                                （问卷回访、产品更新、产品推荐、优惠活动通知等）
                            </td>
                            <td>
                                <Checkbox
                                    checked={news.includes("MSG")}
                                    name="news MSG"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={news.includes("EMAIL")}
                                    name="news EMAIL"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={news.includes("SMS")}
                                    name="news SMS"
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.category}>其他消息</span>
                                （不属于以上类型的所有其他消息通知）
                            </td>
                            <td>
                                <Checkbox
                                    checked={other.includes("MSG")}
                                    name="other MSG"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={other.includes("EMAIL")}
                                    name="other EMAIL"
                                    onChange={this.onChange}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    checked={other.includes("SMS")}
                                    name="other SMS"
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="tip" style={{ marginTop: "2em", marginBottom: 5 }}>
                    温馨提示：
                </p>
                <ul className="tip ulTip">
                    <li>1）邮件/短信仅在你账号的邮箱/手机号可用时才会发送。</li>
                    <li>
                        2）<span style={{ color: "#52c41a" }}>请放心</span>
                        ，唯ID恪守「不打扰原则」，不会给你发送无意义的垃圾信息。
                    </li>
                </ul>
            </div>
        );
    }
}

export default NotificationSetting;

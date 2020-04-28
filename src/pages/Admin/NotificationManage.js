import React, { PureComponent } from "react";
import { Checkbox, message } from "antd";
import styles from "./index.module.css";
import http from "my/http";

class NotificationManage extends PureComponent {
    options = [
        {
            label: "服务通知（产品即将过期、SDK版本升级需开发者配合等）",
            value: "service"
        },
        {
            label: "应用通知（应用被多人举报、API请求异常导致服务暂停等）",
            value: "client"
        },
        {
            label: "平台公告（现有产品更新、新产品推荐、优惠活动等）",
            value: "news"
        }
    ];

    submit = async body => {
        const tenantInfo = await http.put("admin/notification", body);
        localStorage.setObj("tenantInfo", tenantInfo);
        message.success("保存成功");
    };

    onCategoryChange = async checkedValues => {
        this.submit({ category: checkedValues });
    };

    onSendEmailChange = async ({ target: { checked } }) => {
        this.submit({ sendEmail: checked });
    };

    render() {
        const { notificationCategory, notificationSendEmail } = localStorage.getObj("tenantInfo");
        return (
            <div className={styles.notification}>
                <p>选择你希望接收唯ID发送的哪些通知。</p>
                <Checkbox.Group
                    options={this.options}
                    defaultValue={notificationCategory}
                    onChange={this.onCategoryChange}
                />
                <hr className={styles.hr1} style={{ margin: "15px 0" }} />
                <Checkbox defaultChecked={notificationSendEmail} onChange={this.onSendEmailChange}>
                    以上通知同步发送邮件（如果邮箱可用）
                </Checkbox>
            </div>
        );
    }
}

export default NotificationManage;

import React, { PureComponent } from "react";
import styles from "./Notification.module.css";
import http from "my/http";
import tipBox from "components/TipBox.module.css";
import LevelSymbol from "components/LevelSymbol";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup
} from "@material-ui/core";
import { eventEmitter } from "my/utils";

class Notification extends PureComponent {
    state = {
        notifyNormal: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { notifyNormal } = localStorage.getObj("tenantInfo");
        this.setState({ notifyNormal: String(notifyNormal) });
    };

    submit = async () => {
        const tenantInfo = await http.put("tenant/notification", this.state);
        localStorage.setObj("tenantInfo", tenantInfo);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    onChange = e => {
        this.setState({ notifyNormal: e.target.value }, this.submit);
    };

    render() {
        const { notifyNormal } = this.state;

        return (
            <>
                <p style={{ marginTop: 45 }}>
                    根据内容的重要程度，唯ID将消息分成 <LevelSymbol important /> 和 <LevelSymbol />{" "}
                    两个级别。
                </p>
                <p>一些常见的重要消息：</p>
                <ol className={styles.ol1}>
                    <li>服务即将过期预警、服务已过期通知。</li>
                    <li>重大版本升级可能需开发者配合。</li>
                    <li>应用被举报或API请求异常导致服务暂停。</li>
                </ol>
                <p>一些常见的普通消息：</p>
                <ol className={styles.ol1}>
                    <li>问卷回访，如开发某个功能前调查大家的接受意愿。</li>
                    <li>常规更新，如每月一次的常规产品迭代更新。</li>
                    <li>优惠活动，如每年一次的双十一续费优惠活动。</li>
                </ol>
                <hr className={styles.hr1} />
                <p>
                    对于重要消息，通过站内信、邮件、短信同步发送；对于普通消息，可设置只发送站内信或同步发送三端：
                </p>
                <div className={styles.box1}>
                    <label>发送邮件/短信：</label>
                    <FormControl>
                        <RadioGroup row name="type" value={notifyNormal} onChange={this.onChange}>
                            <FormControlLabel
                                value="false"
                                control={<Radio color="primary" />}
                                label="仅重要消息"
                            />
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="自动（推荐）"
                            />
                        </RadioGroup>
                        <FormHelperText>
                            自动：除重要消息外，由唯ID从普通消息挑选有价值的发送邮件、短信。
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>邮件/短信仅在你账号的邮箱/手机号可用时才会发送。</li>
                        <li>
                            所有消息都会发送站内信，重要消息会发送邮件、短信，无法更改，请知悉。
                        </li>
                    </ol>
                </div>
            </>
        );
    }
}

export default Notification;

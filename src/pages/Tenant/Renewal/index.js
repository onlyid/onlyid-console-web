import React, { PureComponent } from "react";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import styles from "./index.module.css";
import { Button } from "@material-ui/core";
import tipBox from "components/TipBox.module.css";
import RenewDialog from "./RenewDialog";
import ChargeTable from "./ChargeTable";

class Renewal extends PureComponent {
    state = {
        renewOpen: false
    };

    toggleRenew = () => {
        this.setState(({ renewOpen }) => ({ renewOpen: !renewOpen }));
    };

    render() {
        const { renewOpen } = this.state;
        const { expireDate, smsRemain } = localStorage.getObj("tenantInfo");
        const expired = moment(expireDate) < moment();

        const status = expired ? (
            <>
                <span style={{ color: "#f44336" }}>已过期</span>
                （请续费）
            </>
        ) : (
            <>
                <span style={{ color: "#4caf50" }}>正常</span>（
                {moment(expireDate).diff(moment(), "days")}
                天后到期）
            </>
        );

        const smsStatus = smsRemain ? (
            <span>{smsRemain}</span>
        ) : (
            <span style={{ color: "#f44336" }}>已耗尽</span>
        )

        return (
            <>
                <div className={styles.headerBox}>
                    <div className={styles.statusBox}>
                        <div>
                            <p>订阅有效期</p>
                            <p>{moment(expireDate).format(DATE_TIME_FORMAT)}</p>
                        </div>
                        <div>
                            <p>订阅状态</p>
                            <p>{status}</p>
                        </div>
                        <div>
                            <p>短信余量</p>
                            <p style={{ textAlign: "center" }}>{smsStatus}</p>
                        </div>
                    </div>
                    <div className={styles.buttonBox}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.toggleRenew}
                        >
                            订阅续费
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.toggleRenew}
                        >
                            购买短信
                        </Button>
                    </div>
                </div>
                {expired && (
                    <p>
                        <span style={{ color: "#4caf50" }}>请放心</span>
                        ，服务过期不会删除你的数据，也不会停止OTP、SSO等对用户的服务，现在续费即可解除对控制台的访问限制。
                    </p>
                )}
                <hr className={styles.hr1} />
                <h3>支付记录</h3>
                <ChargeTable />
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>如果续费遇到问题，请联系客服处理。</li>
                        <li>保留最长三年的续费记录，过期会自动删除。</li>
                    </ol>
                </div>
                <RenewDialog expireDate={expireDate} open={renewOpen} onCancel={this.toggleRenew} />
            </>
        );
    }
}

export default Renewal;

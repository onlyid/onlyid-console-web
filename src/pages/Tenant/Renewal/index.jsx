import { useState } from "react"
import moment from "moment"
import { DATE_TIME_FORMAT } from "@/my/constants"
import styles from "./index.module.css"
import { Button, Tooltip } from "@mui/material"
import tipBox from "@/components/TipBox.module.css"
import RenewDialog from "./RenewDialog"
import ChargeTable from "./ChargeTable"

const separateNumber = (num) => {
    const s = num.toString()

    if (s.length < 5) return s

    const part1 = s.substring(0, s.length - 4)
    const part2 = s.substring(s.length - 4)
    return part1 + "," + part2
}

export default function Renewal() {
    const [renewOpen, setRenewOpen] = useState(false)

    const toggleRenew = () => {
        setRenewOpen((value) => !value)
    }

    const { expireDate, smsRemain } = localStorage.getObj("tenantInfo")
    const expired = moment(expireDate) < moment()

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
    )

    const smsStatus = smsRemain ? (
        <span>{separateNumber(smsRemain) + " 条"}</span>
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
                        <p>
                            短信余量{" "}
                            <Tooltip
                                title="SSO功能不消耗短信，本字段仅供使用OTP功能（已移除）的开发者使用"
                                placement="top"
                                classes={{ tooltip: styles.tooltip1 }}
                            >
                                <span className="material-icons">help</span>
                            </Tooltip>
                        </p>
                        <p style={{ textAlign: "center" }}>{smsStatus}</p>
                    </div>
                </div>
                <div className={styles.buttonBox}>
                    <Button color="primary" variant="contained" onClick={toggleRenew}>
                        订阅续费
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
                    <li>如果支付遇到问题，请联系客服处理。</li>
                    <li>保留最长三年的支付记录，过期会自动删除。</li>
                </ol>
            </div>
            <RenewDialog expireDate={expireDate} open={renewOpen} onCancel={toggleRenew} />
        </>
    )
}

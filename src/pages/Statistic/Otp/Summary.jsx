import { PureComponent } from "react"
import request from "@/my/request"
import CountItem from "../CountItem"
import styles from "../index.module.css"

class Summary extends PureComponent {
    state = {
        yesterdayRequest: 0,
        yesterdaySendSuccess: 0,
        yesterdayVerifySuccess: 0,
        periodRequest: 0,
        periodSendSuccess: 0,
        periodVerifySuccess: 0
    }

    componentDidMount() {
        this.initData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clientId, days } = this.props
        if (clientId !== prevProps.clientId || days !== prevProps.days) this.initData()
    }

    initData = async () => {
        const { clientId, days } = this.props
        const params = {}
        if (clientId !== "all") params.clientId = clientId

        params.days = 1
        const {
            request: yesterdayRequest,
            sendSuccess: yesterdaySendSuccess,
            verifySuccess: yesterdayVerifySuccess
        } = await request.get("statistics/otp/summary", { params })

        params.days = days
        const {
            request: periodRequest,
            sendSuccess: periodSendSuccess,
            verifySuccess: periodVerifySuccess
        } = await request.get("statistics/otp/summary", { params })

        this.setState({
            yesterdayRequest,
            yesterdaySendSuccess,
            yesterdayVerifySuccess,
            periodRequest,
            periodSendSuccess,
            periodVerifySuccess
        })
    }

    render() {
        const {
            yesterdayRequest,
            yesterdaySendSuccess,
            yesterdayVerifySuccess,
            periodRequest,
            periodSendSuccess,
            periodVerifySuccess
        } = this.state
        const { days } = this.props

        return (
            <div className={styles.summary}>
                <h3>汇总数据</h3>
                <div className={styles.countBox}>
                    <CountItem title="请求发送" days="昨天" count={yesterdayRequest} />
                    <CountItem title="发送成功" days="昨天" count={yesterdaySendSuccess} />
                    <CountItem title="核验成功" days="昨天" count={yesterdayVerifySuccess} />
                    <CountItem title="请求发送" days={`最近${days}天`} count={periodRequest} />
                    <CountItem title="发送成功" days={`最近${days}天`} count={periodSendSuccess} />
                    <CountItem
                        title="核验成功"
                        days={`最近${days}天`}
                        count={periodVerifySuccess}
                    />
                </div>
            </div>
        )
    }
}

export default Summary

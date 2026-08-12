import { useState, useEffect, memo } from "react"
import request from "my/request"
import CountItem from "../CountItem"
import styles from "../index.module.css"

function Summary({ clientId, days }) {
    const [values, setValues] = useState({
        totalCount: 0,
        yesterdayNew: 0,
        yesterdayActive: 0,
        periodNew: 0,
        periodActive: 0
    })

    useEffect(() => {
        initData()
    }, [clientId, days])

    const initData = async () => {
        const params = {}
        if (clientId !== "all") params.clientId = clientId
        const { totalCount } = await request.get("statistics/users/total-count", { params })

        params.days = 1
        const { active: yesterdayActive, new: yesterdayNew } = await request.get(
            "statistics/users/summary",
            { params }
        )

        params.days = days
        const { active: periodActive, new: periodNew } = await request.get(
            "statistics/users/summary",
            { params }
        )

        setValues({
            totalCount,
            yesterdayNew,
            yesterdayActive,
            periodNew,
            periodActive
        })
    }

    const { totalCount, yesterdayNew, yesterdayActive, periodNew, periodActive } = values

    return (
        <div className={styles.summary}>
            <h3>汇总数据</h3>
            <div className={styles.countBox}>
                <CountItem title="总用户数" days="历史总共" count={totalCount} />
                <CountItem title="新增用户" days="昨天" count={yesterdayNew} />
                <CountItem title="活跃用户" days="昨天" count={yesterdayActive} />
                <CountItem title="新增用户" days={`最近${days}天`} count={periodNew} />
                <CountItem title="活跃用户" days={`最近${days}天`} count={periodActive} />
            </div>
        </div>
    )
}

export default memo(Summary)

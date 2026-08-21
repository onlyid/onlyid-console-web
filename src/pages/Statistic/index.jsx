import styles from "./index.module.css"
import User from "./User"

function Statistic() {
    return (
        <div className={styles.root}>
            <h1>统计概览</h1>
            <p>快速查看最近新增/活跃用户数据</p>
            <User />
        </div>
    )
}

export default Statistic

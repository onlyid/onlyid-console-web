import styles from "./index.module.css"

export default function CountItem({ title, days, count }) {
    return (
        <div className={styles.countItem}>
            <span>{title}</span>
            <span className={styles.count}>{count}</span>
            <span className={styles.days}>{days}</span>
        </div>
    )
}

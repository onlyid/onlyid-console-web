import { Paper } from "@material-ui/core"
import styles from "./DangerZone.module.css"

export default function DangerZone({ children }) {
    return (
        <Paper variant="outlined" className={styles.root}>
            <ul>{children}</ul>
        </Paper>
    )
}

import { Paper } from "@mui/material"
import styles from "./DangerZone.module.css"

export default function DangerZone({ children }) {
    return (
        <Paper variant="outlined" className={styles.root}>
            <ul>{children}</ul>
        </Paper>
    )
}

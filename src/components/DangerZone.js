import React from "react";
import { Paper } from "@material-ui/core";
import styles from "./DangerZone.module.css";

export default function({ children }) {
    return (
        <Paper variant="outlined" className={styles.root}>
            <ul>{children}</ul>
        </Paper>
    );
}

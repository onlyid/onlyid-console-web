import React from "react"
import styles from "./InfoBox.module.css"

export default function InfoBox({ label, children }) {
    return (
        <div className={styles.root}>
            <label>{label}：</label>
            <span>{children}</span>
        </div>
    )
}

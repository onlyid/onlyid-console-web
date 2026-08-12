import React from "react"
import styles from "./GenderSymbol.module.css"
import { GENDER_TEXT } from "@/my/constants"
import cn from "classnames"

export default function GenderSymbol({ gender, dense }) {
    if (!gender) return <span>-</span>

    let icon
    switch (gender) {
        case "male":
            icon = (
                <span className="material-icons" style={{ color: "#1890ff" }}>
                    male
                </span>
            )
            break
        case "female":
            icon = (
                <span className="material-icons" style={{ color: "#f06292" }}>
                    female
                </span>
            )
            break
        default:
            icon = null
    }

    return (
        <span className={cn(styles.root, { [styles.dense]: dense })}>
            {GENDER_TEXT[gender]} {icon}
        </span>
    )
}

import React from "react";
import styles from "./GenderSymbol.module.css";
import { GENDER_TEXT } from "my/constants";
import classNames from "classnames";

export default function({ gender, dense }) {
    if (!gender) return "-";

    let icon;

    switch (gender) {
        case "MALE":
            icon = (
                <span className="material-icons" style={{ color: "#1890ff" }}>
                    male
                </span>
            );
            break;
        case "FEMALE":
            icon = (
                <span className="material-icons" style={{ color: "#f06292" }}>
                    female
                </span>
            );
            break;
        default:
            icon = null;
    }

    return (
        <span className={classNames(styles.root, { [styles.dense]: dense })}>
            {GENDER_TEXT[gender]} {icon}
        </span>
    );
}

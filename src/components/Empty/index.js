import React from "react";
import { ReactComponent as Empty } from "assets/empty.svg";
import styles from "./index.module.css";

export default function({ description }) {
    return (
        <div className={styles.root}>
            <Empty />
            <p>{description}</p>
        </div>
    );
}

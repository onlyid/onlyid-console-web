import React from "react";
import styles from "./EmptyPage.module.css";

export default function({ title, icon, description, children }) {
    return (
        <div className={styles.root}>
            <h1>{title}</h1>
            <span className="material-icons">{icon}</span>
            <p className={styles.tip}>{description}</p>
            {children}
        </div>
    );
}

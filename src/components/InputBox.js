import React from "react";
import styles from "./InputBox.module.css";
import classNames from "classnames";

export default function({ label, children, radioGroup, required }) {
    return (
        <div className={styles.root}>
            <label
                className={classNames({
                    [styles.radioGroup]: radioGroup,
                    [styles.required]: required
                })}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

import React from "react";
import styles from "./InputBox.module.css";
import classNames from "classnames";

export default function({ label, children, radioGroup, required, vertical }) {
    return (
        <div className={classNames(styles.root, vertical ? styles.vertical : styles.horizontal)}>
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

import React, { PureComponent } from "react";
import styles from "./index.module.css";

export default class extends PureComponent {
    render() {
        const { children, title, style } = this.props;
        return (
            <div className={styles.card} style={style}>
                <div className={styles.title}>{title}</div>
                <div className={styles.content}>{children}</div>
            </div>
        );
    }
}

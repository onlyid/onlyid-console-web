import React, { PureComponent } from "react";
import styles from "./index.module.css";

class NoCard extends PureComponent {
    render() {
        const { children, title, right } = this.props;

        return (
            <div className={styles.noCard}>
                <div className={styles.titleBox}>
                    <span className={styles.title}>{title}</span>
                    {right}
                </div>
                {children}
            </div>
        );
    }
}

export default NoCard;

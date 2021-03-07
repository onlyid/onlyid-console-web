import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Otp from "./Otp";
import User from "./User";

class Statistic extends PureComponent {
    render() {
        return (
            <div className={styles.root}>
                <h1>统计概览</h1>
                <Otp />
                <User />
            </div>
        );
    }
}

export default Statistic;

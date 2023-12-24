import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Otp from "./Otp";
import User from "./User";
import { FormControl, InputAdornment, MenuItem, Select } from "@material-ui/core";

class Statistic extends PureComponent {
    state = {
        type: "otp"
    };

    onTypeChange = ({ target }) => {
        this.setState({ type: target.value });
    };

    render() {
        const { type } = this.state;

        return (
            <div className={styles.root}>
                <FormControl className={styles.typeSelect}>
                    <Select
                        name="type"
                        value={type}
                        onChange={this.onTypeChange}
                        startAdornment={<InputAdornment position="start">数据类型</InputAdornment>}
                    >
                        <MenuItem value="otp">OTP统计</MenuItem>
                        <MenuItem value="user">用户统计</MenuItem>
                    </Select>
                </FormControl>
                <h1>统计概览</h1>
                {type === "otp" ? <Otp /> : <User />}
            </div>
        );
    }
}

export default Statistic;

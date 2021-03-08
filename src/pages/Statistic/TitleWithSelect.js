import React from "react";
import styles from "./index.module.css";
import ClientSelect from "./ClientSelect";
import { FormControl, InputAdornment, MenuItem, Select } from "@material-ui/core";

export default function({ title, clientId, days, type, onChange, typeList }) {
    return (
        <div className={styles.titleWithSelect}>
            <h2>{title}</h2>
            <div>
                <ClientSelect
                    value={clientId}
                    onChange={clientId => onChange("clientId", clientId)}
                />
                <FormControl>
                    <Select
                        id="days-select"
                        value={days}
                        onChange={({ target: { value } }) => onChange("days", value)}
                        startAdornment={<InputAdornment position="start">时间</InputAdornment>}
                    >
                        <MenuItem value={7}>最近7天</MenuItem>
                        <MenuItem value={30}>最近30天</MenuItem>
                        <MenuItem value={90}>最近90天</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Select
                        id="type-select"
                        value={type}
                        onChange={({ target: { value } }) => onChange("type", value)}
                        startAdornment={<InputAdornment position="start">类型</InputAdornment>}
                    >
                        {typeList.map(type => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

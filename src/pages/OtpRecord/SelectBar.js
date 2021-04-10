import React from "react";
import selectBar from "components/SelectBar.module.css";
import ClientSelect from "components/ClientSelect";
import { Button, FormControl, Input, InputAdornment, MenuItem, Select } from "@material-ui/core";

export default function({
    clientId,
    days,
    sendSuccess,
    verifySuccess,
    keyword,
    onClientChange,
    onChange,
    onSearch,
    onExport
}) {
    return (
        <>
            <div className={selectBar.root}>
                <ClientSelect value={clientId} onChange={onClientChange} />
                <FormControl>
                    <Select
                        name="days-select"
                        value={days}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">时间</InputAdornment>}
                    >
                        <MenuItem value={7}>最近7天</MenuItem>
                        <MenuItem value={30}>最近30天</MenuItem>
                        <MenuItem value={90}>最近90天</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Select
                        name="send-select"
                        value={sendSuccess}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">发送状态</InputAdornment>}
                    >
                        <MenuItem value="all">查看全部</MenuItem>
                        <MenuItem value="true">只看成功</MenuItem>
                        <MenuItem value="false">只看失败</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Select
                        name="verify-select"
                        value={verifySuccess}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">校验状态</InputAdornment>}
                    >
                        <MenuItem value="all">查看全部</MenuItem>
                        <MenuItem value="true">只看成功</MenuItem>
                        <MenuItem value="false">只看失败</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={selectBar.root}>
                <FormControl>
                    <Input
                        name="keyword"
                        onChange={onChange}
                        value={keyword}
                        startAdornment={<InputAdornment position="start">手机号</InputAdornment>}
                        placeholder="请输入"
                    />
                </FormControl>
                <Button
                    color="primary"
                    variant="contained"
                    className="small"
                    startIcon={<span className="material-icons">search</span>}
                    onClick={onSearch}
                >
                    查 询
                </Button>
                <Button variant="contained" className="small" onClick={onExport}>
                    导出数据
                </Button>
            </div>
        </>
    );
}

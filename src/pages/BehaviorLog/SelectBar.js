import React from "react";
import selectBar from "components/SelectBar.module.css";
import ClientSelect from "components/ClientSelect";
import { Button, FormControl, Input, InputAdornment, MenuItem, Select } from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";

export default function({
    type,
    clientId,
    lteDate,
    gteDate,
    success,
    keyword,
    onClientChange,
    onDateChange,
    onChange,
    onSearch
}) {
    const shouldDisableDate = date => moment().diff(date, "day") > 90;

    return (
        <>
            <div className={selectBar.root}>
                <FormControl>
                    <Select
                        name="type"
                        value={type}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">类型</InputAdornment>}
                    >
                        <MenuItem value="userActive">用户登录</MenuItem>
                        <MenuItem value="operation">开发者操作</MenuItem>
                    </Select>
                </FormControl>
                <ClientSelect value={clientId} onChange={onClientChange} />
                <FormControl>
                    <Select
                        name="success"
                        value={success}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">状态</InputAdornment>}
                    >
                        <MenuItem value="all">查看全部</MenuItem>
                        <MenuItem value="true">只看成功</MenuItem>
                        <MenuItem value="false">只看失败</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Input
                        name="keyword"
                        onChange={onChange}
                        value={keyword}
                        startAdornment={<InputAdornment position="start">搜索</InputAdornment>}
                        placeholder={type === "userActive" ? "昵称、手机号、邮箱" : "操作、描述"}
                    />
                </FormControl>
            </div>
            <div className={selectBar.root}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                        clearLabel="清 空"
                        cancelLabel="取 消"
                        okLabel={null}
                        name="gte-date"
                        format="YYYY-MM-DD"
                        value={gteDate}
                        onChange={value => onDateChange("gteDate", value)}
                        disableFuture
                        disableToolbar
                        clearable
                        autoOk
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">开始时间</InputAdornment>
                            ),
                            placeholder: "请选择"
                        }}
                        shouldDisableDate={shouldDisableDate}
                    />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                        clearLabel="清 空"
                        cancelLabel="取 消"
                        okLabel={null}
                        name="lte-date"
                        format="YYYY-MM-DD"
                        value={lteDate}
                        onChange={value => onDateChange("lteDate", value)}
                        disableFuture
                        disableToolbar
                        clearable
                        autoOk
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">结束时间</InputAdornment>
                            ),
                            placeholder: "请选择"
                        }}
                        shouldDisableDate={shouldDisableDate}
                    />
                </MuiPickersUtilsProvider>
                <Button
                    color="primary"
                    variant="contained"
                    className="small"
                    startIcon={<span className="material-icons">search</span>}
                    onClick={onSearch}
                >
                    查 询
                </Button>
            </div>
        </>
    );
}

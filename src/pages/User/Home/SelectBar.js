import React from "react";
import selectBar from "components/SelectBar.module.css";
import { Button, FormControl, Input, InputAdornment, MenuItem, Select } from "@material-ui/core";
import ClientSelect from "components/ClientSelect";

export default function SelectBar({
    clientId,
    orderBy,
    keyword,
    onClientChange,
    onChange,
    onSearch
}) {
    return (
        <div className={selectBar.root}>
            <ClientSelect value={clientId} onChange={onClientChange} />
            <FormControl>
                <Select
                    name="orderBy"
                    value={orderBy}
                    onChange={onChange}
                    startAdornment={<InputAdornment position="start">排序</InputAdornment>}
                >
                    <MenuItem value="firstDate">最近新增</MenuItem>
                    <MenuItem value="lastDate">最近活跃</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <Input
                    name="keyword"
                    onChange={onChange}
                    value={keyword}
                    startAdornment={<InputAdornment position="start">搜索</InputAdornment>}
                    placeholder="昵称、手机号、邮箱"
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
        </div>
    );
}

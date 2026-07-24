import React from "react"
import selectBar from "components/SelectBar.module.css"
import ClientSelect from "components/ClientSelect"
import { Button, FormControl, Input, InputAdornment, MenuItem, Select } from "@material-ui/core"
import { DATE_FORMAT } from "my/constants"
import moment from "moment"

export default function SelectBar({
    clientId,
    lteDate,
    gteDate,
    success,
    keyword,
    onClientChange,
    onChange,
    onSearch
}) {
    const minDate = moment().subtract(90, "days").format(DATE_FORMAT)
    const maxDate = moment().format(DATE_FORMAT)

    return (
        <>
            <div className={selectBar.root}>
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
                        placeholder="昵称、手机号、邮箱"
                    />
                </FormControl>
            </div>
            <div className={selectBar.root}>
                <FormControl>
                    <Input
                        name="gteDate"
                        onChange={onChange}
                        value={gteDate}
                        type="date"
                        inputProps={{ min: minDate, max: maxDate }}
                        startAdornment={<InputAdornment position="start">开始时间</InputAdornment>}
                        placeholder="请选择"
                    />
                </FormControl>
                <FormControl>
                    <Input
                        name="lteDate"
                        onChange={onChange}
                        value={lteDate}
                        type="date"
                        inputProps={{ min: minDate, max: maxDate }}
                        startAdornment={<InputAdornment position="start">结束时间</InputAdornment>}
                        placeholder="请选择"
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
        </>
    )
}

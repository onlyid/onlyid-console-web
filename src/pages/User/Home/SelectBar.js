import React from "react";
import selectBar from "components/SelectBar.module.css";
import { Button, FormControl, Input, InputAdornment, MenuItem, Select } from "@material-ui/core";
import ClientSelect from "components/ClientSelect";

export default function({
    type,
    clientId,
    orderBy,
    activated,
    keyword,
    onClientChange,
    onChange,
    onSearch
}) {
    return (
        <>
            <div className={selectBar.root}>
                <FormControl>
                    <Select
                        name="type-select"
                        value={type}
                        onChange={onChange}
                        startAdornment={<InputAdornment position="start">类型</InputAdornment>}
                    >
                        <MenuItem value="sso">SSO 自然增长</MenuItem>
                        <MenuItem value="import">手工导入/新建</MenuItem>
                        <MenuItem value="blacklist">已屏蔽黑名单</MenuItem>
                    </Select>
                </FormControl>
                {type === "sso" && (
                    <>
                        <ClientSelect value={clientId} onChange={onClientChange} />
                        <FormControl>
                            <Select
                                name="order-by-select"
                                value={orderBy}
                                onChange={onChange}
                                startAdornment={
                                    <InputAdornment position="start">排序</InputAdornment>
                                }
                            >
                                <MenuItem value="firstDate">最近新增</MenuItem>
                                <MenuItem value="lastDate">最近活跃</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                {type === "import" && (
                    <FormControl>
                        <Select
                            name="activated-select"
                            value={activated}
                            onChange={onChange}
                            startAdornment={
                                <InputAdornment position="start">激活状态</InputAdornment>
                            }
                        >
                            <MenuItem value="all">查看全部</MenuItem>
                            <MenuItem value="true">只看已激活</MenuItem>
                            <MenuItem value="false">只看未激活</MenuItem>
                        </Select>
                    </FormControl>
                )}
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

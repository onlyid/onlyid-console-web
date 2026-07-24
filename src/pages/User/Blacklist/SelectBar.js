import React from "react"
import selectBar from "components/SelectBar.module.css"
import { Button, FormControl, Input, InputAdornment } from "@material-ui/core"

export default function SelectBar({ keyword, onChange, onSearch }) {
    return (
        <div className={selectBar.root}>
            <FormControl>
                <Input
                    name="bl_keyword"
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
    )
}

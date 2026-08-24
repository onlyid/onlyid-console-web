import { useState, useEffect } from "react"
import request from "@/my/request"
import { FormControl, InputAdornment, MenuItem, Select } from "@mui/material"

function ClientSelect({ value, onChange }) {
    const [list, setList] = useState([])

    const initData = async () => {
        const list = await request.get("clients")
        setList(list)
    }

    useEffect(() => {
        initData()
    }, [])

    const menuItems = [
        <MenuItem key="all" value="all">
            全部应用
        </MenuItem>,
        ...list.map((client) => (
            <MenuItem key={client.id} value={client.id}>
                {client.name}
            </MenuItem>
        ))
    ]

    return (
        <FormControl>
            <Select
                id="client-select"
                value={value}
                onChange={({ target: { value } }) => onChange(value)}
                startAdornment={<InputAdornment position="start">应用</InputAdornment>}
                variant="standard"
            >
                {menuItems}
            </Select>
        </FormControl>
    )
}

export default ClientSelect

import { useState } from "react"
import { Button, ListItemText, Menu, MenuItem } from "@material-ui/core"

export default function MainActionBox({ goBlacklist }) {
    const [anchorEl, setAnchorEl] = useState(null)

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    return (
        <div className="mainActionBox">
            <Button
                variant="contained"
                color="primary"
                endIcon={<span className="material-icons">keyboard_arrow_down</span>}
                onClick={openMenu}
            >
                操 作
            </Button>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                getContentAnchorEl={null}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                onClick={closeMenu}
                autoFocus={false}
            >
                <MenuItem onClick={goBlacklist}>
                    <ListItemText>用户黑名单</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    )
}

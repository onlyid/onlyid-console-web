import { Button, ListItemText, Menu, MenuItem } from "@material-ui/core";
import React, { PureComponent } from "react";

export default class MainActionBox extends PureComponent {
    state = {
        anchorEl: null
    };

    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { goBlacklist } = this.props;

        return (
            <div className="mainActionBox">
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<span className="material-icons">keyboard_arrow_down</span>}
                    onClick={this.openMenu}
                >
                    操 作
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={this.closeMenu}
                    onClick={this.closeMenu}
                    autoFocus={false}
                >
                    <MenuItem onClick={goBlacklist}>
                        <ListItemText>用户黑名单</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

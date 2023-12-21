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
        const { onExport } = this.props;

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
                    autoFocus={false}
                    onClick={this.closeMenu}
                >
                    <MenuItem onClick={onExport}>
                        <ListItemText>全量导出</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

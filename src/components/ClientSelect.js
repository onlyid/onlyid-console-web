import React, { PureComponent } from "react";
import http from "my/http";
import { FormControl, InputAdornment, MenuItem, Select } from "@material-ui/core";

class ClientSelect extends PureComponent {
    state = {
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const list = await http.get("clients");
        this.setState({ list });
    };

    render() {
        const { list } = this.state;
        const { value, onChange } = this.props;

        const menuItems = [
            <MenuItem key="all" value="all">
                全部应用
            </MenuItem>
        ];
        menuItems.push(
            list.map(client => (
                <MenuItem key={client.id} value={client.id}>
                    {client.name}
                </MenuItem>
            ))
        );

        return (
            <FormControl>
                <Select
                    id="client-select"
                    value={value}
                    onChange={({ target: { value } }) => onChange(value)}
                    startAdornment={<InputAdornment position="start">应用</InputAdornment>}
                >
                    {menuItems}
                </Select>
            </FormControl>
        );
    }
}

export default ClientSelect;

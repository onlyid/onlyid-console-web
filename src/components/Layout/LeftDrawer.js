import React from "react";
import styles from "./LeftDrawer.module.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

function Item({ to, children }) {
    const location = useLocation();

    return (
        <ListItem button component={Link} to={to} selected={location.pathname.startsWith(to)}>
            {children}
        </ListItem>
    );
}

export default function() {
    const tenantInfo = localStorage.getObj("tenantInfo");

    return (
        <Drawer className={styles.root} variant="permanent">
            <List component="nav" className={styles.list}>
                {moment(tenantInfo.expireDate) > moment() && (
                    <>
                        <Item to="/statistics">
                            <ListItemIcon>
                                <span className="material-icons">auto_graph</span>
                            </ListItemIcon>
                            <ListItemText primary="统计概览" />
                        </Item>
                        <Item to="/applications">
                            <ListItemIcon>
                                <span className="material-icons">apps</span>
                            </ListItemIcon>
                            <ListItemText primary="应用管理" />
                        </Item>
                        <Item to="/otp-records">
                            <ListItemIcon>
                                <span className="material-icons">sms</span>
                            </ListItemIcon>
                            <ListItemText primary="OTP记录" />
                        </Item>
                        <Item to="/users">
                            <ListItemIcon>
                                <span className="material-icons">person</span>
                            </ListItemIcon>
                            <ListItemText primary="用户管理" />
                        </Item>
                        <Item to="/permissions">
                            <ListItemIcon>
                                <span className="material-icons">vpn_key</span>
                            </ListItemIcon>
                            <ListItemText primary="权限管理" />
                        </Item>
                        <Item to="/roles">
                            <ListItemIcon>
                                <span className="material-icons">account_box</span>
                            </ListItemIcon>
                            <ListItemText primary="角色管理" />
                        </Item>
                        <Item to="/behavior-logs">
                            <ListItemIcon>
                                <span className="material-icons">receipt</span>
                            </ListItemIcon>
                            <ListItemText primary="行为日志" />
                        </Item>
                        <Item to="/my-messages">
                            <ListItemIcon>
                                <span className="material-icons">email</span>
                            </ListItemIcon>
                            <ListItemText primary="站内信" />
                        </Item>
                    </>
                )}
                <Item to="/tenant">
                    <ListItemIcon>
                        <span className="material-icons">settings</span>
                    </ListItemIcon>
                    <ListItemText primary="租户设置" />
                </Item>
            </List>
        </Drawer>
    );
}

import React from "react";
import { Icon, Menu } from "antd";
import styles from "./index.module.css";

const { Item } = Menu;

export default function(props) {
    const { data, current, onClick } = props;

    let deleteItem,
        backItem,
        indexPlus = 0;
    const data1 = data.filter(item => {
        switch (item.key) {
            case "back":
                backItem = item;
                indexPlus++;
                return false;
            case "delete":
                deleteItem = item;
                return false;
            default:
                return true;
        }
    });

    return (
        <Menu onClick={onClick} selectedKeys={[current]} className={styles.root}>
            {backItem && (
                <Item key="back">
                    <Icon type={backItem.icon || "arrow-left"} />
                    {backItem.title}
                </Item>
            )}
            {backItem && <hr className={styles.hr1} />}
            {data1.map((item, index) => (
                <Item
                    key={item.key || String(index + indexPlus)}
                    className={item.className}
                    disabled={item.disabled}
                >
                    <Icon type={item.icon} />
                    {item.title}
                </Item>
            ))}
            {deleteItem && <hr className={styles.hr1} />}
            {deleteItem && (
                <Item key="delete" className={styles.deleteItem}>
                    <Icon type={deleteItem.icon || "delete"} />
                    {deleteItem.title}
                </Item>
            )}
        </Menu>
    );
}

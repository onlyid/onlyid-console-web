import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from "@material-ui/core";
import DialogClose from "components/DialogClose";
import styles from "./WelcomeDialog.module.css";
import { Help as HelpIcon } from "@material-ui/icons";

export default function({ open, onClose, onCreate }) {
    const create = () => {
        onCreate();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                欢迎
                <DialogClose onClose={onClose} />
            </DialogTitle>
            <DialogContent>
                <p style={{ marginTop: 0 }}>
                    欢迎使用唯ID 统一账号和认证解决方案，下面让我们开始吧。
                </p>
                <ol className={styles.ol1}>
                    <li>
                        不管你是准备使用OTP、SSO还是IAM，都先新建一个应用，然后按照提示进行操作。
                    </li>
                    <li>
                        第一次接触唯ID，是否有些问题想问？我们总结了一些{" "}
                        <Link target="_blank" href="https://www.onlyid.net/home/docs/other/faq">
                            常见问题
                        </Link>
                        ，欢迎参阅。
                    </li>
                    <li>
                        需要帮助？请点击控制台右上角 <HelpIcon /> 图标。
                    </li>
                    <li>短信不另外收费，没错，年费200无限短信，不需要和客服再次确认。</li>
                </ol>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>先逛逛</Button>
                <Button onClick={create} color="primary">
                    新建应用
                </Button>
            </DialogActions>
        </Dialog>
    );
}

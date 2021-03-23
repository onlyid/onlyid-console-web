import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from "@material-ui/core";
import DialogClose from "components/DialogClose";
import styles from "./GuideDialog.module.css";
import classNames from "classnames";

export default function({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                接入引导
                <DialogClose onClose={onClose} />
            </DialogTitle>
            <DialogContent className={styles.content}>
                <p style={{ marginTop: 0 }}>
                    <span style={{ color: "#4caf50" }}>应用创建成功</span>，接下来你可能想：
                </p>
                <div className={styles.section}>
                    <span className={classNames("material-icons", styles.starIcon)}>star_half</span>
                    <div className={styles.right}>
                        <p>使用唯ID OTP 发送无限量短信验证码：</p>
                        <div className={styles.linkBox}>
                            <div>
                                <span className="material-icons">sms</span>
                                <Link
                                    href="https://www.onlyid.net/home/docs/otp/integrate"
                                    target="_blank"
                                >
                                    使用文档
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <span className={classNames("material-icons", styles.starIcon)}>star</span>
                    <div className={styles.right}>
                        <p>接入唯ID SSO 彻底解耦认证和业务，把琐事交给唯ID：</p>
                        <div className={styles.linkBox}>
                            <div>
                                <span className="iconfont">&#xe743;</span>
                                <Link
                                    href="https://www.onlyid.net/home/docs/sso/web"
                                    target="_blank"
                                >
                                    网站接入文档
                                </Link>
                            </div>
                            <div>
                                <span className="material-icons">android</span>
                                <Link
                                    href="https://www.onlyid.net/home/docs/sso/android"
                                    target="_blank"
                                >
                                    Android接入文档
                                </Link>
                            </div>
                            <div>
                                <span className="iconfont">&#xe72c;</span>
                                <Link
                                    href="https://www.onlyid.net/home/docs/sso/ios"
                                    target="_blank"
                                >
                                    iOS接入文档
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关 闭</Button>
            </DialogActions>
        </Dialog>
    );
}

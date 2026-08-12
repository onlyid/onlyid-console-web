import React from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from "@material-ui/core"
import DialogClose from "components/DialogClose"
import styles from "./GuideDialog.module.css"
import classNames from "classnames"

export default function GuideDialog({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                接入引导
                <DialogClose onClose={onClose} />
            </DialogTitle>
            <DialogContent className={styles.content}>
                <p style={{ marginTop: 0 }}>应用创建成功，接下来你可能想：</p>
                <div className={styles.section}>
                    <span className={classNames("material-icons", styles.starIcon)}>star_half</span>
                    <div className={styles.right}>
                        <p>使用OTP功能发送低成本验证码：</p>
                        <div className={styles.linkBox}>
                            <div>
                                <span className="material-icons">sms</span>
                                <Link
                                    href="https://onlyid.net/web/docs/one-time-password/send-otp"
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
                        <p>接入SSO功能彻底解耦认证和业务：</p>
                        <div className={styles.linkBox}>
                            <div>
                                <span className="iconfont">&#xe743;</span>
                                <Link
                                    href="https://onlyid.net/web/docs/single-sign-on/web"
                                    target="_blank"
                                >
                                    网站接入文档
                                </Link>
                            </div>
                            <div>
                                <span className="material-icons">android</span>
                                <Link
                                    href="https://onlyid.net/web/docs/single-sign-on/android"
                                    target="_blank"
                                >
                                    Android接入文档
                                </Link>
                            </div>
                            <div>
                                <span className="iconfont">&#xe72c;</span>
                                <Link
                                    href="https://onlyid.net/web/docs/single-sign-on/ios"
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
    )
}

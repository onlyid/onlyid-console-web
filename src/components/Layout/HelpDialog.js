import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Link } from "@material-ui/core";
import styles from "./HelpDialog.module.css";
import { Close as CloseIcon } from "@material-ui/icons";

export default function({ visible, onClose }) {
    return (
        <Dialog open={visible} onClose={onClose}>
            <DialogTitle>
                需要帮助？
                <IconButton className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={styles.content}>
                <p style={{ marginTop: 0 }}>
                    开发文档是你获取帮助的首选途径，如果文档不能解决你的问题，欢迎联系我们。
                </p>
                <h3>
                    <span className="material-icons">menu_book</span> 查阅文档
                </h3>
                <ul>
                    <li>
                        <Link href="https://www.onlyid.net/home/docs" target="_blank">
                            文档首页
                        </Link>
                    </li>
                    <li>
                        <Link href="https://www.onlyid.net/home/docs/otp/intro" target="_blank">
                            使用唯ID OTP
                        </Link>
                    </li>
                    <li>
                        <Link href="https://www.onlyid.net/home/docs/sso/oauth" target="_blank">
                            接入唯ID SSO
                        </Link>
                    </li>
                    <li>
                        <Link href="https://www.onlyid.net/home/docs/other/faq" target="_blank">
                            常见问题
                        </Link>
                    </li>
                </ul>
                <p>我们时刻保持文档最新，也建议你定期来看看。</p>
                <h3>
                    <span className="material-icons">call</span> 联系我们
                </h3>
                <p>业务咨询和技术支持（或者建议反馈），请联系：</p>
                <ul>
                    <li>
                        电话/微信：<span className={styles.contact}>15521312099</span>
                    </li>
                    <li>
                        QQ：<span className={styles.contact}>452391310</span>
                    </li>
                    <li>
                        开发者QQ群：<span className={styles.contact}>23831587</span>
                    </li>
                </ul>
                <p>客服时间是每天9:00-21:00（节假日另行通知）。</p>
                <p>
                    生产问题请直接电话联系：
                    <span className={styles.contact}>15521312099</span>，
                    <span style={{ fontWeight: 500 }}>7x24小时随时响应确保服务稳定运行</span>。
                </p>
                <p className="tip" style={{ marginBottom: 12 }}>
                    提示：唯ID不使用工单系统，请通过上述方式与我们联系，服务响应更及时，更快速解决问题。
                </p>
            </DialogContent>
        </Dialog>
    );
}

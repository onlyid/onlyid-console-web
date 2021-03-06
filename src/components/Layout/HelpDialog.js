import React, { PureComponent } from "react";
import { Dialog, DialogContent, DialogTitle, Link, Paper, Popper } from "@material-ui/core";
import styles from "./HelpDialog.module.css";
import DialogClose from "components/DialogClose";
import tipBox from "components/TipBox.module.css";
import weChat155 from "assets/wechat-155.jpeg";
import classNames from "classnames";

export default class extends PureComponent {
    state = {
        anchorEl: null,
    };

    showWeChat = (e) => {
        this.setState({ anchorEl: e.currentTarget });
    };

    closeWeChat = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { visible, onClose } = this.props;
        const { anchorEl } = this.state;

        return (
            <Dialog open={visible} onClose={onClose}>
                <DialogTitle>
                    需要帮助？
                    <DialogClose onClose={onClose} />
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
                            电话 / 微信
                            <span
                                className={classNames("material-icons", styles.qrCode)}
                                onMouseEnter={this.showWeChat}
                                onMouseLeave={this.closeWeChat}
                            >
                                qr_code
                            </span>
                            ：<span className={styles.contact}>15521312099</span>
                        </li>
                        <li>
                            QQ：<span className={styles.contact}>452391310</span>
                        </li>
                        <li>
                            邮箱：
                            <a href="mailto:help@onlyid.net" className={styles.mailTo}>
                                help@onlyid.net
                            </a>
                        </li>
                    </ul>
                    <p>客服时间是每天9:00-21:00（国家法定节假日除外）。</p>
                    <p>
                        生产问题请直接电话联系：
                        <span className={styles.contact}>15521312099</span>，
                        <span style={{ fontWeight: 500 }}>7x24小时随时响应</span>确保服务稳定运行。
                    </p>
                    <div className={tipBox.root} style={{ margin: "1em 0" }}>
                        <p>
                            提示：唯ID不使用工单系统，请通过上述方式与我们联系，服务响应更及时，更快速解决问题。
                        </p>
                    </div>
                </DialogContent>

                <Popper
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    placement="top"
                    className={styles.popper1}
                >
                    <Paper>
                        <img src={weChat155} alt="weChat" />
                    </Paper>
                </Popper>
            </Dialog>
        );
    }
}

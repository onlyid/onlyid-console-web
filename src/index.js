import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import reducers from "my/reducers";
import moment from "moment";
import "moment/locale/zh-cn";
import { createTheme, CssBaseline } from "@material-ui/core";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import { zhCN } from "@material-ui/core/locale";

moment.locale("zh-cn");

const store = createStore(reducers);
const fontFamily = `Roboto,"Noto Sans SC","Helvetica Neue","PingFang SC","Segoe UI","Microsoft YaHei",sans-serif`;
const theme = createTheme({ zhCN, typography: { fontFamily } });

const content = (
    <React.StrictMode>
        <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <App />
                </Provider>
            </ThemeProvider>
        </StylesProvider>
    </React.StrictMode>
);
ReactDOM.render(content, document.getElementById("root"));

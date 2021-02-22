import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "my/reducers";
import "my/utils";
import moment from "moment";
import "moment/locale/zh-cn";
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import { zhCN } from "@material-ui/core/locale";

moment.locale("zh-cn");

const store = createStore(reducers);
const theme = createMuiTheme({ zhCN });

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { legacy_createStore as createStore } from "redux"
import reducers from "@/my/reducers"
import moment from "moment"
import "moment/locale/zh-cn"
import { CssBaseline } from "@mui/material"
import { StyledEngineProvider, createTheme, ThemeProvider } from "@mui/material/styles"
import { zhCN } from "@mui/material/locale"

moment.locale("zh-cn")

const store = createStore(reducers)
const fontFamily = `Roboto,"Noto Sans SC","Helvetica Neue","PingFang SC","Segoe UI","Microsoft YaHei",sans-serif`
const theme = createTheme(
    {
        palette: {
            primary: {
                main: "#3F51B5"
            }
        },
        typography: { fontFamily }
    },
    zhCN
)

const content = (
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <App />
                </Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
)
ReactDOM.render(content, document.getElementById("root"))

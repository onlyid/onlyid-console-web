import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import DialogClose from "components/DialogClose"

export default function WelcomeDialog({ open, onClose, onCreate }) {
    const onCreate1 = () => {
        onCreate()
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                欢迎
                <DialogClose onClose={onClose} />
            </DialogTitle>
            <DialogContent>
                <p style={{ margin: 0 }}>
                    欢迎使用唯ID，请首先新建一个应用，然后参阅文档进行接入操作。
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>先逛逛</Button>
                <Button onClick={onCreate1} color="primary">
                    新建应用
                </Button>
            </DialogActions>
        </Dialog>
    )
}

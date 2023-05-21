import React, {Fragment} from "react";
import classes from './Modal.module.css'
import ReactDOM from "react-dom";

const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onHide}/>
}

const ModalOverlay = props => {
    return <div className={classes.modal}>
        <div className={classes.content}>{props.children}</div>
    </div>
}

const Modal = props => {
    return <Fragment>
        {ReactDOM.createPortal(<Backdrop onHide={props.onHide}/>,document.getElementById('overlays'))}
        {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>,document.getElementById('overlays'))}
    </Fragment>
}
export default Modal;
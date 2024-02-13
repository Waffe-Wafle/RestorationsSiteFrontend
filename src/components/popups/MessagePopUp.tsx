import React, { FC, useEffect, memo } from "react";
import Modal from "react-bootstrap/Modal";
import Title from "../parts_share/TextTitle";


interface MessagePopupProps {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
}


const MessagePopup: FC<MessagePopupProps> =  memo(({ show, title, message, onClose }) => {
    return (
        <Modal show={show} centered onHide={onClose}>
            <Modal.Body className="text-center">
                <Title text={title} />
                <div className="mt-3">{message}</div>
            </Modal.Body>
        </Modal>
    );
});


export default MessagePopup;

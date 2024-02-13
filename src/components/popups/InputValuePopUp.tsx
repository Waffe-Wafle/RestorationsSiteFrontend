import React, {FC, memo, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Title from "../parts_share/TextTitle";


interface InputValuePopUpProps {
    show: boolean;
    title: string;
    setResult: (confirm: string) => void;
    onClose: any;
}


const InputValuePopUp: FC<InputValuePopUpProps> = ({ show, title, setResult, onClose }) => {
    const [value, setValue] = useState('');

    return (
        <Modal show={show} centered>
            <Modal.Body className="text-center">
                <Title text={title} />
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="form-control d-inline mt-3 w-75"
                    placeholder="Введите значение"
                />
                <div className="d-flex justify-content-center mt-4">
                    <Button className="mr-2 w-25" variant="success" onClick={() => setResult(value)}>Ок</Button>
                    <Button className="ml-2 w-25" variant="danger" onClick={onClose}>Отмена</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};


export default memo(InputValuePopUp);

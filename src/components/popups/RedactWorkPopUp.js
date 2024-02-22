import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {workStatusMap} from "../../hooks_and_utils/statuses";


const RedactWorkPopUp = ({ work, onClose, handleAction}) => {
    const [formData, setFormData] = useState({ // Did like that to easier serialize to multipart form
        ...work,
    });
    const { name, total_sum, status } = formData;

    const changeForm = e => {
        setFormData({
            ...formData, [e.target.name]: e.target.files ? e.target.files[0] : e.target.value
        });
    }

    const [applyShown, setApplyShown] = useState(false);

    useEffect(() => {
        if (!status) setFormData({...formData, status: workStatusMap[0][0]});
        setApplyShown(!!name && !! total_sum && !!status);
    }, [name, total_sum, status])

    return (
        <Modal show={true} centered>
            <Modal.Body>
                <Button
                    variant="danger"
                    className="position-relative float-end top-0"
                    onClick={onClose}>
                    &times;
                </Button>
                <form className="container flex-wrap">
                    <div className='form-group mt-3'>
                        <label className='form-label'>Название</label>
                        <input
                            className='form-control'
                            type='text'
                            name='name'
                            onChange={changeForm}
                            value={name}
                            required
                        />
                    </div>
                    <div className='form-group mt-25'>
                        <label className='form-label'>Требуется:</label>
                        <input
                            className='form-control'
                            type='text'
                            name='total_sum'
                            onChange={changeForm}
                            value={total_sum}
                            required
                        />
                    </div>
                    <div className='form-group mt-25'>
                        <label className='form-label'>Статус:</label>
                        <select
                            className="form-control"
                            name='status'
                            onChange={changeForm}
                            value={status}>
                            <option value={workStatusMap[0][0]}>{workStatusMap[0][1]}</option>
                            <option value={workStatusMap[1][0]}>{workStatusMap[1][1]}</option>
                            <option value={workStatusMap[2][0]}>{workStatusMap[2][1]}</option>
                            required
                        </select>
                    </div>

                    <div className="mt-35 d-flex justify-content-center ">
                        { applyShown &&
                            <Button className="w-25 ml-25" variant='success' onClick={() => handleAction(false, false, formData)}>
                                Сохранить
                            </Button>}
                        {/*{ work.id &&*/}
                        {/*<Button className="w-25 ml-25" variant='success' onClick={() => handleAction(false, true, formData)}>*/}
                        {/*    Удалить*/}
                        {/*</Button>}*/}
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

};

export default RedactWorkPopUp;
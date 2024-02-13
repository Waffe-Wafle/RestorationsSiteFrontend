import React, { FC, memo, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Title from "../parts_share/TextTitle";
import Spinner from "react-bootstrap/Spinner";


interface LoadingPopUpProps {
    show: boolean;
    error?: any;
    message?: string;
    onClose: () => void;
}


const LoadingPopUp: FC <LoadingPopUpProps> = memo(({ show, error, message, onClose }) => {
        return (
            <Modal show={show} centered onHide={onClose}>
                <Modal.Body className="text-center">
                    {error ? (
                        <>
                            <Title text={'Error'} is_error={true} />
                            <div className="mt-3 text-danger">
                                Произошла ошибка: {error.response.statusText}
                            </div>
                        </>
                    ) : (
                        <>
                            <Spinner
                                animation="border"
                                role="status"
                                style={{
                                    width: '2rem',
                                    height: '2rem',
                                    marginBottom: '1rem',
                                    marginTop: 0,
                                    padding: 0,
                                }}
                            />
                            <div className="mt-3 text">{message}</div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
);


export default LoadingPopUp;

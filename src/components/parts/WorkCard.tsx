import React, {FC, memo } from "react";
import { Button } from "react-bootstrap";
import { RestoreAPI } from "../../api";


interface WorkCardProps {
    file: {
        size: string;
        platform: string;
        architecture: string;
        id: string; // или любой другой тип для идентификатора файла
    };
}


const WorkCard: FC<WorkCardProps> = memo(({ file }) => {
    return (
        <div className="file-card">
            <div className="file-details d-flex align-center ">
                <b>{file.size}</b>
                <b>{file.platform}</b>
                <b>{file.architecture}</b>
            </div>

            <div className="buttons flex-column  flex-sm-row ml-10">
                <Button className="download-button" href={RestoreAPI + `files/${file.id}`}>
                    Скачать
                </Button>
            </div>
        </div>
    );
});


export default WorkCard;

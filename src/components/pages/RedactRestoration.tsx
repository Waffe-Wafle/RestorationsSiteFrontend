import React, {FC, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
    addRestoration,
    deleteRestorationById,
    storeCurrentRestoration,
    storeLastRestorationId,
    useCurrentRestoration,
    useLastRestorationId
} from '../../redux/dataSlice';
import Header from '../parts_share/Header';
import CurrentPath from '../parts/CurrentPath';
import {RestoreAPI} from '../../api';
import useFetch from '../../hooks_and_utils/useFetch';
import LoadingPopUp from '../popups/LoadingPopUp';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import ConfirmationPopUp from '../popups/ConfirmationPopUp';
import {useDispatch} from 'react-redux';
import RestorationWork from "../parts/RestorationWork";
import RedactWorkPopUp from '../popups/RedactWorkPopUp';
import {StoredRestorationType, StoredRestorationWorkType} from "../../interfaces";
import {restorationStatusMap} from "../../hooks_and_utils/statuses";


interface StoredRestorationForm extends Omit<StoredRestorationType, 'works' | 'image'> {
    image: File | string;
}

const RedactRestoration: FC = () => {
    const { restore_id: restoreId } = useParams();
    const previousRestoreId = useLastRestorationId();

    const cur = useCurrentRestoration();  // Btw RestorationType is passed but its other variables arnt used:
    let storedRestoration = (restoreId ? cur : { works: [] }) as StoredRestorationType; // is switching while back redir

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // For restoration:
    const [formData, setFormData] = useState<StoredRestorationForm>({
        ...storedRestoration,
        name: storedRestoration.name || '',
        description: storedRestoration.description || '',
        status: storedRestoration.status || restorationStatusMap[0][0]
    });

    const changeForm = e =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.files ? (e.target.files[0] as File) : e.target.value // To correctly set img
        });

    // For works:
    const [works, setWorks] = useState(storedRestoration.works as StoredRestorationWorkType[]);
    const [processedWork, setProcessedWork] = useState({} as StoredRestorationWorkType); // Can have no id,
    const workId = processedWork.id                                                    // no id - posted else - putted!

    useEffect(() => {
        setFormData({
            ...storedRestoration,
            name: storedRestoration.name || '',
            description: storedRestoration.description || '',
            status: storedRestoration.status || restorationStatusMap[0][0]
        });
        if(restoreId) dispatch(storeLastRestorationId(restoreId));
    }, [restoreId])

    // For sending:
    const [serialisedForm, setSerialisedForm] =
        useState<StoredRestorationForm | StoredRestorationWorkType>();
    const [isDeleteReq, setIsDeleteReq] = useState<boolean>();           // To understand delete or Put/post
    const [isRestorationReq, setIsRestorationReq] = useState<boolean>(); // To understand which api use

    const serialiseForm = (data: StoredRestorationForm | StoredRestorationWorkType, form: FormData) => {
        Object.entries(data).map(([name, value]) => {
            if (name === 'image' && typeof value === 'string') return;
            if (value) form.append(name, value);
        });
        return form;
    };

    // Visibility logic:
    const [loadingShown, setLoadingShown] = useState(false);
    const [workRedactionShown, setWorkRedactionShown] = useState(false);
    const [confirmationShown, setConfirmationShown] = useState(false);

    // Fetch logic:
    const commonPart = {
        headers: {'X-CSRFToken': Cookies.get('csrftoken')},
        data: isDeleteReq ? '' : serialisedForm,
    };

    // For restoration managing:
    const restorationCallback = (data: StoredRestorationType) => { // Not really true but other fields not used
        dispatch(storeCurrentRestoration(data));
        if (isDeleteReq) {
            // dispatch(deleteRestorationById(data.id));
            dispatch(storeCurrentRestoration({}));
            navigate('/catalog');
        } else {
            dispatch(addRestoration(data));
            dispatch(storeCurrentRestoration(data));
            navigate(`/update_restoration/${data.id}`);
        }
        setLoadingShown(false);
    };

    const {
        data: restorationData, loading: restorationLoading,
        error: restorationError, doFetch: restorationDoFetch
    } = useFetch(
        RestoreAPI + 'restorations/' + (restoreId ? restoreId + '/' : ''),
        {
            method: restoreId ? (isDeleteReq ? 'DELETE' : 'PUT') : 'POST',
            ...commonPart,
        }, restorationCallback
    );

    const workCallback = (data: StoredRestorationWorkType) => {
        if (isDeleteReq) setWorks(prev =>
            prev.filter(item => item.id !== workId)
        );
        else {
            const indexToUpdate = works.findIndex(work => work.id === data.id);
            if (indexToUpdate !== -1)
                setWorks(prev => {
                    const updatedWorks = [...prev];
                    updatedWorks[indexToUpdate] = data;
                    return updatedWorks;
                });
             else
                setWorks(prev => [...prev, data]);
        }

        dispatch(
            storeCurrentRestoration({
                ...storedRestoration,
                works: works,
            })
        );
        setLoadingShown(false);
    };

    const {data: worksData, loading: worksLoading, error: worksError, doFetch: worksDoFetch} = useFetch(
        RestoreAPI + 'works/' + (workId ? workId + '/' : ''),
        {
            method: workId ? (isDeleteReq ? 'DELETE' : 'PUT') : 'POST',
            ...commonPart,
        },
        workCallback
    );

    // Actions logic:
    const handleRedactWork = (work: StoredRestorationWorkType) => {
        setProcessedWork(work);
        setWorkRedactionShown(true);
    };

    const handleAction = (isRestorationReq: boolean, isDeleteReq: boolean,
                          work = {} as StoredRestorationWorkType) => {
        setIsRestorationReq(isRestorationReq);
        setIsDeleteReq(isDeleteReq);
        setProcessedWork({...work, restore: parseInt(restoreId)});
        setConfirmationShown(true);
    };

    const handleConfirmAction = (isConfirmed: boolean) => {
        setConfirmationShown(false);
        if (isConfirmed) {
            if (!isDeleteReq)
                // @ts-ignore
                setSerialisedForm(serialiseForm(
                    isRestorationReq ? formData : processedWork, new FormData()
                ));

            if (isRestorationReq) restorationDoFetch();
            else {
                setWorkRedactionShown(false);
                worksDoFetch();
            }
        }
    };

    // Adding new work logic:
    const handleAddWork = () => {
        setProcessedWork({} as StoredRestorationWorkType); // To make new work
        setWorkRedactionShown(true);
    }

    // Navigation from adding
    const handleBackButton = () => {
        if (restoreId) navigate("/restoration/" + restoreId);
        else if  (previousRestoreId) {
            storedRestoration = cur as StoredRestorationType;
            navigate("/update_restoration/" + previousRestoreId);
        }
    };

    // Showing loading logic:
    useEffect(() => {
        if (restorationLoading || worksLoading || restorationError || worksError) setLoadingShown(true);
    }, [restorationLoading, worksLoading, restorationError, worksError]);

    const handleClose = () => {
        if (!(restorationLoading || worksLoading)) setLoadingShown(false);
    };

    // Showing adding file:
    // @ts-ignore
    return (
        <div className="wrapper clear">
            <LoadingPopUp
                show={loadingShown}
                error={restorationError ? restorationError : worksError}
                onClose={handleClose}
                message={'Производится операция...'}
            />

            {workRedactionShown &&
                <RedactWorkPopUp
                    work = {processedWork}
                    onClose={() => setWorkRedactionShown(false)}
                    handleAction={handleAction}
                />
            }

            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                //@ts-ignore
                message={{confirm: 'Да', reject: 'Нет'}}
                result={handleConfirmAction}
            />

            <Header/>
            <CurrentPath
                links={[
                    ['Главная', '/info'],
                    ['Каталог', '/catalog'],
                    [storedRestoration.name, `/restoration/${storedRestoration.id}`],
                    //@ts-ignore
                    [(restoreId ? 'Редактировать' : 'Добавить')],
                ]}
            />

            {/*Restoration part:*/}
            <div className="d-flex flex-column align-items-center">
                <div className="w-100 d-flex justify-content-end">
                    <Link className="btn btn-success mr-2" to="/manage/">Заявки</Link>
                    <Link className="btn btn-primary mr-2" to={"/catalog/"}>Каталог</Link>
                    <Button className="btn btn-primary mr-2" onClick={handleBackButton}>Назад</Button>
                </div>
                <form className="ml-5 mr-5 mt-0 content m-3 col-12 col-md-10 col-lg-8 col-xl-6"
                      onSubmit={changeForm}>
                    <div className="form-group">
                        <label className="form-label">Название:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            onChange={changeForm}
                            value={formData.name}
                            required
                        />
                    </div>
                    <div className="form-group mt-25">
                        <label className="form-label">Изображение:</label>
                        <input
                            className="form-control"
                            type="file"
                            name="image"
                            onChange={changeForm}
                            required={!formData.image}
                        />

                        {formData.image && (
                            <div className="form-group mt-25">
                                <label className="form-label">Изображение:</label>
                                <img
                                    src={typeof formData.image !== 'string' ? URL.createObjectURL(formData.image) : formData.image}
                                    alt="restoration"
                                    className="mb-2"
                                    style={{ maxWidth: '100%', height: 'auto' }} // Устанавливаем максимальную ширину
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-25">
                        <label className="form-label">Описание:</label>
                        <textarea
                            className="form-control"
                            rows={6}
                            name="description"
                            onChange={changeForm}
                            value={formData.description}
                            required
                        />
                    </div>
                    <div className='form-group mt-25'>
                        <label className='form-label'>Статус:</label>
                        <select
                            className="form-control"
                            name='status'
                            onChange={changeForm}
                            value={formData.status}>
                            <option value={restorationStatusMap[0][0]}>{restorationStatusMap[0][1]}</option>
                            <option value={restorationStatusMap[1][0]}>{restorationStatusMap[1][1]}</option>
                            <option value={restorationStatusMap[2][0]}>{restorationStatusMap[2][1]}</option>
                            required
                        </select>
                    </div>
                    <div className="mt-5 d-flex justify-content-center">
                        <Button
                            className="col-sm-3 mr-2"
                            variant="success"
                            onClick={() => handleAction(true, false)}
                        >
                            {restoreId ? 'Изменить' : 'Добавить'}
                        </Button>

                        {/*{restoreId &&*/}
                        {/*    <Button*/}
                        {/*        className="col-sm-2 ml-2"*/}
                        {/*        variant="danger"*/}
                        {/*        onClick={() => handleAction(true, true)}*/}
                        {/*    >*/}
                        {/*        Удалить*/}
                        {/*    </Button>*/}
                        {/*}*/}
                    </div>

                    {/*Works part:*/}
                    <div className="mt-5 w-100 text-center">
                        <div className="table-responsive mt-4">
                            {!works?.length ? (
                                <h2>...</h2>
                            ) : (
                                <table className="table table-bordered">
                                    <thead className="main-color text-white">
                                    <tr>
                                        <th>Наименование работы</th>
                                        <th>Требуется, ₽</th>
                                        <th className="text-center">Статус</th>
                                        <th className="text-center">Действие</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {works.map(work =>
                                        <RestorationWork
                                            work={work}
                                            isUpdateView={true}
                                            handleAction={() => handleRedactWork(work)}/>
                                    )
                                    }
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    {!restoreId ? '' : (<>
                        <div className="mt-5 d-flex  justify-content-center ">
                            <Button className="col-sm-4 " onClick={handleAddWork}>
                                Добавить работу
                            </Button>
                        </div>
                        <div className="mt-2 d-flex  justify-content-center ">
                            <Button className="col-sm-4 " href="#/new_restoration/">
                                Добавить реставрацию
                            </Button>
                        </div>
                    </>)}
                </form>

            </div>
        </div>
    );
}

export default RedactRestoration;

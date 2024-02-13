const errorMap = {
    400: {
        "This work already got enough donations..": "на эту работу уже забронировано достаточно заявок...",
        "you cant change status now": "теперь этот стутус сменить нельзя..",
    },
    3: {
        default: "доступ запрещен..."
    },
    5: {
        default: "произошла ошибка на сервере..."
    },
    504: {
        default: "сервер не доступен.."
    },
    default: "Произошла ошибка"
};

export const getErrorWithChangetText = error => {
    const errRaiser = (value, message) => {
        if (value) throw new Error(message);
    };

    errRaiser(!(error?.response?.status),
        "Error not applied or there is no response or its status field");
    let response = error.response

    let errorMessage;
    const errorDetail = error.response.data?.detail
    const errorStruct = errorMap[response.status] ||
        errorMap[Math.floor(response.status / 100)] || errorMap.default; // Last one is important

    errorMessage = (
        (errorDetail ? errorStruct[errorDetail]  :  undefined) || errorStruct.default
    ) || errorMap.default; // Last one is important

    if (!errorMessage && response.statusText) errorMessage =  response.statusText;
    else if (!errorMessage) errRaiser(errorMessage, "Unhandled error messange (default not specified)");

    return {
        ...error,
        response: {
            ...error.response,
            statusText: errorMessage
        }
    };
};

const statusError = ['StatusError', 'Ошибка статуса'];

export const paymentStatusMap = [
    ['Opened',    'Введена',   'Введенные'],
    ['Paid',      'Оплачена',  'Оплаченные'],
    ['Rejected',  'Отклонена', 'Отклоненные'],
    ['Completed', 'Принята',   'Принятые'],
    ['Deleted',   'Удалена',   'Удаленные']
];

export const workStatusMap = [
    ['NotStarted', 'Не начата'],
    ['InProcess',  'В процессе'],
    ['Completed',  'Завершена']
];

export const restorationStatusMap = [
    ['Forming',   'Формируется'],
    ['InProcess', 'В процессе'],
    ['Completed', 'Завершена']
];


const getStatus = (arr, value) => {
    const result = arr.find(element => element[0] === value);
    return result ? result : statusError[1];
}


export const getPaymentStatus = value => getStatus(paymentStatusMap, value);

export const getWorkStatus = value => getStatus(workStatusMap, value);

export const getRestorationStatus = value => getStatus(restorationStatusMap, value);

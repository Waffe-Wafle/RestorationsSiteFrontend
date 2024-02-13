const DIGITS_RU_NAMES: { [key: number]: string } = {
    1_000: 'тыс.',
    1_000_000: 'млн.',
    1_000_000_000: 'млрд.'
};


const displayInt = (value: number): string | number => {
    if (value) {
        value = parseInt(value.toString());
        for (let check of [1_000_000_000, 1_000_000, 1_000]) {
            if (value >= check) {
                let whole = Math.floor(value / check);
                let remains = value % check;
                if (remains.toString().length <= 2) {
                    return `${whole} ${DIGITS_RU_NAMES[check]}`;
                }
            }
        }
    }
    return value;
};


export default displayInt;



const shortField = (value: string): string =>
    value.length > 100 ? value.slice(0, 100) + '...' : value;


export default shortField;
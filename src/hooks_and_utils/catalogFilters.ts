import {RestorationType} from "../interfaces";


const catalogFilter = (softList: RestorationType[], search: string) => {
    search = search.toLowerCase();
    let filtered: RestorationType[] = [...softList].filter((elem) =>
        elem.name.toLowerCase().includes(search) ||
        elem.description.toLowerCase().includes(search) ||
        elem.total_sum.toString() === search ||
        (elem.works && elem.works.some((work) => work.name.toLowerCase().includes(search)))
    );
    return filtered;
};



export default catalogFilter;
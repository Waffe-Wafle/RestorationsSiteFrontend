import {RestorationType} from "../interfaces";


const catalogFilter = (restoreList: RestorationType[], search: string, filter: string) => {
    search = search.toLowerCase();
    console.log(filter)
    console.log(search)


    let filtered: RestorationType[] = [...restoreList].filter(elem =>
        (
            elem.name.toLowerCase().includes(search) ||
            elem.description.toLowerCase().includes(search) ||
            elem.total_sum.toString() === search ||
            elem.works && elem.works.some((work) => work.name.toLowerCase().includes(search))
        ) && (filter ? elem.status === filter : true)

    );
    return filtered;
};



export default catalogFilter;
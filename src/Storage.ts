import {useState} from "react";

let dataStorage: any = {};

export function setData(key: string, data: any, isState: boolean = true) {
    if (isState) {
        if (dataStorage[key] === undefined) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            dataStorage[key] = useState(data);
        }
        dataStorage[key][1](data);
        return;
    }
    dataStorage[key] = data;
}

export function getData(key: string, isState: boolean = true): any {
    if (isState) {
        return (dataStorage[key] === undefined ? undefined : dataStorage[key][0]);
    }
    return dataStorage[key];
}
import axios from "axios";
import {useEffect, useState} from "react";

let account: any = undefined;
let setaccount: any = undefined;

export function init() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [account, setaccount] = useState(undefined);

    useEffect(() => {
        refreshData();
    }, [])
}

export function refreshData(){
    axios.get('/api/auth/checksession').then(r => {
        if (r.data.return !== undefined) {
            if (r.data.return === true) {
                setaccount(r.data.data);
            }
        }
    })
}

export function isLogged() {
    return account !== undefined;
}

export function getAccountData() {
    return account;
}
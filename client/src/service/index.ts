import axios from "axios"
const BASE_URL = "http://localhost:3001/";

export const loginUser = async (params) =>{
    const url = `${BASE_URL}users/login`;
    const res = await axios.post(url, params);
    return res;
}

export const fetchTeam = async (params="") =>{
    const url = `${BASE_URL}teams/?email=${params}`;
    const res = await axios.get(url);
    return res;
}

export const fetchPlayer = async (params="") =>{
    const url = `${BASE_URL}players/transfer-list${params ? "?" : ""}${params}`;
    const res = await axios.get(url);
    return res;
}

export const changePlayerTransferListStatus = async (payload={}) =>{
    const url = `${BASE_URL}players/change-status`;
    const res = await axios.put(url, payload);
    return res;
}

export const buyPlayerApi = async (payload={}) =>{
    const url = `${BASE_URL}players/buy-player`;
    const res = await axios.put(url, payload);
    return res;
}
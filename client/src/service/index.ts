import axios from "axios"
const BASE_URL = "http://localhost:3001/";

export const loginUser = async (params) =>{
    const url = `${BASE_URL}users/login`;
    const res = await axios.post(url, params);
    return res;
}
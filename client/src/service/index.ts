import axios from "axios"
import { getStoredUser } from "../hooks/useUser";
const BASE_URL = "http://localhost:3001/";

const getConfig = ()=>{
    const jwtToken = getStoredUser()?.access_token;
    return jwtToken
    ? { Authorization: `Bearer ${jwtToken}` } 
    : {};
}

export const performRequest = (data, url, type, includeHeader)=>{
     const config = {
      method: type,
      url,
      data: data,
      headers: includeHeader ? getConfig() : {},
    };
     return new Promise((resolve, reject) => {
        axios(config)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            if (error.response?.status === 401) {
              localStorage.removeItem("currentUser");
              window.location.reload();
              return;
            } else {
              reject({ requestError: error });
            }
            console.log(error);
          });
      });
}

export const loginUser = async (params) =>{
    const url = `${BASE_URL}users/login`;
    const res = await performRequest(params, url, "post", false);
    return res;
}

export const fetchTeam = async (params="") =>{
    const url = `${BASE_URL}teams/?email=${params}`;
    const res = await performRequest(null, url, "get", true);
    return res;
}

export const fetchPlayer = async (params="") =>{
    const url = `${BASE_URL}players/transfer-list${params ? "?" : ""}${params}`;
    const res = await performRequest(null, url, "get", true);
    return res;
}

export const changePlayerTransferListStatus = async (payload={}) =>{
    const url = `${BASE_URL}players/change-status`;
    const res =  await performRequest(payload, url, "put", true);;
    return res;
}

export const buyPlayerApi = async (payload={}) =>{
    const url = `${BASE_URL}players/buy-player`;
    const res =  await performRequest(payload, url, "put", true);
    return res;
}
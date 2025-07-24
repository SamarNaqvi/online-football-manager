import { useEffect, useState } from "react"

export const useFetch = ({api, params})=>{
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const fetchData = async ()=>{
        try{
            setLoading(true);
            const resp = await api(params);
            setData(data);
        }
        catch(error){
            console.error(`Something Went Wrong: ${error?.message}`);
            setError(error?.message);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchData();
    },[]);

    return {loading, data, error};
}
import axios from "axios";

const axiosInstance = axios.create({
    baseURL :  "http://localhost:8000/api" ,
    withCredentials : true //send cookies with request
})

export default axiosInstance;
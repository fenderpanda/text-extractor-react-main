import axios from "axios";

const Axios = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL
})

export default Axios;
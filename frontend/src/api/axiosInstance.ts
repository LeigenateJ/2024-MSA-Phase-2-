import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7045/api', 
});

export default axiosInstance;
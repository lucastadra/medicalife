import axios from 'axios';

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_PROD_API}`,
    // baseURL: 'http://localhost:3000/dev',
});

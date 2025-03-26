import axios from 'axios';
import { GetItem } from "./storage";
import { StorageKey } from "../constants/constants";
import Cookies from 'js-cookie';  // Django CSRF токені үшін

// Django үшін негізгі URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApiInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,  // CSRF токені үшін қажет
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Интерсепторларды қосу
ApiInstance.interceptors.request.use(async (config) => {
    // JWT токенін алу
    const token = await GetItem(StorageKey.TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF токенін алу
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Django ошибкаларын өңдеу үшін интерсептор
ApiInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Django ошибкаларының форматын өңдеу
            const djangoError = error.response.data;
            const errorMessage = djangoError.detail || 
                               djangoError.message || 
                               Object.values(djangoError)[0] || 
                               'unknown error';
            
            return Promise.reject({
                message: errorMessage,
                status: error.response.status,
                data: error.response.data
            });
        }
        return Promise.reject(error);
    }
);

export default ApiInstance;
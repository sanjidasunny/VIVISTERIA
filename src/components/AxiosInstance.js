import axios from 'axios';

const axiosInstance = axios.create({
    baseURL:
        'http://localhost:5000/api',
    // 'https://vivisteria-2lrx.vercel.app/api',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Check if token is expired
        if (token && isTokenExpired(token)) {
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/refresh-token',
                    { refreshToken });
                token = response.data.token;
                localStorage.setItem('authToken', token);
            } catch (error) {
                console.error('Error refreshing token:', error);
                clearLocalStorageAndRedirect();
                return Promise.reject(error);
            }
        }

        if (token) {
            config.headers['authToken'] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearLocalStorageAndRedirect();
        }
        return Promise.reject(error);
    }
);

function isTokenExpired(token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const exp = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
}

function clearLocalStorageAndRedirect() {
    localStorage.clear();
    window.location.href = '/login';
}

export default axiosInstance;

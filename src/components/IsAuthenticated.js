import axiosInstance from './AxiosInstance';

const isAuthenticated = async () => {
    try {
        const response = await axiosInstance.post('/profile', {
            id: localStorage.getItem("userID"),
        });
        console.log('Response:', response);
        console.log('Response: ashdjiashd');
        return response.data.success;
    } catch (error) {
        console.error('Error verifying token: 1', error);
        return false;
    }
};

export default isAuthenticated;

import api from './client';

export const getDashboardStats = async () => {
    const response = await api.get('/statistics/dashboard');
    return response.data;
};

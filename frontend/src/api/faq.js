import axios from './client';

const API_PATH = '/faqs';

export const getAllFaqs = async (params) => {
    const response = await axios.get(API_PATH, { params });
    return response.data;
};

export const getPublicFaqs = async (params) => {
    const response = await axios.get(`/public${API_PATH}`, { params });
    return response.data;
};

export const getFaqById = async (id) => {
    const response = await axios.get(`${API_PATH}/${id}`);
    return response.data;
};

export const createFaq = async (data) => {
    const response = await axios.post(API_PATH, data);
    return response.data;
};

export const updateFaq = async (id, data) => {
    const response = await axios.put(`${API_PATH}/${id}`, data);
    return response.data;
};

export const deleteFaq = async (id) => {
    const response = await axios.delete(`${API_PATH}/${id}`);
    return response.data;
};

export const exportFaq = async (format = 'excel') => {
    return axios.get(`${API_PATH}/export?format=${format}`, {
        responseType: 'blob',
    });
};

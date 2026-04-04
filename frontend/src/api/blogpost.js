import axios from './client';

const API_PATH = '/blogposts';

export const getAllBlogPosts = async (params) => {
    const response = await axios.get(API_PATH, { params });
    return response.data;
};

export const getBlogPostById = async (id) => {
    const response = await axios.get(`${API_PATH}/${id}`);
    return response.data;
};

export const createBlogPost = async (data) => {
    const response = await axios.post(API_PATH, data);
    return response.data;
};

export const updateBlogPost = async (id, data) => {
    const response = await axios.put(`${API_PATH}/${id}`, data);
    return response.data;
};

export const deleteBlogPost = async (id) => {
    const response = await axios.delete(`${API_PATH}/${id}`);
    return response.data;
};

export const exportBlogPost = async (format = 'excel') => {
    return axios.get(`${API_PATH}/export?format=${format}`, {
        responseType: 'blob',
    });
};

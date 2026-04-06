import axios from './client';

const API_PATH = '/medicpedia_nutrisi';

export const getAllMedicpediaNutrisis = async (params) => {
    const response = await axios.get(API_PATH, { params });
    return response.data;
};

export const getMedicpediaNutrisiById = async (id) => {
    const response = await axios.get(`${API_PATH}/${id}`);
    return response.data;
};

export const createMedicpediaNutrisi = async (data) => {
    const response = await axios.post(API_PATH, data);
    return response.data;
};

export const updateMedicpediaNutrisi = async (id, data) => {
    const response = await axios.put(`${API_PATH}/${id}`, data);
    return response.data;
};

export const deleteMedicpediaNutrisi = async (id) => {
    const response = await axios.delete(`${API_PATH}/${id}`);
    return response.data;
};

export const exportMedicpediaNutrisi = async (format = 'excel') => {
    return axios.get(`${API_PATH}/export?format=${format}`, {
        responseType: 'blob',
    });
};

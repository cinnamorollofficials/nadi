import axios from './client';

const API_PATH = '/medicpedia_penyakit';

export const getAllMedicpediaPenyakits = async (params) => {
    const response = await axios.get(API_PATH, { params });
    return response.data;
};

export const getMedicpediaPenyakitById = async (id) => {
    const response = await axios.get(`${API_PATH}/${id}`);
    return response.data;
};

export const createMedicpediaPenyakit = async (data) => {
    const response = await axios.post(API_PATH, data);
    return response.data;
};

export const updateMedicpediaPenyakit = async (id, data) => {
    const response = await axios.put(`${API_PATH}/${id}`, data);
    return response.data;
};

export const deleteMedicpediaPenyakit = async (id) => {
    const response = await axios.delete(`${API_PATH}/${id}`);
    return response.data;
};

export const exportMedicpediaPenyakit = async (format = 'excel') => {
    return axios.get(`${API_PATH}/export?format=${format}`, {
        responseType: 'blob',
    });
};

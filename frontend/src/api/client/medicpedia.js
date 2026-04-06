import apiClient from '../client';

export const getPublicPenyakitAll = async (params = {}) => {
    return apiClient.get('/public/medicpedia/penyakit', { params });
};

export const getPublicPenyakitBySlug = async (slug) => {
    return apiClient.get(`/public/medicpedia/penyakit/${slug}`);
};

export const getPublicNutrisiAll = async (params = {}) => {
    return apiClient.get('/public/medicpedia/nutrisi', { params });
};

export const getPublicNutrisiBySlug = async (slug) => {
    return apiClient.get(`/public/medicpedia/nutrisi/${slug}`);
};

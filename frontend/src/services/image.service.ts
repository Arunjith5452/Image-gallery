import api from '../lib/axios';

class ImageService {
  async getImages() {
    const response = await api.get('/images');
    return response.data;
  }

  async uploadImages(formData: FormData) {
    const response = await api.post('/images/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteImage(id: string) {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  }

  async updateImage(id: string, formData: FormData) {
    const response = await api.put(`/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async reorderImages(items: { id: string; order: number }[]) {
    const response = await api.put('/images/reorder', { items });
    return response.data;
  }
}

export const imageService = new ImageService();

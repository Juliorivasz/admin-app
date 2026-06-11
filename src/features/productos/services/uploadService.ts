import axiosInstance from '../../../api/axios';

interface UploadResponse {
  image_url: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response: UploadResponse = await axiosInstance.post('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.image_url;
};

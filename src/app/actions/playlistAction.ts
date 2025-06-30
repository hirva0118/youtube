import axios from "axios";

export const createPlaylist = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const response = await axios.post("api/playlist", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPlaylist = async (id: string) => {
  try {
    const respone = await axios.get(`/api/playlist/user/${id}`);
    return respone.data;
  } catch (error) {
    console.log(error);
  }
};

export const addVideoToPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  try {
    const response = await axios.post(
      `/api/playlist/${playlistId}/video/${videoId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const removeVideoFromPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  try {
    const response = await axios.patch(
      `/api/playlist/${playlistId}/video/${videoId}`
    );
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const getPlaylistById = async (id: string) => {
  try {
    const response = await axios.get(`/api/playlist/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePlaylist = async (id: string) => {
  try {
    const response = await axios.delete(`/api/playlist/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

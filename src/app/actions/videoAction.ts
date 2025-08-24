import axios from "axios";

type VideoQueryParams = {
  page: number;
  limit: number;
  query?: string;
  sortBy?: string;
  sortType?: "asc" | "desc";
  userId?: string;
};

export const getVideo = async ({
  page = 1,
  limit = 10,
  query,
  sortBy,
  sortType,
  userId,
}: VideoQueryParams) => {
  try {
    const params: VideoQueryParams = { page, limit };
    if (query) params.query = query;
    if (sortBy) params.sortBy = sortBy;
    if (sortType) params.sortType = sortType;
    if (userId) params.userId = userId;

    const response = await axios.get("/api/video/getVideo", {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get videos error:", error);
    return new Error("Interner server error");
  }
};

export const getAllVideo = async ({
  page = 1,
  limit = 10,
  query,
  sortBy,
  sortType,
}: VideoQueryParams) => {
  try {
    const params: VideoQueryParams = { page, limit };
    if (query) params.query = query;
    if (sortBy) params.sortBy = sortBy;
    if (sortType) params.sortType = sortType;

    const response = await axios.get("/api/video/getAllVideo", {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get videos error:", error);
    return new Error("Interner server error");
  }
};

export const getVideoById = async(id:string) => {
    try {
      const response = await axios.get(`/api/video/videoById/${id}`);
      return response.data
    } catch (error) {
      console.log(error)
      return new Error("Interner server error");
    }
}

export const deleteVideo = async(id :string) => {
  try {
    const response = await axios.delete(`/api/video/videoById/${id}`);
    return response.data
  } catch (error) {
    console.log(error)
    return new Error("Internal server error");
  }
}

export const likeDislikeVideo = async(id:string) => {
  try {
    const response = await axios.post(`/api/like/likeVideo/${id}`);
    console.log("resp::",response.data)
    return response.data;
  } catch (error) {
    console.log(error)
    return new Error("Internal server error")
  }
}
export const publishToggleVideo = async (id:string) =>{
  try {
    const response = await axios.post(`/api/video/videoById/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    return new Error("Internal server error");
  }
}
export const addToWatchHistory = async(id:string) => {
  try {
    const response = await axios.post(`/api/video/watchHistory/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    return new Error("Internal server error");
  }
}

export const getFromWatchHistory = async() =>{
  try {
    const response = await axios.get("/api/users/getWatchHistory")
    return response.data;
  } catch (error) {
    console.log(error)
    return new Error("Internal server error")
  }
}

export const deleteFromWatchHistory = async (id:string) => {
  try {
    const response = await axios.delete(`/api/video/watchHistory/${id}`);
    return response.data
  } catch (error) {
    console.log(error)
    return new Error("Internal server error")
  }
}

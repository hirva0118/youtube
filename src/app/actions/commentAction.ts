import axios from "axios"

export const getComment = async(id:string) => {
    try {
        const response = await axios.get(`/api/comment/commentById/${id}`);
        return response.data
    } catch (error) {
        console.log(error)
        return new Error("Internal server error")
    }
}

export const addComment = async (id:string,comment:string) => {
    try {
        const response = await axios.post(`/api/comment/commentById/${id}`,{comment})
        return response.data;
    } catch (error) {
        console.log(error)
        return new Error("Internal server error")
    }
}

export const deleteComment = async(id:string) => {
    try {
        const resposne = await axios.delete(`/api/comment/commentById/${id}`)
        return resposne.data;
    } catch (error) {
        console.log(error)
        return new Error("Internal server error")
    }
}

export const likeDislikeComment = async(id:string) => {
    try {
        const response = await axios.post(`/api/like/likeComment/${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
        return new Error("Internal server error");
    }
}

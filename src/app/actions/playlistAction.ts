import axios from "axios"

export const createPlaylist = async(data:{name:string;description:string}) => {
    try {
        const response = await axios.post("api/playlist",data)
        return response.data;
    } catch (error) {
        console.log(error)
        
    }
}

export const getUserPlaylist = async(id:string) => {
    try {
        const respone = await axios.get(`/api/playlist/user/${id}`)
        return respone.data;
    } catch (error) {
        console.log(error)
    }
}
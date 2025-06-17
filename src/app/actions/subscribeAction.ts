import axios from "axios"

export const toggleSubscription = async(id:string) => {
    try {
        const response = await axios.post(`/api/subscribe/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return new Error("Internal server error")
    }
}
export const getUserChannel = async(username:string) => {
    try {
        const response = await axios.get(`/api/users/userChannelProfile/${username}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
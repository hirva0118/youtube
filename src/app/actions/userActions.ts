import axios from "axios";

export const signup = async (data: {
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  coverImage: string;
}) => {
  try {
    const response = await axios.post("/api/users/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      return {
        success: false,
        message: responseData.message || "Signup failed.",
      };
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || "Signup successful.",
    };
  } catch (error) {
    console.log("🚀 ~ signup ~ error:", error);
    return {
      success: false,
      message: "Something went wrong while signing up.",
    };
  }
};

export const signin = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post("/api/users/signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      return {
        success: false,
        message: responseData.message || "Login failed.",
      };
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || "Login successful.",
    };
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Something went wrong while logging in.",
    };
  }
};

export const logout = async () => {
  try {
    const response = await axios.get("/api/users/logout");

    const responseData = response.data;

    if (!responseData.success) {
      return {
        success: false,
        message: responseData.message || "Logout failed.",
      };
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || "Logout successful.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while logout.",
    };
  }
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axios.post("/api/users/changePassword", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = response.data;

    if (!responseData.success) {
      return {
        success: false,
        message: responseData.message || "Failed.",
      };
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || " Password changed Successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while Loging up.",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/users/getCurrentUser", {
      withCredentials: true,
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

import api from "./api";

const authService= {

    register: (userData)=>{
        return api.post("/auth/register", userData);
    },

    login :(userData)=>{

        return api.post("/auth/login", userData);
    },

    getProfile : (userId)=>{

        return api.get(`/user/profile"/${userId}`);
    },


};

export default authService;
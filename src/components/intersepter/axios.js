import axios from "axios";
let refresh = false;
const refresh_token = localStorage.getItem('refresh_token')


   axios.interceptors.response.use(resp => resp, async error => {
      if (error.response.status === 401 && !refresh && refresh_token) {
         axios.defaults.headers.common.Authorization = null;
         refresh = true;
         const response = await   
            axios.post('http://127.0.0.1:8000/api/user/token/refresh/', {      
            refresh:refresh_token
         });
         if (response.status === 200) {
            axios.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.reload(false)
            return axios(error.config);
         }
      }
   refresh = false;
   return Promise.reject(error);
   });

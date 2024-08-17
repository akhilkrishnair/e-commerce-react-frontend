import axios from "axios";



// export const baseUrl = "https://akhilkrishna.pythonanywhere.com"

// export const baseApiUrl =  "https://akhilkrishna.pythonanywhere.com/api/" 

const baseUrl = "http://127.0.0.1:8000"

const baseApiUrl =  "http://127.0.0.1:8000/api/" 


// without authentication axios
const accessToken = localStorage.getItem('access_token')

const axiosWithoutAuthentication = axios.create({
   baseURL:baseApiUrl
})


// with authentication axios
const axiosWithAuthentication = axios.create({
   baseURL:baseApiUrl
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
   refreshSubscribers.push(cb);
};

const processQueue = (token) => {
   refreshSubscribers.forEach((cb) => {
      if (token) {
         cb.headers['Authorization'] = `Bearer ${token}`
         axiosWithAuthentication(cb)
         .then(res => Promise.resolve(res))
         .catch(err => Promise.reject(err))
      }
   });
   isRefreshing = false
   refreshSubscribers = [];
};


axiosWithAuthentication.interceptors.request.use(
   async (config) => {
      if (!accessToken){
         return Promise.reject({response:{status:408}})
      }

      config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
      return config
   },

   (error) =>  Promise.reject(error)
)

axiosWithAuthentication.interceptors.response.use(
   (response) => response,

   async (error) => {
      const originalRequest = error.config;

      if(error.code === "ERR_NETWORK") return Promise.resolve(error)

      if (error.response.status === 401 && !isRefreshing) {

         isRefreshing = true;

         return new Promise((resolve, reject) => {
            
            axios.post(`${baseApiUrl}user/token/refresh/`, 
               { refresh: localStorage.getItem("refresh_token") })

            .then((response) => {

               localStorage.setItem("access_token", response.data.access);
               localStorage.setItem("refresh_token", response.data.refresh);

               axiosWithAuthentication.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
               originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;

               processQueue(response.data.access);
               
               axiosWithAuthentication(originalRequest)
               .then(refreshRes => resolve(refreshRes))
               .catch(refreshErr => reject(refreshErr))

            })
            .catch((err) => {

               localStorage.removeItem("access_token");
               localStorage.removeItem("refresh_token");

               window.location.href = '/user/login/'

            })
         });
      }

      if (error.response.status === 401) subscribeTokenRefresh(originalRequest);
      return Promise.resolve(error);
   }
);

export {
   baseUrl,
   baseApiUrl,
   accessToken,
   axiosWithAuthentication,
   axiosWithoutAuthentication
};

// Implementing a basic API client using Axios
import axios from 'axios';
import { store } from '../../store'; 


const Api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual base URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for request and response
Api.interceptors.request.use(
  (config) => {
    // For example, if you have a token stored in redux store
    const state = store.getState();
  //  const token = state.auth?.; // Adjust according to your auth slice with token
    // If you have a token, add it to the headers 

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response;
  },
  (error) => {
    // Handle response error
    console.error('Response error:', error);
    // Optionally, you can handle specific status codes here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // Redirect to login or show a message
     if (error.response && error.response.status === 403) {
        console.error('Forbidden access - redirecting to login');
        // Redirect to login or show a message
      }else {
        console.error('An error occurred - redirecting to login');
        // Redirect to login or show a message
      }
    } else if (error.response && error.response.status === 500) {
      console.error('Server error - please try again later');
      // Show a message to the user
    }
    return Promise.reject(error);
  }
);

export default Api;

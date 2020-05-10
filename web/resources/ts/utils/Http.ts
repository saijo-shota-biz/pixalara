import axios from "axios";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

axios.interceptors.request.use(config => {
  config.headers['X-XSRF-TOKEN'] = document.cookie.split(";")
    .map(cookie => cookie.split("="))
    .filter(([key]) => key === 'XSRF-TOKEN')
    .map(([key, value]) => value)[0];
  return config
})

axios.interceptors.response.use(
  response => response,
  error => error.response || error
);

export default axios;

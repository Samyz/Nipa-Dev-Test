import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://nipa-dev.herokuapp.com/',
});

export default instance;

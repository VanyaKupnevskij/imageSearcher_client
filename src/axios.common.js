import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3245/api',
  headers: {
    'Content-type': 'application/json',
  },
});

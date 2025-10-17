import axios from 'axios';

const api = axios.create({
  // Viteのプロキシ設定により、開発環境では '/api' へのリクエストが
  // http://backend:8000/api へと転送される
  baseURL: '/', 
});

export default api;

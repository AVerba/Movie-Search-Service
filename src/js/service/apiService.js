const axios = require('axios'); 
import apiSettings from './apiSettings';
const { API_KEY, BASE_URL }=apiSettings;

export default class MovieApiService{
    constructor() {
        this.query = '';
        this.page = 1;
    }

    async fetchTrendingMovie() {

        const response = await axios.get(`${BASE_URL}trending/all/day?api_key=${API_KEY}&page=${this.page}`);
        const data = await response.data;

        return data;
    }
    async fetchSearchMovie() {
        
        const response = await axios.get(`${BASE_URL}search/movie?query=${this.query}&api_key=${API_KEY}&page=${this.page}`);
        const data = await response.data;

        return data;
    }
    async fetchDetailInfoMovie(movieId) {
       
        const response = await axios.get(`${BASE_URL}movie/${movieId}?api_key=${API_KEY}`);
        const data = await response.data;

        return data;
    }

    get searchQuery() {
        return this.query;
    }

    set searchQuery(newQuery) {
        this.query = newQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}

/* export const apiService=(url,options)=>{
    return fetch(url,options).then(response=>{
        if(!response.ok){
            return response.json.then(error=>Promise.reject(error))
        }
         return response.json();
    })
} */




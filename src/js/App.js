
import MovieApiService from "./service/apiService";

import debounce from 'lodash.debounce';


const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");

const movies=new MovieApiService();

const searchTrendingMovie = async ()=>{
    const getMoviesData = await movies.fetchTrendingMovie();
    const {results}=getMoviesData;
   /*  console.log(results) */

}
const formSearcMoviehHendler = async (e)=>{
    e.preventDefault();
    
    movies.searchQuery=formInput.value.trim();
    
    
    const getMoviesData = await movies.fetchSearchMovie();
    const {results}=getMoviesData;
    console.log(results)

}
formInput.addEventListener('input', debounce(formSearcMoviehHendler, 500));
searchTrendingMovie();


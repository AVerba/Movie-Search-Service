
import MovieApiService from "./service/apiService";

import debounce from 'lodash.debounce';


const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");

const movies=new MovieApiService();

const searchTrendingMovie = async ()=>{
    const getMoviesData = await movies.fetchTrendingMovie();
    console.log(getMoviesData.results)

}
const formSearcMoviehHendler = async (e)=>{
    e.preventDefault();
    
    movies.searchQuery=formInput.value.trim();
    
    console.log(`TEST ${ movies.searchQuery}`);
    formInput.value=" ";
    const getMoviesData = await movies.fetchSearchMovie();
    console.log(getMoviesData.results)

}
formBtn.addEventListener('click', formSearcMoviehHendler);
searchTrendingMovie();


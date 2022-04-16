
import MovieApiService from "./service/apiService";

import debounce from 'lodash.debounce';


const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");
const allGenresMovie=[];

const movies=new MovieApiService();

const getTrendingMovie = async ()=>{
    const getMoviesData = await movies.fetchTrendingMovie();
    const {results}=getMoviesData;
   /*  console.log(results) */
}
const getAllGenresMovie = async ()=>{
    return await movies.fetchGenresMovie();
}

const getCommonGenres =(aLLGenresID,userGenreID)=>{
    const genres=[];
/*     console.log(aLLGenresID)
    console.log(`User${userGenreID}`) */
         userGenreID.forEach(genreID=>{
        let genre = aLLGenresID.find(item => item.id === genreID);
        if(genre){
            genres.push(genre.name)
        }

        
    })
    return genres;
 

}
getTrendingMovie();
getAllGenresMovie();

const formSearcMoviehHendler = async (e)=>{
    e.preventDefault();
    
    movies.searchQuery=formInput.value.trim();
    
    
    const getMoviesData = await movies.fetchSearchMovie();
    const {results}=getMoviesData;
    const {genres} = await getAllGenresMovie();

    results.map(item=>{
        const {genre_ids, title, id}=item;
        const movieGenre=getCommonGenres(genres,genre_ids);

        console.log(`ФІЛЬИ з ID:${id}; НАЗВА: ${title};  ЖАНР: ${movieGenre.join(',')}`)

    })
}

;
/* formInput.addEventListener('input', debounce(formSearcMoviehHendler, 500)); */
formBtn.addEventListener('click', formSearcMoviehHendler );



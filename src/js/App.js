
import MovieApiService from "./service/apiService";
import galleryMurkup from "../template/galleryMurkup.hbs";
import selectedMovieCard from "../template/selectedMovieCard";

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");
const pageContainer=document.querySelector('.pageContainer');
const ModalCardTomb=document.querySelector('.modal__card');


/* const allGenresMovie=[]; */

const movies=new MovieApiService();

const getTrendingMovie = async ()=>{
    const getMoviesData = await movies.fetchTrendingMovie();
    const {results}=getMoviesData;
    clearGalleryContainer(pageContainer);
    movies.resetPage();
    const markup = galleryMurkup(results);
    galleryMarkUp(markup, pageContainer);
}

const getAllGenresMovie = async ()=>{
    return await movies.fetchGenresMovie();
}

const getCommonGenres =(aLLGenresID,userGenreID)=>{
    const genres=[];
         userGenreID.forEach(genreID=>{
        let genre = aLLGenresID.find(item => item.id === genreID);
        if(genre){
            genres.push(genre.name)
        }        
    })
    return genres;
}

const getMovieID=async (e)=>{
console.log(Number(e.target.getAttribute('data-id')))
const movieID=Number(e.target.getAttribute('data-id'));
const selectedMovieInfo= await movies.fetchDetailInfoMovie(movieID);

const modalMarkup = await selectedMovieCard(selectedMovieInfo);
/* pageContainer.insertAdjacentHTML('beforeend',modalMarkup); */
ModalCardTomb.insertAdjacentHTML('beforeend',modalMarkup);
console.log(modalMarkup);
}

getTrendingMovie();
getAllGenresMovie();

const formSearcMoviehHendler = async (e)=>{
    e.preventDefault();
    
    movies.searchQuery=formInput.value.trim();
    
    
    const getMoviesData = await movies.fetchSearchMovie();
    const {results, total_results}=getMoviesData;
    const {genres} = await getAllGenresMovie();
    console.log(results)

    if (results.length === 0) {

        Notify.failure('Sorry, there are no images matching your search query. Please try again.');

    } else {
        const tempGanres=[];
        results.map(item=>{
            const tempGanres=[];
            const {genre_ids, title, id}=item;
            const movieGenre=getCommonGenres(genres,genre_ids);             
            item['ganres_names']=movieGenre.join(', ');
               
        })
        
        results['tempGanres']=tempGanres;
        console.log(results)

        Notify.success(`Hooray! We found ${total_results} movies.`);
        
        clearGalleryContainer(pageContainer);
        movies.resetPage();

        const markup = galleryMurkup(results);
        galleryMarkUp(markup, pageContainer);

    }


}

function galleryMarkUp(items,ref) {

    ref.insertAdjacentHTML('beforeend', items);

}
function clearGalleryContainer(ref) {
    ref.innerHTML = '';
  }
;
/* formInput.addEventListener('input', debounce(formSearcMoviehHendler, 500)); */
formBtn.addEventListener('click', formSearcMoviehHendler );
pageContainer.addEventListener('click',getMovieID )



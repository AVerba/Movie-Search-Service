
import MovieApiService from "./service/apiService";
import galleryMurkup from "../template/galleryMurkup.hbs";
import selectedMovieCard from "../template/selectedMovieCard";
 
import { devModal } from "./forms/devForm";

import Pagination from "tui-pagination";
 
import 'tui-pagination/dist/tui-pagination.css';


import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {openModalWindow, clouseModalWindow} from "../js/togleForm";


const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");
const pageContainer=document.querySelector('.pageContainer');
const ModalCardTomb=document.querySelector('.modal__card');
 
const openAccountModalBtn = document.querySelector("[data-modal-open]");
const modal = document.querySelector("[data-modal]");
const closeAccountModalBtn = document.querySelector("[data-modal-close]");

const filmInfoModal = document.querySelector("[data-film-info]");
const openDevModal=document.querySelector("[data-dev-open]");
const closeDevModal = document.querySelector("[data-dev-close]");
const modalDev=document.querySelector("[data-dev-modal]");


const container = document.querySelector('#tui-pagination-container'); 
const pagination =new Pagination(container,
    {
        itemsPerPage: 20,
        visiblePages: 5,
      })
/* const pagination = new Pagination(container, {
  itemsPerPage: 20,
  visiblePages: 5,
});
 */




const movies=new MovieApiService();
const paginationPage = pagination.getCurrentPage();


//=============ПОЛУЧАЕМ ВСЕ НОВИНКИ ФИЛЬМОВ=============================
const getTrendingMovie = async ()=>{
    /* movies.setPage(paginationPage); */
    console.log(movies.Page())
    const getMoviesData = await movies.fetchTrendingMovie();
    pagination.reset(getMoviesData.total_results);
    const {genres} = await getAllGenresMovie();
    const {results}=getMoviesData;
    console.log(getMoviesData)

    const tempGanres=[];
    results.map(item=>{
         
        const {genre_ids}=item;
        const movieGenre=getCommonGenres(genres,genre_ids);             
        item['ganres_names']=movieGenre;               
    })
    
    results['tempGanres']=tempGanres;
    results.forEach(item=>{
        item.release_date=new Date(Date.parse(item.release_date)).getFullYear()
    })

    clearGalleryContainer(pageContainer);
    movies.resetPage();
    const markup = galleryMurkup(results);
    galleryMarkUp(markup, pageContainer);


}
//=========================================================================

//==========Pagination======================================================
pagination.on('beforeMove', event => {

    const currentPage = event.page;
     
    movies.setPage(currentPage);
    console.log(movies.Page())
    console.log(currentPage)
    getTrendingMovie();
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
  });
//=========================================================================

//==========================ПОЛУЧАЕМ ВСЕ ЖАНРЫ=============================
const getAllGenresMovie = async ()=>{
    return await movies.fetchGenresMovie();
}
//=========================================================================

//=============ПОЛУЧАЕМ   ЖАНРЫ КАЖДОГО ФИЛЬМА=============================
const getCommonGenres =(aLLGenresID,userGenreID)=>{
    const genres=[];
    const tempGenres=[];

         userGenreID.forEach(genreID=>{
        let genre = aLLGenresID.find(item => item.id === genreID);
        if(genre){
            genres.push(genre.name)
        }
        if(genres.length>2){
           genres.splice(2) ;
           genres.push('Other');           
        }        
    })
    return genres;
}
//====================================================================

//=============ПОЛУЧАЕМ   ФИЛЬМ С ЗАПРОСА=============================
const getMovieID=async (e)=>{
    clearGalleryContainer(ModalCardTomb);  
 
const movieID=Number(e.target.getAttribute('data-id'));
const selectedMovieInfo= await movies.fetchDetailInfoMovie(movieID);

const modalMarkup = await selectedMovieCard(selectedMovieInfo);
 
ModalCardTomb.insertAdjacentHTML('beforeend',modalMarkup);


openModalWindow(filmInfoModal);
const closeModalBtn = document.querySelector("[data-close]");
/* closeModalBtn.addEventListener('click',clouseModalWindow(filmInfoModal) ); */
}
//=============ПОЛУЧАЕМ   ФИЛЬМ С ЗАПРОСА=============================

getTrendingMovie();
getAllGenresMovie();




const formSearcMoviehHendler = async (e)=>{
    e.preventDefault();
    
    movies.searchQuery=formInput.value.trim();
    
    
    const getMoviesData = await movies.fetchSearchMovie();
    const {results, total_results}=getMoviesData;
    const {genres} = await getAllGenresMovie();
    console.log(results)
    results.forEach(item=>{
        item.release_date=new Date(Date.parse(item.release_date)).getFullYear()

    })
 

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
openAccountModalBtn.addEventListener('click', ()=>{
    modal.classList.remove("is-hidden")
  }, false);
  
closeAccountModalBtn.addEventListener('click',()=>{
    modal.classList.add("is-hidden")
    
}, false);


openDevModal.addEventListener('click', ()=>{
    console.log(modalDev)
    modalDev.classList.remove('is-hidden');
})

closeDevModal.addEventListener('click',()=>{
    modalDev.classList.add('is-hidden');
})
formBtn.addEventListener('click', formSearcMoviehHendler );
pageContainer.addEventListener('click',getMovieID )



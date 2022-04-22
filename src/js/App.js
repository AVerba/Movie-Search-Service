
import MovieApiService from "./service/apiService";
import galleryMurkup from "../template/galleryMurkup.hbs";
import selectedMovieCard from "../template/selectedMovieCard";
import {Movies} from "./fireBase/movies";
import { devModal } from "./forms/devForm";

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


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




/* const allGenresMovie=[]; */

const movies=new MovieApiService();

const getTrendingMovie = async ()=>{
    const getMoviesData = await movies.fetchTrendingMovie();
    const {genres} = await getAllGenresMovie();
    const {results}=getMoviesData;

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

const getAllGenresMovie = async ()=>{
    return await movies.fetchGenresMovie();
}

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

const getMovieID=async (e)=>{
    clearGalleryContainer(ModalCardTomb);  
console.log(Number(e.target.getAttribute('data-id')))
const movieID=Number(e.target.getAttribute('data-id'));
const selectedMovieInfo= await movies.fetchDetailInfoMovie(movieID);

const modalMarkup = await selectedMovieCard(selectedMovieInfo);
/* pageContainer.insertAdjacentHTML('beforeend',modalMarkup); */
ModalCardTomb.insertAdjacentHTML('beforeend',modalMarkup);
Movies.create(movieID);
console.log(modalMarkup);
filmInfoModal.classList.remove("is-hidden")
closeMovieModal();

}

getTrendingMovie();
getAllGenresMovie();


function closeMovieModal (e) {
    const closeModalBtn = document.querySelector("[data-close]");
    closeModalBtn.addEventListener('click',()=>{
        filmInfoModal.classList.add("is-hidden");
        
    })
    console.log(closeModalBtn)
 
}

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
   /*  results.release_date.split(' ').splice(1).join('') */

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



/* formInput.addEventListener('input', debounce(formSearcMoviehHendler, 500)); */
openDevModal.addEventListener('click', ()=>{
    console.log(modalDev)
    modalDev.classList.remove('is-hidden');
})

closeDevModal.addEventListener('click',()=>{
    modalDev.classList.add('is-hidden');
})
formBtn.addEventListener('click', formSearcMoviehHendler );
pageContainer.addEventListener('click',getMovieID )



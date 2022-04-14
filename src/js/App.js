const form =document.getElementById('searchFilm');
const formBtn=form.querySelector("#searchBtn");
const formInput=form.querySelector("#searchInput");

const formSearchHendler=(e)=>{
    e.preventDefault();
    
    console.log(`TEST ${formInput.value}`);
    formInput.value=""

}

formBtn.addEventListener('click', formSearchHendler);
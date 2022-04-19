export class Movies {
    static create (movie){
        fetch('https://movie-search-service-default-rtdb.firebaseio.com/movies.json',{
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'aplicatiot/json',
            }
        })
        .then(response=>{
            return response.json();
        })
        .then(response=>{
            console.log(response)
        })
    }
}
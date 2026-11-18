const API_KEY = 'f96876c6';


const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const grid = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultInfo');
const sort = document.querySelector('#sortSelect')

let moviesResults = [];


async function searchMovies(searchTerm) {

    const term = searchTerm.trim();

    if (!term) return;

    resultsInfo.innerHTML = `<span>Showing: </span>${term}`;

    resultsInfo.innerHTML = `<span>Showing: </span>${term}`;
    grid.innerHTML = `
    <div class="movie-card movie-card--skeleton">
      <div class="movie-card__img--skeleton"></div>
      <div class="movie-card__title--skeleton"></div>
      <div class="movie-card__year--skeleton"></div>
    </div>
  `.repeat(10);


    try {
        const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'False') {
            movieResults = [];
            grid.innerHTML = `<p>${data.Error}</p>`
        }

        movieResults = data.Search;
        displayMovies();
    }

    catch(error){
        console.log(error);
        grid.innerHTML = '<p>Could not load movies. Please try again. </p>';
    }
}

function displayMovies() {
    let moviesToDisplay = [...movieResults];



    if (sort.value === 'a-z') {
        moviesToDisplay.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    else if (sort.value === 'z-a') {
        moviesToDisplay.sort((a,b) => b.Title.localeCompare(a.Title));
    }
    else if (sort.value === 'newest') {
        moviesToDisplay.sort((a, b) => getYear(b.Year) - getYear(a.Year))
    }
    else if (sort.value === 'older') {
        moviesToDisplay.sort((a, b) => getYear(a.Year) - getYear(b.Year))
    }


    grid.innerHTML = moviesToDisplay.map((movie) => {
        let poster;
        
        if(!movie.Poster || movie.Poster.trim() === 'N/A'){
            poster = `
            <div class="movie-card__poster-placeholder">
            Movie Poster<br />Not Available
            </div>`;
        }
        
        else{
            poster = `<img class="movie-card__img" src="${movie.Poster}" alt="${movie.Title}">
            `;
        }
        
        return `
        <div class="movie-card">
          ${poster}
          <h2 class="movie-card__title">${movie.Title}</h2>
          <p class="movie-card__year">${movie.Year}</p>
        </div>`
        ;
    }) .join('');
}

grid.addEventListener('error', (event) =>{
    if (!event.target.matches('.movie-card__img')) return;

    const placeholder = document.createElement('div');
    placeholder.className = 'movie-card__poster-placeholder';
    placeholder.innerHTML = 'Movie Poster <br> Not Available';
    
    event.target.replaceWith(placeholder);
}, true);

function getYear(year) {
    const number = year.match(/\d{4}/);
    return number ? Number(number[0]) : 0;
}

form.addEventListener('submit', (event)=> {
    event.preventDefault();
    searchMovies(input.value);
});

sort.addEventListener('change', displayMovies);

searchMovies('Gintama');
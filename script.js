const API_KEY = "f96876c6";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#searchInput");
const grid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");
const sort = document.querySelector("#sortSelect");
const loadingElement = document.querySelector(".movies__loading");

let movieResults = [];



//This will toggle the loading ui and will disable for searching until it loads in
function setLoading(isLoading) {

    // I used the if statement to easily disable the continously searching and sorting then enable the loading UI
    if (isLoading) {
        //if the loading is true, it will make the loading indicator active through CSS
    loadingElement.classList.add("movies__loading--active");
    grid.innerHTML = ""; // Clear existing movies during fetch
  } else {
    //this will make the loading indicator hidden when the loading ends
    loadingElement.classList.remove("movies__loading--active");
  }
//if the element is not yet in the screen it will disable the search box and the sort
  if (sort) sort.disabled = isLoading;

  if (input) input.disabled = isLoading;
}

async function searchMovies(searchTerm) {
  const term = searchTerm.trim();



  //this will stop the search if the search bar is blank/empty
  if (!term) return;

  //the results wil be true if that element exists on the page
  if (resultsInfo) {
    //this will show the exact string that you typed in the search bar
    resultsInfo.innerHTML = `<span>Showing: </span>${term}`;
  }
  //will enter the loading state before starting the network request
  setLoading(true);

  try {
    //omdb url
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}`;
    //await to read
    const response = await fetch(url);
    //await to convert into json
    const data = await response.json();


    //if there's no matching data/movies in the jason it will display error
    if (data.Response === "False") {
      movieResults = [];
      grid.innerHTML = `<p>${data.Error}</p>`;
      return;
    }

    //success to retrieve the array and render it
    movieResults = data.Search;
    displayMovies();
  }
  //this will handle the network failures 
  catch (error) {
    //this will leave a message for error
    grid.innerHTML = "<p>Could not load movies. Please try again. </p>";
  } finally {
    //ending the loading state whether the request succeeded, found no results, or threw an error. 
    setLoading(false);
  }
}


//this function is for sorting the results and generate a card for each movieResults
function displayMovies() {
  let moviesToDisplay = [...movieResults];

  //sort by title a-z
  if (sort.value === "a-z") {
    moviesToDisplay.sort((a, b) => a.Title.localeCompare(b.Title));
  } 
  //sort by title z-a
  else if (sort.value === "z-a") {
    moviesToDisplay.sort((a, b) => b.Title.localeCompare(a.Title));
  }
  //sort by years newest 
  else if (sort.value === "newest") {
    moviesToDisplay.sort((a, b) => getYear(b.Year) - getYear(a.Year));
  }
    //sort by years oldest
  else if (sort.value === "oldest") {
    moviesToDisplay.sort((a, b) => getYear(a.Year) - getYear(b.Year));
  }


  //converting every movie object to the HTML
  grid.innerHTML = moviesToDisplay
    .map((movie) => {
      let poster;



      //if the movie has no poster provided by omdb it will use the css thats provided
      if (!movie.Poster || movie.Poster.trim() === "N/A") {
        poster = `
            <div class="movie-card__poster-placeholder">
            Movie Poster<br />Not Available
            </div>`;
      } 
      //this will create a real poster provided by the omdb
      else {
        poster = `<img class="movie-card__img" src="${movie.Poster}" alt="${movie.Title}">
            `;
      }

      //showing the complete card that has poster, title, and the realeased year
      return `
        <div class="movie-card">
          ${poster}
          <h2 class="movie-card__title">${movie.Title}</h2>
          <p class="movie-card__year">${movie.Year}</p>
        </div>`;
    })
    .join("");
}


//this will take the image errors and add it to the grid(moviesGrid) later
grid.addEventListener(
  "error",
  (event) => {
    //this will be activated if the poster image is error
    if (!event.target.matches(".movie-card__img")) return;

    //it will create a new element for the poster
    const placeholder = document.createElement("div");
    placeholder.className = "movie-card__poster-placeholder";
    placeholder.innerHTML = "Movie Poster <br> Not Available";

    //it will replace the broken image so it can fit with the rest of the movie results
    event.target.replaceWith(placeholder);
  },
  true,
);

//this function will get the four-digit year from omdb's year field for the sorting 
function getYear(year) {
    //i just searched this on google just to get the
    //  4 digits in a string or numbers using the regex in js
    //\d for digits \w for word \s for spaces .any character
  const number = year.match(/\d{4}/); 
  //return the matched year as a number,
  // if the feild contains no four-digit it will return 0
  return number ? Number(number[0]) : 0; 
}

form.addEventListener("submit", (event) => {
    //preventing the browser from navigating or refreshing the page while submitting
  event.preventDefault();
  searchMovies(input.value);
});

//to reorder the fetched cards whenever changing the sorting options
sort.addEventListener("change", displayMovies);

searchMovies("Gintama"); //my favorite movie/show when i was a kid

//dont mind the comments,
//  this is just to make sure that i understand how it will function properly

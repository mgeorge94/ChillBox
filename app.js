// make nav bar btns incline

//show nav on click
const showNav = () => {
  const burgerBtn = document.querySelector('.fa-bars');
  const navContainer = document.querySelector('.nav-container');
  const navBtnsContainer = document.querySelector('.nav-btns');
  const navBtns = navBtnsContainer.querySelectorAll('li');
  let marginBtnLeft = 8;

  let navDelayCounter = 1;
  for (let i = 0; i < navBtns.length; i++) {
    navBtns[i].classList.add('show');
    navBtns[i].style.animationDelay = navDelayCounter;
    //   make btns incline
    navBtns[i].style.marginLeft = `${marginBtnLeft}rem`;
    marginBtnLeft -= 1.5;
    navDelayCounter += 1;
  }
  burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();

    navContainer.classList.add('show');
    burgerBtn.style.display = 'none';
  });
};
showNav();
const hideNav = () => {
  const burgerBtn = document.querySelector('.fa-bars');
  const navContainer = document.querySelector('.nav-container');

  navContainer.classList.remove('show');
  burgerBtn.style.display = 'block';
};
//hide nav
const body = document.querySelector('body').addEventListener('click', hideNav);
// prepare for latencies and show animation
const showAnimation = () => {
  const animationContainer = document.querySelector('.animation-wrapper');
  const grid = document.querySelector('.movie-grid');
  const movieElements = document.querySelectorAll('.movie-element');
  const categoryTitle = document.querySelector('.category-title');
  categoryTitle.style.display = 'none';
  grid.style.display = 'none';
  animationContainer.style.display = 'grid';
  setTimeout(() => {
    animationContainer.style.display = 'none';
    grid.style.display = 'grid';
    categoryTitle.style.display = 'block';
  }, 2000);
};
//create movie html
const createMovieHTML = (title, coverImg) => {
  const movieGrid = document.querySelector('.movie-grid');
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie-element');
  const movieTitle = document.createElement('h5');
  movieTitle.classList.add('movie-title');
  movieElement.appendChild(movieTitle);
  const movieElementImage = document.createElement('img');
  movieElementImage.classList.add('movie-element-image');
  movieElement.appendChild(movieElementImage);
  movieGrid.appendChild(movieElement);
  movieElementImage.src = coverImg;
  movieTitle.innerText = title;
};

// sanitize grid

const sanitizeGrid = () => {
  const movieGrid = document.querySelector('.movie-grid');

  while (movieGrid.lastElementChild) {
    movieGrid.removeChild(movieGrid.lastElementChild);
  }
};
// insert matched searched movies

const movieAPI = new URL('https://yts.mx/api/v2/list_movies.json');
//acces movie api
const fetchMovieData = (objectWithParameters) => {
  $.get(movieAPI, objectWithParameters).done(function (data) {
    const movieList = data.data.movies;

    movieList.forEach((movie) => {
      let title = movie.title_long;
      titleForSearch = movie.title;
      let movieId = movie.id;

      let coverImg = movie.medium_cover_image;

      let backgroundImage = movie.background_image_original;
      let genre = movie.genres;
      let summary = movie.summary;
      let description = movie.description_full;
      let rating = movie.rating;

      createMovieHTML(title, coverImg);
    });
  });
};
window.onload = fetchMovieData();

//click on favourites btn
const favouritesBtn = document.querySelector('.favourites-btn');
favouritesBtn.addEventListener('click', () => {
  const categoryTitle = document.querySelector('.category-title');
  categoryTitle.textContent = 'Crowd favourites';
  sanitizeGrid();
  const parameters = {
    minimum_rating: 8,
    limit: 40,
  };
  fetchMovieData(parameters);
  showAnimation();
});

//  click on search btn;
(function clickOnSearchContainer() {
  const searchBtnContainer = document.querySelector('.search-btn-container');
  searchBtnContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
})();

// click on search icon on enter

const searchBar = document.querySelector('.searchbox-input');
searchBar.addEventListener('keypress', (e) => {
  const categoryTitle = document.querySelector('.category-title');
  categoryTitle.textContent = 'Crowd favourites';

  if (e.key === 'Enter') {
    categoryTitle.textContent = 'Movies related to your search';
    sanitizeGrid();

    const wantedMovie = searchBar.value.toLowerCase().split('/(s+)/').join();
    const parameters = {
      query_term: wantedMovie,
    };
    fetchMovieData(parameters);
    showAnimation();
  } else if (e.key === 'Backspace') {
    console.log(wantedMovie);
  }
});

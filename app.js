//show nav on click
const showNav = () => {
  const burgerBtn = document.querySelector('.fa-bars');
  const navContainer = document.querySelector('.nav-container');
  const navBtnsContainer = document.querySelector('.nav-btns');
  const navBtns = navBtnsContainer.querySelectorAll('li');
  let marginBtnLeft = 8;

  let navDelayCounter = 0;
  for (let i = 0; i < navBtns.length; i++) {
    navBtns[i].classList.add('show');
    navBtns[i].style.animationDelay = `${navDelayCounter}s`;
    //   make btns incline
    navBtns[i].style.marginLeft = `${marginBtnLeft}rem`;
    marginBtnLeft -= 1.5;
    navDelayCounter += 0.1;
  }
  burgerBtn.addEventListener('click', (event) => {
    console.log('click');
    event.stopPropagation();

    navContainer.classList.add('show');
    burgerBtn.style.display = 'none';
  });
};
showNav();
// show genres
const showGenres = () => {
  const genresContainer = document.querySelector('.genres-container');
  const allGenresBtns = genresContainer.querySelectorAll('li');
  let marginBtnLeft = 0;
  let animationDelayCounter = 0.4;
  // inlay btns

  for (let i = 0; i < allGenresBtns.length; i++) {
    allGenresBtns[i].classList.add('show');
    allGenresBtns[i].style.animationDelay = ` ${animationDelayCounter}s`;

    allGenresBtns[i].style.marginLeft = `${marginBtnLeft}rem`;
    marginBtnLeft += 1;
    animationDelayCounter += 0.1;
  }
  genresContainer.classList.add('show');
};
const genresBtn = document.querySelector('.genres-btn');
genresBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  showGenres();
});
//hideNav
const hideNav = () => {
  const burgerBtn = document.querySelector('.fa-bars');
  const navContainer = document.querySelector('.nav-container');

  navContainer.classList.remove('show');
  burgerBtn.style.display = 'block';
};
//hide genres Container
const hideGenresContainer = () => {
  const genresContainer = document.querySelector('.genres-container');
  genresContainer.classList.remove('show');
};
const body = document.querySelector('body').addEventListener('click', () => {
  hideNav();
  hideGenresContainer();
});
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
  // add fallback image to image
  movieElementImage.setAttribute('onerror', ` this.src="./resources/large-cover.jpg"`);
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
//access movie api
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
    insertMovieTrailer(movieList);
  });
};
// things to start when page loads
window.onload = function () {
  let pageIndex = Math.floor(Math.random() * 100);

  const parameters = {
    page: pageIndex,
    sort_by: 'year',
  };
  fetchMovieData(parameters);
};

//insert trailer into top
function insertMovieTrailer(movieList) {
  const trailerHTML = document.querySelector('.movie-trailer');
  const movieDescriptionHTML = document.querySelector('.movie-description');

  const movieTitleHTML = document.querySelector('.movie-title');
  movieList.forEach((movie) => {
    //paint random movie
    const randomMovieIndex = [Math.floor(Math.random() * movieList.length)];
    let movieRandomTrailerCode = movieList[randomMovieIndex].yt_trailer_code;
    let movieRandomDescription = movieList[randomMovieIndex].summary;
    let movieRandomTitle = movieList[randomMovieIndex].title_long;
    //paint only movies with valid trailer
    if (movieRandomTrailerCode !== '') {
      let movieTrailer = `https://www.youtube.com/embed/${movieRandomTrailerCode}?showinfo=0&controls=0`;
      trailerHTML.src = `${movieTrailer}`;

      movieTitleHTML.textContent = movieRandomTitle;
      // trim down big description
      if (movieRandomDescription.length > 300) {
        const slicedMovieDescription = movieRandomDescription.slice(0, 300).concat('', '  ...');

        movieDescriptionHTML.textContent = slicedMovieDescription;
      } else {
        movieDescriptionHTML.textContent = movieRandomDescription;
      }
    }
  });
}

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
// match genresBTns to movie genres
const matchGenres = () => {
  const allGenreBtns = document.querySelectorAll('.genres-btns >li>span');
  allGenreBtns.forEach((genre) => {
    // console.log(genre.textContent);
    const parameters = {
      genre: genre.textContent,
      sort_by: 'year',
    };
    fetchMovieData(parameters);
  });
};
// click on genres
(function clickOnGenres() {
  const allGenreBtns = document.querySelectorAll('.genres-btns >li');
  const categoryTitle = document.querySelector('.category-title');
  allGenreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showAnimation();
      categoryTitle.textContent = btn.textContent;
      sanitizeGrid();
      matchGenres();
    });
  });
})();

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
    event.stopPropagation();

    navContainer.classList.add('show');
    burgerBtn.style.display = 'none';
    // getMovieByChance();
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
const createMovieHTML = (movie) => {
  // get movie data
  let title = movie.title_long;
  let titleForSearch = movie.title;
  let movieId = movie.id;
  let coverImg = movie.medium_cover_image;
  let backgroundImage = movie.background_image_original;

  let summary = movie.summary;
  let description = movie.description_full;
  let rating = movie.rating;
  let language = movie.language;
  let year = movie.year;
  let genres = movie.genres.join(', ');
  let torrentHash = movie.torrents[0].hash;
  let slug = movie.slug;

  //create movie data
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
  //set attributes for each movie
  movieElement.setAttribute('data-id', movieId);
  movieElement.setAttribute('data-genres', genres);
  movieElement.setAttribute('data-year', year);
  movieElement.setAttribute('data-language', language);
  movieElement.setAttribute('data-rating', rating);
  movieElement.setAttribute('data-description', description);
  movieElement.setAttribute('data-backgroundImage', backgroundImage);
  movieElement.setAttribute('data-title', titleForSearch);
  movieElement.setAttribute('data-torrentHash', torrentHash);
  movieElement.setAttribute('data-slug', slug);
  clickOnInstrumentCard();
};

// sanitize grid

const sanitizeGrid = () => {
  const movieGrid = document.querySelector('.movie-grid');
  console.log('grid sanitised');
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
      createMovieHTML(movie);
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
// get random movie for chance btn
(function getMovieByChance() {
  const chanceBtn = document.querySelector('.chance-btn');

  chanceBtn.addEventListener('click', () => {
    let pageIndex = Math.floor(Math.random() * 100);

    const parameters = { limit: 1, page: pageIndex };
    sanitizeGrid();
    fetchMovieData(parameters);
    showAnimation();
  });
})();
// click on instrument card
let trigger = false;
const clickOnInstrumentCard = () => {
  const moviePlayerContainer = document.querySelector('.movie-player-container');
  const allMovieElements = document.querySelectorAll('.movie-element');
  const movieGenre = document.querySelector('.genres > span');
  const movieTitle = moviePlayerContainer.querySelector('.movie-title');
  const movieRating = document.querySelector('.imdb-rating > span');
  const movieLanguage = document.querySelector('.language > span');
  const movieYear = document.querySelector('.year > span');
  const movieDescription = moviePlayerContainer.querySelector('.movie-description');

  allMovieElements.forEach((movieElement) => {
    movieElement.addEventListener('click', () => {
      movieGenre.textContent = movieElement.dataset.genres;

      movieTitle.textContent = movieElement.dataset.title;
      movieRating.textContent = movieElement.dataset.rating;
      movieLanguage.textContent = movieElement.dataset.language;
      movieYear.innerText = movieElement.dataset.year;
      movieDescription.textContent = movieElement.dataset.description;
      moviePlayerContainer.style.display = 'flex';

      torrentId = `magnet:?xt=urn:btih:${movieElement.dataset.torrenthash}&dn=${movieElement.dataset.slug}&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969 `;

      clickOnWatchNow();
      exitDescriptionMode();
      prepareForWatching();
      insertVideoSource(torrentId);
    });
  });
};
// insert  video source into players
const insertVideoSource = (torrentId, backgroundImage) => {
  if (trigger === false) {
    const videoPlayerContainer = document.querySelector('.video-player');
    const container = document.querySelector('.player-container');
    const videoJs = document.createElement('script');
    videoJs.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@webtor/player-sdk-js/dist/index.min.js');
    videoJs.setAttribute('async', true);
    videoJs.setAttribute('charset', 'utf-8');
    videoPlayerContainer.appendChild(videoJs);
    const videoPlayer = document.createElement('video');

    videoPlayer.setAttribute('id', 'movie-player');
    videoPlayer.setAttribute('src', torrentId);
    videoPlayer.setAttribute('controls', 'true');
    videoPlayer.setAttribute('poster', backgroundImage);

    container.append(videoPlayer);
    trigger = true;
  }
};
// click on watch btn
const clickOnWatchNow = () => {
  const watchBtn = document.querySelector('.play-btn');
  const movieDescription = document.querySelector('#full-description');
  const container = document.querySelector('.player-container');

  watchBtn.addEventListener('click', () => {
    movieDescription.style.display = 'none';
    watchBtn.style.display = 'none';
    container.style.display = 'flex';
  });
};
// exit movie-description-mode
const exitDescriptionMode = () => {
  const exitButton = document.querySelector('.fa-window-close');
  const movieDescriptionContainer = document.querySelector('.movie-player-container');
  const videoElement = document.querySelector('.player-container');
  exitButton.addEventListener('click', () => {
    movieDescriptionContainer.style.display = 'none';
    videoElement.innerHTML = '';
    trigger = false;
  });
};
//make sure that paragraph and watchBtn are visible and player is not
const prepareForWatching = () => {
  const movieDescription = document.querySelector('#full-description');
  const watchBtn = document.querySelector('.play-btn');
  const videoPlayerContainer = document.querySelector('.player-container');
  movieDescription.style.display = 'block';
  watchBtn.style.display = 'block';
  videoPlayerContainer.style.display = 'none';
};

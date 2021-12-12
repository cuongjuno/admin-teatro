import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';

const initialState = {
  movies: [],
  randomMovie: null,
  latestMovies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  suggested:[]
};

const getMovies = (state, payload) => {
  const { movies, nowShowing, comingSoon } = payload;
  const latestMovies = movies
    .slice(0, 5);

  return {
    ...state,
    movies,
    randomMovie: movies[Math.floor(Math.random() * movies.length)],
    latestMovies,
    nowShowing,
    comingSoon
  };
};

const onSelectMovie = (state, payload) => ({
  ...state,
  selectedMovie: payload
});

const getMovieSuggestions = (state, payload) =>({
  ...state,
  suggested: payload
})

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return getMovies(state, payload);
    case SELECT_MOVIE:
      return onSelectMovie(state, payload);
    case GET_SUGGESTIONS:
      return getMovieSuggestions(state, payload);
    default:
      return state;
  }
};

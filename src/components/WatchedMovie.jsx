// This is a presentational component - it has no state
export default function WatchedMovie({ movie, onRemoveWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          // We need to pass the movie's imdbID to the onRemoveWatched prop function so that we can remove the movie from the watched array in the App component's state.
          // We can do this by passing an anonymous function to the onClick prop of the button element. The reasone we use an anonymous function is because we need to pass an argument to the onRemoveWatched prop function.
          // This function will call the onRemoveWatched prop function with the movie's imdbID as an argument.
          // We can access the movie's imdbID from the movie prop.
          onClick={() => onRemoveWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

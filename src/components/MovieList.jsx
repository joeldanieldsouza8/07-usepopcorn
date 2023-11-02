import Movie from "./Movie";

// This is a stateful component - it has state
export default function MovieList({ movies, onSelectMovie }) {
    // const [movies, setMovies] = useState(tempMovieData); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the NumResults component
  
    return (
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
        ))}
      </ul>
    );
  }
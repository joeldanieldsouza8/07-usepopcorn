import { useState, useEffect } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

function average(arr) {
  return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
}
const KEY = "a8dbbca2";
const tempQuery = "Interstellar";

export default function App() {
  const [movies, setMovies] = useState([]); // This state has been lifted up
  const [watched, setWatched] = useState([]); // This state has been lifted up
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // This state has been lifted up
  const [selectedID, setSelectedID] = useState(null);

  function handleMovieClick(id) {
    // setSelectedID(id);
    setSelectedID((prevID) => (prevID === id ? null : id));
  }

  function handleCloseDetails() {
    setSelectedID(null);
  }

  // We use the useEffect hook to fetch data from the API and update the state with the data we get back from the API call.
  // This prevents an infinite loop because we are only fetching the data once when the component mounts.
  // Here we are able to register the side effect of fetching data from the API and updating the state with the data we get back from the API call.
  // The useEffect hook is run every time the component mounts (or on the initial render) and every time the query state changes/updates.
  useEffect(
    function () {
      const abortController = new AbortController(); // We use the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
      const signal = abortController.signal; // We use the signal property of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak

      async function fetchMovies() {
        try {
          setIsLoading(true); // We use the try block to set the isLoading state to true so that the loader starts spinning when the data is being fetched
          setError(""); // Reset the error state to an empty string so that the error message is cleared when the data is fetched successfully

          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,

            { signal } // Pass the signal to the fetch request for aborting
          );

          // As soon as the error is thrown the rest of the code below is never evaluated
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json(); // We use the await keyword to wait for the response to be converted to JSON before we can use it in the code below

          // As soon as the error is thrown the rest of the code below is never evaluated
          if (data.Response === "False") {
            throw new Error(data.Error); // We use the throw keyword to throw an error if the data.Response is false so that the error message is displayed when the data is fetched unsuccessfully and the error state is set to the error message so that the error message is displayed in the UI
          }

          setMovies(data.Search); // setting state is asynchronous so we need to use the await keyword to wait for the state to be set before we can use it

          console.log(data); // debug
          // setIsLoading(false); // Redundant because we are using the finally block to set the isLoading state to false so that the loader stops spinning when the data is fetched
        } catch (error) {
          // Ignore errors from aborted fetches
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.log(`Error fetching movies: ${error.message}`);
            setError(error.message);
          }
        } finally {
          setIsLoading(false); // We use the finally block to set the isLoading state to false so that the loader stops spinning when the data is fetched
        }
      }

      // We use the if statement to check if the query state is an empty string so that we don't make an API call when the query state is an empty string and we clear the movies state and the error state when the query state is an empty string so that the movies are cleared from the UI and the error message is cleared from the UI when the query state is an empty string
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies(); // We call the fetchMovies function here so that the data is fetched when the component mounts  and the useEffect hook is run for the first time when the component mounts

      // Cleanup: abort the fetch request if the component is unmounted or if the query changes
      return () => {
        abortController.abort(); // We use the abort method of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
      };
    },
    [query] // We use the query state as the second argument to the useEffect hook so that the useEffect hook is run every time the query state changes and the data is fetched every time the query state changes. The q
  );

  return (
    <>
      {/* Here we use 'component composition' to compose the components together. This helps eliminate 'prop drilling' */}
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      {/* We use 'prop drilling' to pass the state to the child component so that it can be used by other child components in the component tree structure.*/}
      <Main>
        {/* <WatchedBox /> */}
        <Box>
          {/* Each of the three conditions below are mutually exclusive. */}
          {/* {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies} />} */}

          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList movies={movies} onSelectMovie={handleMovieClick} />
          )}
        </Box>

        {/* Here we use 'component composition' to compose the components together. This helps eliminate 'prop drilling' */}
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onClose={handleCloseDetails}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedID, onClose }) {
  // We define a new state here because we want to render the movie details in the UI when the movie is clicked and the movie details are fetched from the API.
  // We initialize the state with an empty object because the data we get back from the API is an object.
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Movie: movie,
  } = movieDetails;

  /* 
  When the component is initially 'mounted', then the movie is still this empty object here.
  And so then title and year read from that empty object are simply undefined.
  So then this 'effect' here starts and it gets the movie object from the API and will then store it into our movie 'state'.
  Then the component is 'rerendered'.
  Then of course this object is no longer empty. 
  Then the rendering logic here will read all of this data out of the object.
  Then we successfully log that to the console over here.
*/
  console.log(movieDetails); // debug

  /* 
    What happens if we don't add the dependency array to the useEffect hook?
      When we click here on one of these other movies this component is actually not mount again.
      So the initial render will not happen again because the component is already mounted.
      This is because the movie detail component is rendered in exactly the same place in a component tree.
      So as we click here on another movie another prop will be passed into the component but the component itself will not be destroyed.
      It will stay in the component tree. 
      The only thing that is changing as we click on one of the other movies is the ID prop that is being passed in.
      So the selectedID prop is the only thing that is changing.
      Hence this effect here will not run again because again, it is only running when the component mounts which only happens once.
      Now of course, if I close this and then go to another one then the component has been unmounted first, then it is mounting again.
      Then it is going to work.
      
      So how do we solve this?
      The answer lies again in the dependency array. 
      Now, if we now pass in the selectedID, which is the prop that changes, in the dependency array, then the effect will run again as soon as the selectedID prop changes.
      Because remember, this dependency array is a little bit like an event listener that is listening for one of the dependencies to change.
      And so now as we click on another movie this prop here will change.
  */

  // We use the useEffect hook to fetch data from the API and update the state with the data we get back from the API call each time the selectedID state changes (or the component mounts/renders).
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true); // We use the try block to set the isLoading state to true so that the loader starts spinning when the data is being fetched

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        // As soon as the error is thrown the rest of the code below is never evaluated
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // We use the await keyword to wait for the response to be converted to JSON before we can use it in the code below

        // As soon as the error is thrown the rest of the code below is never evaluated
        if (data.Response === "False") {
          throw new Error(data.Error); // We use the throw keyword to throw an error if the data.Response is false so that the error message is displayed when the data is fetched unsuccessfully and the error state is set to the error message so that the error message is displayed in the UI
        }

        setMovieDetails(data); // setting state is asynchronous so we need to use the await keyword to wait for the state to be set before we can use it

        console.log(data); // debug
      } catch (error) {
        console.log(`Error fetching movie details: ${error.message}`);
      } finally {
        setIsLoading(false); // We use the finally block to set the isLoading state to false so that the loader stops spinning when the data is fetched
      }
    }

    fetchMovieDetails();
  }, [selectedID]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            {/* We could pass an anonymous function here to the onClick prop of the button element but we don't need to because we are not passing any arguments to the onClose prop function. */}
            {/* <button className="btn-back" onClick={() => onClose()}></button>  */}
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* {selectedID} */}

          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// This is a presentational component - it has no state
function Loader() {
  return <div className="loader"></div>;
}

// This is a presentational component - it has no state
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span> {message}
    </p>
  );
}

// This is a structural component
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// This is a presentational component - it has no state
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// This is a presentational component - it has no state
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// This is a stateful component - it has state
function Search({ query, setQuery }) {
  // const [query, setQuery] = useState(""); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the MovieList component

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// This is a stateful component - it has state
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {/* Here we don't need to pass the children prop as an object because we are conditionally rendering it. */}
      {isOpen && children}
    </div>
  );
}

// This is a stateful component - it has state
function MovieList({ movies, onSelectMovie }) {
  // const [movies, setMovies] = useState(tempMovieData); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the NumResults component

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// This is a presentational component - it has no state
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      {" "}
      {/* We create an anonymous function here so that we can pass the movie.imdbID as an argument to the onSelectMovie prop function. This is because we want to pass the movie.imdbID as an argument to the onSelectMovie prop function when the movie is clicked. */}
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓️</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// This is a presentational component - it has no state
function WatchedSummary({ watched }) {
  // Derived states
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// This is a presentational component - it has no state
function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

// This is a presentational component - it has no state
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  );
}

// This is a stateful component - it has state
/*
function WatchedBox() {
  // Define states
  const [watched, setWatched] = useState(tempWatchedData); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the WatchedSummary and WatchedMovieList components
  const [isOpen2, setIsOpen2] = useState(true); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the WatchedSummary and WatchedMovieList components

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

// This is a structural component
function Main({ children }) {
  return <main className="main">{children}</main>;
}

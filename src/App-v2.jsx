import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Main from "./components/Main";
import MovieDetails from "./components/MovieDetails";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import NumResults from "./components/NumResults";
import Search from "./components/Search";
import Box from "./components/Box";
import WatchedSummary from "./components/WatchedSummary";
import MovieList from "./components/MovieList";
import WatchedMovieList from "./components/WatchedMovieList";

/*
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
*/

const KEY = "a8dbbca2";
// const tempQuery = "Interstellar";

export default function App() {
  // Lifted up states
  const [movies, setMovies] = useState([]); // Here we can use the state in the MovieList component and the MovieDetails component
  const [watched, setWatched] = useState([]); // Here we can use the state in the WatchedSummary component and the WatchedMovieList component
  const [query, setQuery] = useState(""); // Here we can use the state in the Search component and the NumResults component

  // Local states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  // This function accepts an id as an argument and sets the selectedID state to the id argument.
  // We use the setSelectedID function to update the selectedID state with the id argument.
  // We use the ternary operator to toggle the selectedID state between null and the id argument.
  function handleMovieClick(id) {
    // setSelectedID(id);
    setSelectedID((prevID) => (prevID === id ? null : id));
  }

  // The function accepts no arguments and sets the selectedID state to null.
  function handleCloseDetails() {
    setSelectedID(null);
  }

  // This function accepts an object as an argument and adds the object to the watched state array.
  // We use the spread operator to spread the previous watched state array and add the new movie object to the end of the array.
  // We use the setWatched function to update the watched state with the new watched state array.
  function handleAddToWatched(movie) {
    setWatched((prevWatched) => [...prevWatched, movie]);
  }

  // This function accepts an object as an argument and removes the object from the watched state array.
  // We use the filter method to filter out the movie object from the watched state array.
  // We use the setWatched function to update the watched state with the new watched state array.
  function handleRemoveFromWatched(id) {
    setWatched((prevWatched) =>
      prevWatched.filter((movie) => movie.imdbID !== id)
    );
  }

  /*
  Here we are only fetching data as a result of searching here for movies in the search bar.
    So basically only as a response to this event.
    Therefore, we could now actually transform this useEffect that we have here into a regular event handler function.
    Because remember, that is actually the preferred way of handling events in React.
  */

  // Define a function that handles fetching movies and updating state
  async function handleFetchMovies() {
    const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`; // We use the query state as the search query in the API call
    const abortController = new AbortController(); // We use the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
    const signal = abortController.signal; // We use the signal property of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak

    async function fetchMovies() {
      try {
        setIsLoading(true); // We use the try block to set the isLoading state to true so that the loader starts spinning when the data is being fetched
        setError(""); // Reset the error state to an empty string so that the error message is cleared when the data is fetched successfully

        const response = await fetch(
          url,
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

        setError(""); // Reset the error state to an empty string so that the error message is cleared when the data is fetched successfully
      } catch (error) {
        // Ignore errors from aborted fetches
        if (error.name !== "AbortError") {
          setError(error.message); // We use the catch block to set the error state to the error message so that the error message is displayed in the UI when the data is fetched unsuccessfully
          console.log(error.message); // debug
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

    handleCloseDetails(); // We call the handleCloseDetails function here so that the movie details are closed when the query changes and the useEffect hook is run for the first time when the component mounts
    fetchMovies(); // We call the fetchMovies function here so that the data is fetched when the component mounts  and the useEffect hook is run for the first time when the component mounts

    // Cleanup: abort the fetch request if the component is unmounted or if the query changes
    return () => {
      abortController.abort(); // We use the abort method of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
    };
  }

  /*
    We use the useEffect hook to fetch data from the API and update the state with the data we get back from the API call.
    This prevents an infinite loop because we are only fetching the data once when the component mounts.
    Here we are able to register the side effect of fetching data from the API and updating the state with the data we get back from the API call.
    The useEffect hook is run every time the component mounts (or on the initial render) and every time the query state changes/updates.
  */
  /*
  useEffect(
    function () {
      const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`; // We use the query state as the search query in the API call
      const abortController = new AbortController(); // We use the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
      const signal = abortController.signal; // We use the signal property of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak

      async function fetchMovies() {
        try {
          setIsLoading(true); // We use the try block to set the isLoading state to true so that the loader starts spinning when the data is being fetched
          setError(""); // Reset the error state to an empty string so that the error message is cleared when the data is fetched successfully

          const response = await fetch(
            url,
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

          setError(""); // Reset the error state to an empty string so that the error message is cleared when the data is fetched successfully
        } catch (error) {
          // Ignore errors from aborted fetches
          if (error.name !== "AbortError") {
            setError(error.message); // We use the catch block to set the error state to the error message so that the error message is displayed in the UI when the data is fetched unsuccessfully
            console.log(error.message); // debug
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

      handleCloseDetails(); // We call the handleCloseDetails function here so that the movie details are closed when the query changes and the useEffect hook is run for the first time when the component mounts
      fetchMovies(); // We call the fetchMovies function here so that the data is fetched when the component mounts  and the useEffect hook is run for the first time when the component mounts

      // Cleanup: abort the fetch request if the component is unmounted or if the query changes
      return () => {
        abortController.abort(); // We use the abort method of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
      };
    },
    [query] // We use the query state as the second argument to the useEffect hook so that the useEffect hook is run every time the query state changes and the data is fetched every time the query state changes. The q
  );
  */

  return (
    <>
      {/* Here we use 'component composition' to compose the components together. This helps eliminate 'prop drilling' */}
      <NavBar>
        <Search query={query} setQuery={setQuery} onFetchMovies={handleFetchMovies} />
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
              onCloseMovie={handleCloseDetails}
              onAddWatched={handleAddToWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatched={handleRemoveFromWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
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

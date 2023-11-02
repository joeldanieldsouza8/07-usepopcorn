import { useEffect, useState } from "react";
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

const KEY = "a8dbbca2";

export default function App() {
  // Lifted up states
  const [movies, setMovies] = useState([]); // Here we can use the state in the MovieList component and the MovieDetails component
  const [query, setQuery] = useState(""); // Here we can use the state in the Search component and the NumResults component
  // const [watched, setWatched] = useState([]); // Here we can use the state in the WatchedSummary component and the WatchedMovieList component
  const [watched, setWatched] = useState(() => {
    // We use the useState hook to initialize the watched state with the watched state array stored in the local storage
    const saved = localStorage.getItem("watched"); // We use the getItem method of the local storage API to get the watched state array stored in the local storage
    const initialValue = JSON.parse(saved); // We use the JSON.parse method to convert the watched state array stored in the local storage to an array of objects before we can use it in the code below

    // We use the if statement to check if the watched state array stored in the local storage is empty or not so that we can return an empty array 
    // if the watched state array stored in the local storage is empty so that we can initialize the watched state with an empty array when the 
    // component mounts for the first time
    if (initialValue) {
      return initialValue;
    } else {
      return [];
    }
  }); // Here we can use the state in the WatchedSummary component and the WatchedMovieList component


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

    // Add to local storage
    // We have to create a copy of the watched state array and add the new movie object to the end of the array before we can store it in the local storage because we can't store an array of objects in the local storage directly because the local storage can only store strings.
    // Additionally, when the component mounts for the first time, we have to check if the watched state array is empty or not before we can store it in the local storage because we can't store an empty array in the local storage directly because the local storage can only store strings.
    // localStorage.setItem("watched", JSON.stringify([...watched, movie])); // We use the JSON.stringify method to convert the watched state array to a string before we can store it in the local storage
  }

  // This function accepts an object as an argument and removes the object from the watched state array.
  // We use the filter method to filter out the movie object from the watched state array.
  // We use the setWatched function to update the watched state with the new watched state array.
  function handleRemoveFromWatched(id) {
    setWatched((prevWatched) =>
      prevWatched.filter((movie) => movie.imdbID !== id)
    );
  }

  // We use the useEffect hook to store the watched state array in the local storage when the watched state array changes and the useEffect hook is run for the first time when the component mounts
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched)); // We use the JSON.stringify method to convert the watched state array to a string before we can store it in the local storage
  }, [watched]);

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

  return (
    <>
      {/* Here we use 'component composition' to compose the components together. This helps eliminate 'prop drilling' */}
      <NavBar>
        <Search
          query={query}
          setQuery={setQuery}
          onFetchMovies={handleFetchMovies}
          setSelectedID={setSelectedID}
        />
        <NumResults movies={movies} />
      </NavBar>
      {/* We use 'prop drilling' to pass the state to the child component so that it can be used by other child components in the component tree structure.*/}
      <Main>
        {/* <WatchedBox /> */}
        <Box>
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

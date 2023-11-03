import { useState } from "react";

const KEY = "a8dbbca2"; // API key

export function useMovies(query, callback) {
  // States extracted from the App component
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`; // We use the query state as the search query in the API call

  async function handleFetchMovies() {
    const abortController = new AbortController(); // We use the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
    const signal = abortController.signal; // We use the signal property of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak

    callback?.(); // We use the optional chaining operator to check if the callback function exists before calling it.

    // If query is empty, clear movies and errors
    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

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

    /*
    // We use the if statement to check if the query state is an empty string so that we don't make an API call when the query state is an empty string and we clear the movies state and the error state when the query state is an empty string so that the movies are cleared from the UI and the error message is cleared from the UI when the query state is an empty string
    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }
    */

    // handleCloseDetails(); // We call the handleCloseDetails function here so that the movie details are closed when the query changes and the useEffect hook is run for the first time when the component mounts

    // Cleanup: abort the fetch request if the component is unmounted or if the query changes
    return function () {
      abortController.abort(); // We use the abort method of the AbortController API to abort the fetch request when the component unmounts so that we don't get a memory leak
    };
  }

  return { movies, isLoading, error, handleFetchMovies };
}

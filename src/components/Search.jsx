import { useEffect, useRef } from "react";

// This is a stateful component - it has state
export default function Search({
  query,
  setQuery,
  onFetchMovies,
  setSelectedID,
}) {
  // const [query, setQuery] = useState(""); // We need to lift up the state to the closest parent component, which in this case is the App component, so that we can use the state in the MovieList component
  const inputEl = useRef(null); // This is the React way of doing things

  function handleFormSubmit(e) {
    e.preventDefault();
    onFetchMovies(); // Call the function to fetch movies when the form is submitted
  }

  // This is NOT the React way of doing things
  /*
  useEffect(() => {
    const el = document.querySelector(".search");
    console.log(el);
    el.focus();
  }, [query]); // This useEffect hook will run when the query state changes
  */

  // This is the React way of doing things
  /*
    Why do we need to use a use effect hook here after all?
      We need to use an effect in order to use a ref that contains a DOM element like the 'input' element in the JSX.
      Because the ref only gets added to this DOM element here after the DOM has already loaded.
      Hence, we can only access it in a useEffect hook, which also runs after the DOM has been loaded.
      So this is the perfect place for using a ref that contains a DOM element.
  */
  useEffect(() => {
    function callback(event) {
      if (document.activeElement === inputEl.current) return; // This is to prevent the callback function from running when the user is typing in the search input field (i.e. when the search input field is in focus)

      if (event.key === "Enter") {
        console.log(inputEl.current); // debug
        inputEl.current.focus();

        setQuery(""); // Clear the search query when the user presses the Enter key
        setSelectedID(null); // Clear the selected movie ID when the user presses the Enter key
      }
    }

    document.addEventListener("keydown", callback);

    // Clean up function
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [setQuery, setSelectedID]); // This useEffect hook will run only once when the component is mounted

  return (
    <form onSubmit={handleFormSubmit} className="search-form">
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />

      <button type="submit" className="btn-search">
        Search
      </button>
    </form>
  );
}

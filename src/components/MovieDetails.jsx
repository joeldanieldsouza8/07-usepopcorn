import { useState, useEffect, useRef} from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../hooks/useKey";

const KEY = "a8dbbca2";

// This is a stateful component - it has state
export default function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  // We define a new state here because we want to render the movie details in the UI when the movie is clicked and the movie details are fetched from the API.
  const [movieDetails, setMovieDetails] = useState({}); // We initialize the state with an empty object because the movie details are an object.

  // We define a new state here because we want to render the loader in the UI when the data is being fetched from the API.
  const [isLoading, setIsLoading] = useState(false); // We initialize the state with a boolean value because the loader is either spinning or not spinning.

  // We define a new state here because we want to render the user rating in the UI when the user clicks on a star.
  const [userRating, setUserRating] = useState(""); // We initialize the state with an empty string because the user rating is a string.

  // We use derived state here because we want to check if the movie is already in the watched list so that we can conditionally render the button element in the UI.
  const isWatched = watched.some((movie) => movie.imdbID === selectedID);

  // We use derived state here because we want to check if the movie is already in the watched list so that we can conditionally render the button element in the UI.
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  // More efficient way to write the two derived states above:
  /* 
    let isWatched = false;
    let watchedUserRating = 0;
    
    watched.forEach(movie => {
    if (movie.imdbID === selectedId) {
        isWatched = true;
        watchedUserRating = movie.userRating;
    }
    });
  */

  // Why do we need to use a ref here after all?
  /*
    We use the useRef hook here because we want to access the current value of the countRef.current property. 
    We use the countRef.current property to count the number of times the user clicks on a star. 
    We use the countRef.current property to count the number of times the user clicks on a star because we want to know how many times the user clicks on a star before they click on the Add to watched button. 
    we don't want to render that information onto the user interface.
    In other words, we do not want to create a 're-render'.
    So that's why a ref is perfect for this.
    Each time the user rating was updated, the component was re-rendered.
    Then after that re-render, the 'useEffect' was executed which means that after the rating had been updated, then our ref would be updated as well.
  */
  const countRef = useRef(0);

  // We use the useEffect hook to log the countRef.current value to the console each time the component is mounted or rerendered.
  useEffect(() => {
    if (userRating) {
      countRef.current = countRef.current + 1;
      // console.log(countRef.current); // debug
    }
  }, [userRating]);

  // We use object destructuring to destructure the movieDetails object into individual variables so that we can use them in the JSX below.
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
    Year: year,
  } = movieDetails;

  // NEVER DO THIS!

  /*
  if(imdbRating > 8) {
    const [isTop, setIsTop] = useState(true);
  }

  if(imdbRating > 8) {
    <p>Greatest Movie Ever!</p>
  }
  */

  /*
    Whatever we pass into 'useState' is the initial state.
    And React will only look at this initial state on the initial render.
    So when the component first mounts.
    However, when the component first mounts here the IMDB rating will still be 'undefined'.
    And so this year is then false, it will stay false forever because nowhere we update the state. 
    On the second render, when we then finally get the movie data, this will not be executed again.
    Therefore, again, it will stay false forever.
  */

  /*
    const [isTop, setIsTop] = useState(imdbRating > 8);
    console.log(isTop); // debug
    useEffect(() => {
      setIsTop(imdbRating > 8);
    }, [imdbRating]); // debug
  */

  /*
    Now, one way of fixing this would be to use a 'useEffect'.
    Then if we wanted to run this effect each time that the IMDB rating updates, we want to call setIsTop
    And then we can do imdbRating greater than eight.
    And so in this case, this should then work and isTop is 'true'.
    
    Now of course, in this situation we shouldn't even use a piece of state in the first place.
    If this was the functionality that we really wanted then what we should do is derived state.
    We shouldn't create a real state with the useState hook but instead we should just do 'const isTop'
    Then simply 'imdbRating greater than eight'.
    If we then log that again to the console you see that this simple code works seamlessly.
    This is because 'imdbRating' variable regenerated each time that the function here is executed (in other words after each render).
  */

  /*
  // Derived state
  const isTop = imdbRating > 8;
  console.log(isTop); // debug
  */

  function handleAddToWatched() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
      countRatingDescisions: countRef.current, // We use the useRef hook to access the current value of the countRef.current property
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  /* 
    When the component is initially 'mounted', then the movie is still this empty object here.
    And so then title and year read from that empty object are simply undefined.
    So then this 'effect' here starts and it gets the movie object from the API and will then store it into our movie 'state'.
    Then the component is 'rerendered'.
    Then of course this object is no longer empty. 
    Then the rendering logic here will read all of this data out of the object.
    Then we successfully log that to the console over here.
  */
  // console.log(movieDetails); // debug

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

  /* 
    When the component is initially 'mounted', then the movie is still this empty object here.
    And so then title and year read from that empty object are simply 'undefined'.
    Only after the movie details are fetched from the API and the state is updated with the data from the API call, then the component is 'rerendered' and the title and year are read from the movieDetails object.
    When we add the dependency array to the useEffect hook, then the component is 'rerendered' when the selectedID state changes and the title and year are read from the movieDetails object. 
  */
  useEffect(() => {
    // Guard clause to prevent 'undefined' from being displayed in the document title when the component is initially 'mounted' and the movie is still this empty object here.
    if (!title) return;

    document.title = `${title} (${year})`;

    // Cleanup function to reset the document title to its original value when the component is 'unmounted'.
    return () => {
      document.title = "usePopcorn";

      /* 
        How are the values of the title and year variables read from the movieDetails object when the component is 'unmounted'?

          The values of the title and year variables are the values that were read from the movieDetails object when the component was 'mounted'.
          The values of the title and year variables are not the values that were read from the movieDetails object when the component was 'rerendered'.
          This is because the cleanup function is called when the component is 'unmounted' and not when the component is 'rerendered'.
          The cleanup function is called when the component is 'unmounted' because the dependency array is empty.
          The dependency array is empty because we don't want the cleanup function to be called when the component is 'rerendered'.
          We only want the cleanup function to be called when the component is 'unmounted'.

          This is also because of the closure.
          The cleanup function is a closure.
          The cleanup function closes over the title and year variables.
          The cleanup function closes over the title and year variables when the component is 'mounted' and not when the component is 'rerendered'.
      */
      console.log(`Clean up effect for movie ${title} (${year})`); // debug
    };
  }, [title, year]); // We add the title and year to the dependency array so that the document title is updated when the title and year are read from the movieDetails object.

  /* 
    What happens if we don't add a cleanup function to the useEffect hook?
      The event listeners are not removed from the document when the component is 'unmounted'.
      This means that the event listeners continue accumulating.
      This is because each time that a new MovieDetails component mounts, a new event listener is added to the document.
      So basically always an additional one to the ones that we already have.
      To summarize, each time that this effect here is executed, it'll basically add one more event listener to the document.
      And so if we open up 10 movies and then close them all, we will end up with 10 of the same event listeners attached to the document, which is not what we want.
      So this means that we need to clean up our event listeners.
  */
  // This function has been moved to the useKey hook
  /*
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseMovie();
        console.log("Escape key pressed"); // debug
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener from the document as soon as the MovieDetails component is 'unmounted' or 'rerendered'.
    // This avoids the memory leak that might otherwise occur with many event listeners in larger apps.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      console.log("Clean up effect for event listener"); // debug
    };
  }, [onCloseMovie]); // We add the onCloseMovie function to the dependency array so that the event listener is removed from the document when the component is 'unmounted'.
  */

  useKey("Escape", onCloseMovie);

  let starRatingComponent = null;
  if (!isWatched) {
    starRatingComponent = (
      <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
    );
  } else {
    starRatingComponent = (
      <p>
        You rated this movie {watchedUserRating} <span>⭐</span>
      </p>
    );
  }

  let addToWatchedButton = null;
  if (userRating > 0) {
    addToWatchedButton = (
      <button className="btn-add" onClick={handleAddToWatched}>
        + Add to watched
      </button>
    );
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            {/* We could pass an anonymous function here to the onClick prop of the button element but we don't need to because we are not passing any arguments to the onCloseMovie prop function. */}
            {/* <button className="btn-back" onClick={() => onCloseMovie()}></button>  */}
            <button className="btn-back" onClick={onCloseMovie}>
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
              {starRatingComponent}
              {addToWatchedButton}
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

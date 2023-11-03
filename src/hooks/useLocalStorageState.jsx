import { useState, useEffect } from "react";

/* 
    How does this hook work?
    1. We use the useState hook to initialize the state (in this case the state is 'watched') with the 'watched' state array stored in the local storage
    2. We use the useEffect hook to store the 'watched' state array in the local storage when the 'watched' state array changes and the useEffect hook is run for the first time when the component 'mounts'
    3. We return these values as an array so that this hook "useLocalStorageState" can be used as a state.

    For example, 
    If there was no watched state array stored in the local storage, the watched state array would be initialized with an empty array when the component mounts for the first time.
    If there was a watched state array stored in the local storage, the watched state array would be initialized with the watched state array stored in the local storage when the component mounts for the first time.
    If the watched state array changes, the watched state array would be stored in the local storage when the watched state array changes.
    If the key variable changes, the watched state array would be stored in the local storage when the key variable changes.
*/

export function useLocalStorageState(initialState, key) {
  // Here we give the variables a generic name so that we can use the hook in different components
  const [value, setValue] = useState(function () {
    // We use the useState hook to initialize the watched state with the watched state array stored in the local storage
    const storedValue = localStorage.getItem(key); // We use the getItem method of the local storage API to get the watched state array stored in the local storage
    // console.log(storedValue); // debug
    const initialValue = JSON.parse(storedValue); // We use the JSON.parse method to convert the watched state array stored in the local storage to an array of objects before we can use it in the code below

    // We use the if statement to check if the watched state array stored in the local storage is empty or not so that we can return an empty array
    // if the watched state array stored in the local storage is empty so that we can initialize the watched state with an empty array when the
    // component mounts for the first time
    if (initialValue) {
      return initialValue;
    } else {
      return initialState;
    }
  }); // Here we can use the state in the WatchedSummary component and the WatchedMovieList component

  // We use the useEffect hook to store the watched state array in the local storage when the watched state array changes and the useEffect hook is run for the first time when the component 'mounts'
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)); // We use the JSON.stringify method to convert the watched state array to a string before we can store it in the local storage
  }, [value, key]); // Here we can use the state in the WatchedSummary component and the WatchedMovieList component. We pass the key variable to the dependency array so that the useEffect hook is run when the key variable changes (in other words the useEffect depends on the key variable)

  // We return these values as an array so that this hook "useLocalStorageState" can be used as a state.
  return [value, setValue];
}

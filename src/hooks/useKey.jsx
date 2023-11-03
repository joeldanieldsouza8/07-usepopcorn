import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(
    () => {
      function handleKeyDown(event) {
        if (event.key.toLowerCase() === key.toLowerCase()) {
          // onCloseMovie();
          callback?.(); // As we don't want to call onCloseMovie() directly, we use the optional chaining operator to call it only if it exists.
          console.log("Key pressed: " + event.key); // debug
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup function to remove the event listener from the document as soon as the MovieDetails component is 'unmounted' or 'rerendered'.
      // This avoids the memory leak that might otherwise occur with many event listeners in larger apps.
      return function() {
        document.removeEventListener("keydown", handleKeyDown);
        // console.log("Clean up effect for event listener"); // debug
      };
    },
    //   [onCloseMovie]); // We add the onCloseMovie function to the dependency array so that the event listener is removed from the document when the component is 'unmounted'.
    [key, callback] // We include these two variables into the dependency array as these variables are used inside the effect function.
  );
}

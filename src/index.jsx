import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
// import StarRating from "./StarRating";
// import { useState } from "react";

// function Test() {
//   const [rating, setRating] = useState(0);

//   return (
//     <div>
//       <StarRating onSetRating={setRating} />
//       <p>This movie has a rating of {rating} stars.</p>
//     </div>
//   )
// }

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     {/* <App /> */}
//     <StarRating
//       maxRating={5}
//       messages={["Terrible", "Meh", "OK", "Good", "Great", "Amazing"]}
//       defaultRating={3}
//     />
//     <Test />
//   </React.StrictMode>
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

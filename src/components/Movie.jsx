// This is a presentational component - it has no state
export default function Movie({ movie, onSelectMovie }) {
  const { Poster, Title, Year, imdbID } = movie;

  const posterAlt = Poster === "N/A" ? "🚫" : `${Title} poster`;

  return (
    <li onClick={() => onSelectMovie(imdbID)}>
      <img src={Poster} alt={posterAlt} />
      <h3>{Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{Year}</span>
        </p>
      </div>
    </li>
  );
}

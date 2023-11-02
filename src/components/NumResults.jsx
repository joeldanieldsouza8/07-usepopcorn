// This is a presentational component - it has no state
export default function NumResults({ movies }) {
    return (
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    );
  }
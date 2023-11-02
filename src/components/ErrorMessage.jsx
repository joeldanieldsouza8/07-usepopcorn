// This is a presentational component - it has no state
export default function ErrorMessage({ message }) {
    return (
      <p className="error">
        <span>⚠️</span> {message}
      </p>
    );
  }
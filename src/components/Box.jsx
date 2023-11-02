import {useState} from "react";

// This is a stateful component - it has state
export default function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);
  
    return (
      <div className="box">
        <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? "–" : "+"}
        </button>
  
        {/* Here we don't need to pass the children prop as an object because we are conditionally rendering it. */}
        {isOpen ? children : null}
      </div>
    );
  }
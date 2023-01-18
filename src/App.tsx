import { useState } from "react";
import atmLogo from "./assets/atm-logo.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <img src={atmLogo} alt="React logo" />
      </div>
      <h1>ATM Card House</h1>
      <h2>Em breve!</h2>
    </div>
  );
}

export default App;

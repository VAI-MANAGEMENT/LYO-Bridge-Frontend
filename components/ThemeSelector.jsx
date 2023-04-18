import React, { useContext } from "react";
import  {ThemeContext} from "../context/theme";



function ThemeSelector() {
    const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <section className="theme-selector">
      {/* <div>
        The current theme is: {theme}
        <button onClick={() => setTheme("light")}>Light Mode</button>
        <button onClick={() => setTheme("dark")}>Dark Mode</button>
      </div> */}

      <div className="dark-version">
        <label className="switch">
          <input type="checkbox" onChange={() => toggleTheme()} id="slider" />
          <span className="slider round"></span>
        </label>
      </div>
    </section>
  );
}

export default ThemeSelector;

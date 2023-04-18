import React, { useEffect, createContext, useState } from "react";


// import globalStyles from '../assets/main.css';
// import lightStyles from '../assets/lightStyles.css';

const ThemeContext = createContext();


// const getTheme = () => {
//   if (typeof window !== "undefined") {
//     const theme = localStorage.getItem("theme");
//     // Default theme is taken as dark-theme
//     if (!theme) {
//       localStorage.setItem("theme", "dark-theme");
//       return "dark-theme";
//     } else {
//       return theme;
//     }
//   }
// };

const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(null);


  function toggleTheme() {
    if (theme === "dark-theme") {
      setTheme("light-theme");
    } else {
      setTheme("dark-theme");
    }
  }

  useEffect(() => {
    let tmp_theme = window.localStorage.getItem("theme")
    if(tmp_theme) {
      setTheme(tmp_theme)
    }else{
      setTheme("dark-theme")
      localStorage.setItem("theme", "dark-theme");
    }
  }, [])

  useEffect(() => {
    const refreshTheme = () => {
      localStorage.setItem("theme", theme);
    };
    refreshTheme();
  }, [theme]);

  // useEffect(() => {
  //   window.localStorage.setItem('_launchpadItem', _launchpadItem)
  // }, [_launchpadItem])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
       
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

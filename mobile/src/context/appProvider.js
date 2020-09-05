import React, {createContext, useState} from 'react';

const AppContext = createContext();

function AppProvider({children}) {
  const [state, setState] = useState({
    favorites: [],
  });

  return (
    <AppContext.Provider
      value={{
        favorites: state.favorites,
        addFavorite: (lock) => {
          if (!state.favorites.some((favorite) => favorite.id === lock.id)) {
            setState({
              ...state,
              favorites: [...state.favorites, lock],
            });
          }
        },
        setFavorites: (favorites) => {
          setState({...state, favorites});
        },
      }}>
      {children}
    </AppContext.Provider>
  );
}

export {AppProvider, AppContext};

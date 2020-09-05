import React, {createContext, useState} from 'react';

const AppContext = createContext(undefined);
const AppDispatchContext = createContext(undefined);

function AppProvider({children}) {
  const [state, setState] = useState({});

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={setState}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export {AppProvider, AppContext, AppDispatchContext};

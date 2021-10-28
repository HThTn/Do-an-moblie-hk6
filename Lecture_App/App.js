import React, {useState} from 'react';
import Login from './src/screens/Login';
import MainTabScreen from './src/navigation/main';
import {TokenProvider} from './src/Context/TokenContext';
// import TokenContextProvider from './src/Context/LogoutContext';
import {NavigationContainer} from '@react-navigation/native';
import {SetTokenProvider} from './src/Context/SetTokenContext';
const App = () => {
  const [token, setToken] = useState('');

  if (!token) return <Login token={token} setToken={setToken} />;
  return (
    <TokenProvider value={token}>
      <SetTokenProvider value={setToken}>
        <NavigationContainer>
          <MainTabScreen setToken={setToken} />
        </NavigationContainer>
      </SetTokenProvider>
    </TokenProvider>
  );
};

export default App;

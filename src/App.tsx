import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import GameWrapper from './components/game/GameWrapper';
import Signin from './components/auth/Login'
import Signup from './components/auth/SignUp'
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import NavigationBar from './components/navigation/NavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { FullState } from './redux/state';
import { useEffect } from 'react';
import { resetActionCreator } from './redux/actions/game/gameAction';
import GameReplayWrapper from './components/profile/GameReplayWrapper';


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#168c4b',
      contrastText: 'white'
    },
  }
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetActionCreator());
  }, []);

  const logged = useSelector<FullState, boolean>(state => state.auth.logged);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/game" render={() => logged ? (
              <NavigationBar><GameWrapper/></NavigationBar>
            ) : (
              <Redirect to="/login"/>
            )}/>
            <Route exact path="/game/:gameId" render={() => logged ? (
              <NavigationBar><GameReplayWrapper/></NavigationBar>
            ) : (
              <Redirect to="/login"/>
            )}/>
            <Route path="/profile" render={() => logged ? (
              <NavigationBar><Profile/></NavigationBar>
            ) : (
              <Redirect to="/login"/>
            )}/>
            <Route path="/login" render={() => !logged ? (
              <NavigationBar><Signin/></NavigationBar>
            ) : (
              <Redirect to="/"/>
            )}/>
            <Route path="/signup" render={() => !logged ? (
              <NavigationBar><Signup/></NavigationBar>
            ) : (
              <Redirect to="/"/>
            )}/>
            <Route path="*" render={() => <h3>No page</h3>}/>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;

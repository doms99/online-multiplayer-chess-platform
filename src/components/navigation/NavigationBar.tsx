import { Button, Paper } from '@material-ui/core';
import { SportsEsports as PlayIcon, Person as PersonIcon, Home as HomeIcon } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logoutActionCreator } from '../../redux/actions/auth/authAction';
import { resetActionCreator } from '../../redux/actions/game/gameAction';
import { AuthState, FullState } from '../../redux/state';
import './Navigation.css';

const NavigationBar: React.FC = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector<FullState, AuthState>(state => state.auth);

  console.log(location.pathname);

  return (  
    <div className="navigation-wrapper">
      <Paper className="menu">
        <div className="menu-box">
        <Button color="inherit" aria-label="play" onClick={() => history.push('/')}>
          <HomeIcon />
        </Button>
        {auth.logged && (
          <>
            <Button color="inherit" onClick={() => history.push('/game')}>
              <PlayIcon />
            </Button>
            <Button color="inherit" onClick={() => history.push('/profile')}>
              <PersonIcon />
            </Button>
          </>
        )}
        </div>
        {!auth.logged ? (
          <div className="menu-box">
            <Button onClick={() => history.push('/login')}>Login</Button>
            <Button onClick={() => history.push('/signup')}>Signup</Button>
          </div>
        ) : (
          <div className="menu-box">
            <Button onClick={() => {
              dispatch(logoutActionCreator());
              dispatch(resetActionCreator());
              history.push('/login');
              }}>Logout</Button>
          </div>
        )}
      </Paper>
      <div className="content">
        {children}
      </div>
    </div>

  );
};

export default NavigationBar;
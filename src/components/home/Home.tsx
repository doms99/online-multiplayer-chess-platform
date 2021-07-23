import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FullState } from '../../redux/state';
import './Home.css';

const Home = () => {
  const history = useHistory();
  const logged = useSelector<FullState, boolean>(state => state.auth.logged);

  return (
    <div className="pattern-backdrop">
      <Card style={{padding: '1em'}}>
        <CardContent>
          <Typography variant="h2">{logged ? "Welcome back." : "Welcome!"}</Typography>
          <Typography variant="body1">{logged ? "Let's get you playing!" : "Let's get you started"}</Typography>
        </CardContent>
        <CardActions style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
          {logged ? (
            <>
              <Button fullWidth variant="contained" color="primary" onClick={() => history.push('/game')}>Play</Button>
              <Button fullWidth onClick={() => history.push('/profile')}>Profile</Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="contained" color="primary" onClick={() => history.push('/login')}>Login</Button>
              <Button fullWidth onClick={() => history.push('/signup')}>Signup</Button>
            </>
          )}
        </CardActions>
      </Card>
    </div>
    // <Container maxWidth="md" style={{padding: '16px 0'}}>
    //   <Button variant="contained" color="primary" onClick={() => history.push('/game')}>Play</Button>
    //   <Button onClick={() => history.push('/profile')}>Profile</Button>
    // </Container>
  );
};

export default Home;
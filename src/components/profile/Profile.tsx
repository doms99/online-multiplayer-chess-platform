import { Avatar, Typography, Card, CardContent, Container, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { backendURL } from '../../constants';
import { AuthState, FullState } from '../../redux/state';
import { useGet } from '../game/hooks/useFetch';
import GameHistory, { Game } from './GameHistory';
import './Profile.css'
import ScorePanel from './ScorePanel';

const Profile = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { username, firstName, lastName, email, score, joined } = useSelector<FullState, AuthState>(state => state.auth);
  const fetch = useGet(backendURL+'/profile');

  useEffect(() => {
    fetch().then((res: Game[]) => {
      setGames(res.map((game => ({...game, start: new Date(game.start)}))).sort((a, b) => b.start.getTime() - a.start.getTime()));
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, []);

  const wins = games.filter(game => game.winner === username).length;
  const draws = games.filter(game => game.status === 'draw').length;
  const losses = games.length - wins - draws;

  return (
    <Container className="padding-16" maxWidth="md">
      <Grid container spacing={1}>
        <Grid item sm={4} xs={6}>
          <Card style={{height: '100%'}}>
            <CardContent style={{height: '100%'}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Avatar alt={firstName}/>
                <div style={{marginLeft: '1em'}}>
                  <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
                  <Typography variant="body2">{username}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={8} xs={6}>
          <Card style={{height: '100%'}}>
            <CardContent style={{height: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
                <Typography style={{fontSize: '1em'}}><b>Email:</b> {email}</Typography>
                <Typography style={{fontSize: '1em'}}><b>Joined:</b> {`${new Date(joined!).getDate()}.${new Date(joined!).getMonth()+1}.${new Date(joined!).getFullYear()}.`}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={8} xs={12}>
          <GameHistory gamesPerPage={4} games={games} loading={loading} />
        </Grid>
        <Grid item md={4} xs={12}>
          <ScorePanel loading={loading} games={games.length} wins={wins} losses={losses} draws={draws} score={score!} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
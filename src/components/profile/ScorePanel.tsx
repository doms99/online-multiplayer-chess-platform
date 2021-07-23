import { Card, CardContent, CardHeader, CircularProgress, Divider, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';

export interface Props {
  wins: number, 
  losses: number,
  draws: number,
  score: number,
  games: number,
  loading: boolean
}

export const statusStyle = {
  win: '#2cbf71',
  draw: '#858585',
  loss: '#c44a2b'
};

const ScorePanel: React.FC<Props> = ({ wins, losses, draws, games, score, loading }) => {
  const theme = useTheme();
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Card>
      <CardHeader title="Stats"/>
      <CardContent>
        {loading ? <CircularProgress/> : <div style={{display: 'flex', flexDirection: mdBreakpoint ? "column" : "row"}}>
          <div style={{display: 'flex', flexGrow: 1, justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography style={{color: statusStyle.draw}}>score</Typography>
              <Typography>{score}</Typography>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography style={{color: statusStyle.draw}}>games</Typography>
              <Typography>{games}</Typography>
            </div>
          </div>
          <Divider orientation={mdBreakpoint ? "horizontal" : "vertical"} variant="middle" style={{margin: '0.8em 0'}}/>
          <div style={{display: 'flex', flexGrow: 1, justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography style={{color: statusStyle.win}}>win</Typography>
              <Typography>{wins}</Typography>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography style={{color: statusStyle.draw}}>draw</Typography>
              <Typography>{draws}</Typography>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography style={{color: statusStyle.loss}}>loss</Typography>
              <Typography>{losses}</Typography>
            </div>
          </div>
        </div>}
      </CardContent>
    </Card>
  );
};

export default ScorePanel;
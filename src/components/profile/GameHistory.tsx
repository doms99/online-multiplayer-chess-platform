import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination, Tooltip, useTheme, useMediaQuery, CircularProgress, Card, CardHeader, CardContent } from '@material-ui/core';
import { Replay, AddBox, IndeterminateCheckBox } from '@material-ui/icons';
import { statusStyle } from './ScorePanel';
import { useSelector } from 'react-redux';
import { FullState } from '../../redux/state';
import { useHistory } from 'react-router';

export interface Game {
  id: string,
  status: string,
  winner: string,
  duration: number,
  start: Date,
  white: string,
  black: string
}
export interface Props {
  gamesPerPage: number,
  games: Game[],
  loading: boolean
}

const GameHistory: React.FC<Props> = ({ gamesPerPage, games, loading }) => {
  const [page, setPage] = useState<number>(0);
  const username = useSelector<FullState, string>(state => state.auth.username!);
  const history = useHistory();

  const theme = useTheme();
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up('sm'));

  const handlePageChange = (_: any, page: number) => {
    setPage(page);
  }

  return (
    <Card>
      <CardHeader title="Games"/>
      <CardContent>
        {loading ? <CircularProgress/> : <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Players</TableCell>
                <TableCell align="center">Result</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Date</TableCell>
                {mdBreakpoint && <TableCell size="small" align="right">Replay</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...games].splice(page*gamesPerPage, gamesPerPage).map(({ id, status, winner, duration, start, white, black }) => (
                <TableRow key={id}>
                  <TableCell align="left">
                    <div>
                      <div style={white === username ? {fontWeight: 'bold'} : {}}><div className="color-box white"/> {white}</div>
                      <div style={black === username ? {fontWeight: 'bold'} : {}}><div className="color-box black"/> {black}</div>
                    </div>
                  </TableCell>
                  <TableCell align="center">{status === 'draw' ? (
                      <Tooltip title="draw"><IndeterminateCheckBox style={{height: '0.9em', color: statusStyle.draw}}/></Tooltip> 
                    ) : (
                      winner === username ? (
                        <Tooltip title="win"><AddBox style={{height: '0.9em', color: statusStyle.win}}/></Tooltip>
                      ) : (
                        <Tooltip title="loss"><IndeterminateCheckBox style={{height: '0.9em', color: statusStyle.loss}}/></Tooltip>
                      )
                    )}
                  </TableCell>
                  <TableCell align="center">{`${Math.floor(duration/60)}:${(duration % 60) < 10 ? '0'+(duration % 60) : (duration % 60)}`}</TableCell>
                  <TableCell align="center">{start.getDay()}.{start.getMonth()}.{start.getFullYear()}</TableCell>
                  {mdBreakpoint && <TableCell align="right"><IconButton onClick={() => history.push(`/game/${id}`)}><Replay fontSize="small"/></IconButton></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={games.length}
            rowsPerPage={gamesPerPage}
            page={page}
            onChangePage={handlePageChange}
          />
        </>
        }
      </CardContent>
    </Card>
  );
};

export default GameHistory;
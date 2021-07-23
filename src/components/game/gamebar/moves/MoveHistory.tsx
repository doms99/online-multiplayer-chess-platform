import { Typography, Table, TableRow, TableCell, TableHead, TableBody, Card, CardContent, CardHeader } from '@material-ui/core';
import { MoveHistoryEntry } from '../../../../redux/state';
import './MoveHistory.css';

export interface Props {
  moveHistory: MoveHistoryEntry[],
  end?: boolean
}

const MoveHistory: React.FC<Props> = ({ end, moveHistory }) => {
  const rows: JSX.Element[] = [];

  for(let i = 0; i < moveHistory.length; i) {
    rows[i] = <TableRow key={i}>
    <TableCell align="left"><Typography>{Math.floor(i/2)+1}</Typography></TableCell>
    <TableCell align="right">
      <div>
        <Typography variant="body2">{moveHistory[i++].description}</Typography>
      </div>
    </TableCell>
    <TableCell align="right">
      {i < moveHistory.length && <div>
        <Typography variant="body2">{moveHistory[i++].description}</Typography>
      </div>}
    </TableCell>
  </TableRow>
  }

  return (
    <Card className="history">
      <CardHeader title="History" />
      <CardContent className="history-content">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left"><Typography>Move</Typography></TableCell>
              <TableCell align="right"><Typography>White</Typography></TableCell>
              <TableCell align="right"><Typography>Black</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
            {end && <TableRow>
                <TableCell/>
                <TableCell style={{textAlign: 'center', fontSize: '1.2em'}}>End</TableCell>
                <TableCell/>
              </TableRow>
            }
          </TableBody>
        </Table>
      </CardContent>

    </Card>
  );
};

export default MoveHistory;
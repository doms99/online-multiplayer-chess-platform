import React from 'react';
import { Button, Card, CardActions, IconButton } from '@material-ui/core';
import { NavigateBefore as ArrowLeftIcon, NavigateNext as ArrowRightIcon, SkipNext as LastIcon, SkipPrevious as FirstIcon } from '@material-ui/icons';
import { RevertDirection } from '../../redux/actions/game/definitions';
import './Game.css';

export interface Props {
  resign?: () => void,
  resignDisabled?: boolean,
  revert: (direction: RevertDirection) => void
}

const Controls: React.FC<Props> = ({ resign, resignDisabled, revert }) => {
  return (
    <Card>
      <CardActions style={{justifyContent: 'space-between'}}>
        <div>
          {resign && <Button disabled={resignDisabled} onClick={resign}>Resign</Button>}
        </div>
        <div>
          <IconButton edge="end" onClick={() => revert(RevertDirection.PREVIOUS)}><ArrowLeftIcon/></IconButton>
          <IconButton edge="end" onClick={() => revert(RevertDirection.FIRST)}><FirstIcon/></IconButton>
          <IconButton edge="end" onClick={() => revert(RevertDirection.LAST)}><LastIcon/></IconButton>
          <IconButton onClick={() => revert(RevertDirection.NEXT)}><ArrowRightIcon /></IconButton>
        </div>
      </CardActions>
    </Card>
  );
};

export default Controls;
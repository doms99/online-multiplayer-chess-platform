import { Button, Card, CardActions, FormControl, InputLabel, Menu, MenuItem, Select, CircularProgress, CardContent  } from "@material-ui/core";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startActionCreator } from "../../redux/actions/game/gameAction";
import Colors from "./board/constants/Colors";
import { Events} from '../../connection/definitions';
import { SocketContext } from "../contexts/SocketContextComponent";
import { FullState } from "../../redux/state";
import { closeSync } from "node:fs";

export interface Props {
  setDuration: (duration: number) => void,
  duration: number
}

const buttonStyle = {
  width: '200px'
}

const levels = [600, 800, 1000, 1300, 1500, 2000];
const durations = [1, 3, 5, 10, 15, 20];

const closestLevel = (level: number) => {
  let closest = -1;
  let difference = -1;
  for(const lvl of levels) {
    if(closest === -1) {
      closest = lvl;
      difference = Math.abs(level - lvl);
      continue;
    }

    const dif = Math.abs(level - lvl);
    if(dif < difference) {
      closest = lvl;
      difference = dif;
    }
  }
  
  return closest;
}

const GameSelect: React.FC<Props> = ({ setDuration, duration }) => {  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'alone' | 'computer' | null>(null);
  const score = useSelector<FullState, number>(state => state.auth.score!);
  const [level, setLevel] = useState<number>(closestLevel(score));
  const dispatch = useDispatch();
  const { startGameSearch, cancelGameSearch } = useContext(SocketContext);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, mode: 'alone' | 'computer') => {
    setAnchorEl(event.currentTarget);
    setMode(mode);
  };

  const aloneSelectHandler = (color: Colors) => {
    setAnchorEl(null);

    dispatch(startActionCreator(color, mode!, { username: 'You', score: 800 }));
  };

  const multiHandler = () => {
    startGameSearch(duration, level);
    setLoading(true);
  }

  const cancel = () => {
    cancelGameSearch();
    setLoading(false);
  }

  const handleDurationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDuration(event.target.value as number);
  };

  const handleLevelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLevel(event.target.value as number);
  };

  if(loading) {
    return (
    <Card>
      <CardContent><CircularProgress /></CardContent>
      <CardActions><Button onClick={cancel}>Cancel</Button></CardActions>
    </Card>
    )
  }


  return (
    <>
      <Card style={{marginBottom: '8px'}}>
        <CardActions disableSpacing style={{ flexDirection: 'column' }}>
          <div style={{display: 'flex', ...buttonStyle}}>
            <Button variant="contained" onClick={multiHandler} color="primary" size="large" fullWidth>
              Play
            </Button>
            <Select
              value={level}
              onChange={handleLevelChange}
              label="Level"
              style={{textAlign: 'center', marginLeft: '8px'}}
            >
              {levels.map((value, index) => <MenuItem key={index} value={value}>{value}</MenuItem>)}
            </Select>
          </div>
          <Button onClick={(e) => handleClick(e, 'alone')} style={buttonStyle}>
            Play alone
          </Button>
          <Button onClick={(e) => handleClick(e, 'computer')} style={buttonStyle}>
            Play computer
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardActions>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">Duration</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={duration}
              onChange={handleDurationChange}
              label="Duration"
              fullWidth
              style={{textAlign: 'center'}}
            >
              {durations.map((value, index) => <MenuItem key={index} value={value*60}>{value} min</MenuItem>)}
            </Select>
          </FormControl>
        </CardActions>
      </Card>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => aloneSelectHandler(Colors.white)}>White side</MenuItem>
        <MenuItem onClick={() => aloneSelectHandler(Colors.black)}>Black side</MenuItem>
      </Menu>
    </>
  );
};

export default GameSelect;
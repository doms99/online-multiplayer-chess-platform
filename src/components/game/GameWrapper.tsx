import React from 'react';
import CombinedContext from '../contexts/CombinedContext';
import Game from './Game';

const GameWrapper = () => {
  return (
    <CombinedContext><Game /></CombinedContext>
  );
};

export default GameWrapper;
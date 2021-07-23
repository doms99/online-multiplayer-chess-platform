import React from 'react';
import SocketContextComponent from './SocketContextComponent';
import LogicContext from './LogicContext';

const CombinedContext: React.FC = ({ children }) => {
  return <SocketContextComponent><LogicContext>{children}</LogicContext></SocketContextComponent>;
};

export default CombinedContext;
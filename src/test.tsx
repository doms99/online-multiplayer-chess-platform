import React, { useEffect, useState } from 'react';

const Test: React.FC = () => {
  const [interval, setInt] = useState<string>('hahaha');

  useEffect(() => {
    console.log('mount')
    if(interval !== null) {
      return;
    }

    setInt('hello');
    return () => {
      console.log('unmount')
      setTimeout(() => console.log(interval), 5000);
    }
  }, []);


  return (
    <div>
      
    </div>
  );
};

export default Test;
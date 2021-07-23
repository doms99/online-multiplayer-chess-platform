export interface Pair {
  gameId: string,
  other: string,
  otherStarted: boolean,
  gameOver: boolean,
  elapsed: number
}

export interface PairingType {
  [key: string]: Pair
};

export const pairingObject: PairingType = {};

const put = (first: string, secund: string, gameId: string) => {
  if(!first || !secund || first.trim() === '' || secund.trim() === '') return;

  const firstTrimed = first.trim();
  const secundTrimed = secund.trim();

  const oldSecund = get(firstTrimed);
  if(oldSecund) {
    pairingObject[oldSecund] = {
      ...pairingObject[oldSecund],
      otherStarted: true
    }
  }

  const oldFirst = get(secundTrimed);
  if(oldFirst) {
    pairingObject[oldFirst] = {
      ...pairingObject[oldFirst],
      otherStarted: true
    }
  }

  pairingObject[firstTrimed] = {other: secundTrimed, gameId, otherStarted: false, gameOver: false, elapsed: 0};
  pairingObject[secundTrimed] = {other: firstTrimed, gameId, otherStarted: false, gameOver: false, elapsed: 0};
}

const get = (key: string): string | undefined => {
  if(!key || key.trim() === '') return undefined;

  return pairingObject[key.trim()]?.other;
}

const getGameId = (key: string): string | undefined => {
  if(!key || key.trim() === '') return undefined;

  return pairingObject[key.trim()]?.gameId;
}

const didOtherStart = (key: string): boolean | undefined => {
  if(!key || key.trim() === '') return undefined;

  return pairingObject[key.trim()]?.otherStarted;
}

const getElapsed = (key: string): number => {
  if(!key || key.trim() === '') return undefined;

  return pairingObject[key.trim()].elapsed;
}

const setElapsed = (key: string, elapsed: number): void => {
  if(!key || key.trim() === '') return undefined;

  pairingObject[key.trim()].elapsed = elapsed;
}

const isGameOver = (first: string, secund: string): boolean | undefined => {
  if(!first || !secund || first.trim() === '' || secund.trim() === '') return;

  const firstTrimed = first.trim();
  const secundTrimed = secund.trim();

  if(pairingObject[firstTrimed].other === secundTrimed) return pairingObject[firstTrimed].gameOver;
  if(pairingObject[secundTrimed].other === firstTrimed) return pairingObject[secundTrimed].gameOver;

  return;
}

const setGameOver = (first: string, secund: string) => {
  if(!first || !secund || first.trim() === '' || secund.trim() === '') return;

  const firstTrimed = first.trim();
  const secundTrimed = secund.trim();

  if(pairingObject[firstTrimed].other === secundTrimed) {
    pairingObject[firstTrimed].gameOver = true;
  }

  if(pairingObject[secundTrimed].other === firstTrimed) {
    pairingObject[secundTrimed].gameOver = true;
  }
}

const remove = (id: string) => {
  if(!id || id.trim() === '') return;

  const firstTrimed = id.trim();

  delete pairingObject[firstTrimed];
}

const print = () => {
  console.log('pairing', pairingObject);
}

const pairing = {
  put, get, remove, getGameId, didOtherStart, print, isGameOver, setGameOver, getElapsed, setElapsed
}

export default pairing;
type SingleQueue = Record<string, string[]>;
type MutipleQueue = Record<string, SingleQueue>;

export const queueObject: MutipleQueue = {};

const add = (duration: number, level: number, name: string) => {
  if(duration <= 0) return;
  if(name.trim() === '') return;

  if(queueObject[duration.toString()] === undefined) {
    queueObject[duration.toString()] = {[level.toString()]: [name]};
    return;
  }

  queueObject[duration.toString()] = {
    ...queueObject[duration.toString()],
    [level.toString()]: queueObject[duration.toString()][level.toString()] ?
                        [...queueObject[duration.toString()][level.toString()], name] : [name]
  };
}

const get = (duration: number, level: number): string | undefined => {
  if(!hasWaiting(duration, level)) return undefined;

  const array = [...queueObject[duration.toString()][level.toString()]];
  const res = array.splice(0, 1);

  if(array.length === 0) {
    delete queueObject[duration.toString()][level.toString()];
    if(queueObject[duration.toString()] === {}) delete queueObject[duration.toString()];
  } else {
    queueObject[duration.toString()][level.toString()] = array;
  }

  return res[0];
}

const hasWaiting = (duration: number, level: number): boolean => {
  return queueObject[duration.toString()] !== undefined && queueObject[duration.toString()][level.toString()] !== undefined;
}

const removeIfExists = (name: string) => {
  for(const duration of Object.keys(queueObject)) {
    for(const level of Object.keys(queueObject[duration]))
    if(queueObject[duration][level].includes(name)) {
      const array = queueObject[duration][level].filter(value => value !== name);

      if(array.length === 0) {
        delete queueObject[duration][level];
        if(queueObject[duration] === {}) delete queueObject[duration];
        return;
      }

      queueObject[duration][level] = array;
      return;
    }
  }

}

const print = () => {
  console.log('queue', queueObject);
}

const queue = {
  add, get, hasWaiting, removeIfExists, print
}

export default queue;
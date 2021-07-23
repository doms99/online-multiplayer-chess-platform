import { Pool } from 'pg';
import { dbConst } from '../constants';

export const pool = new Pool(dbConst);

export const query = (text: string, ...params: any[]) => {
  // console.log(text, params);
  return pool.query(text, params)
    .then(res => {
      return res;
    }).catch(err => {
      console.trace(err);
      return err
    });
};
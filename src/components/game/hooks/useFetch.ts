import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutActionCreator } from "../../../redux/actions/auth/authAction";
import { FullState } from "../../../redux/state";

export const useGet = (path: string) => {
  const dispatch = useDispatch();
  const token = useSelector<FullState, string | undefined>(state => state.auth.token);

  const controller = useMemo(() => new AbortController(), []);
  const signal = controller.signal;

  useEffect(() => {
    return () => {
      controller.abort()
    }
  }, [controller]);

  return (queries?: Record<string, any>) => {
    let pathWithQuery = path;

    if(queries) {
      pathWithQuery = path + '?';

      for(const [key, value] of Object.entries(queries)) {
        pathWithQuery += `${key}=${value}&`;
      }
    
      pathWithQuery = pathWithQuery.slice(0, -1);
    }


    return fetch(pathWithQuery, {
    headers:  {
      'Authorization': token ? 'Bearer '+token : '', 
      'Accept': 'application/json'
    },
    signal
  }).then(res => {
    if(res.status === 401) {
      dispatch(logoutActionCreator());
      return new Promise((resolve, reject) => reject("Login expired"));
    }

    return res.json();
  }).catch(err => {
    return new Promise((resolve, reject) => reject(err));
  })
}
}

export const usePost = <BodyObject>(path: string) => {
  const dispatch = useDispatch();
  const token = useSelector<FullState, string | undefined>(state => state.auth.token);

  const controller = useMemo(() => new AbortController(), []);
  const signal = controller.signal;

  useEffect(() => {
    return () => {
      controller.abort()
    }
  }, [controller]);

  return (body: BodyObject) => {
    console.log(JSON.stringify(body));

    return fetch(path, {
    method: 'POST',
    headers:  { 
      'Authorization': token ? 'Bearer '+token : '', 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    signal,
    body: JSON.stringify(body)
  }).then(res => {
    if(res.status === 401) {
      dispatch(logoutActionCreator());
      return new Promise((resolve, reject) => reject("Login expired"));
    }

    return res.json();
  }).catch(err => {
    return new Promise((resolve, reject) => reject(err));
  })
}
}
import { applyMiddleware, createStore as createReduxStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import mainReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const presistConfig = {
  key: 'chessMaster',
  storage
}

const persistedReducer = persistReducer(presistConfig, mainReducer);

const createStore = () => {
  const store = createReduxStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
  const persistor = persistStore(store);

  return { store, persistor };
};

export default createStore;


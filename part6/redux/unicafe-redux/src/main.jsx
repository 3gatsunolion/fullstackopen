import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'RESET' })}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

// When the state in the store is changed, React is not able to automatically re-render the application.
// Thus we have registered a function renderApp, which renders the whole app, to listen for changes in the
// store with the store.subscribe method. Note that we have to immediately call the renderApp method. 
// Without the call, the first rendering of the app would never happen.
renderApp()
store.subscribe(renderApp)

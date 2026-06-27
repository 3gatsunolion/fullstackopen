import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AnecdotesContextProvider from './AnecdotesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AnecdotesContextProvider>
    <App />
  </AnecdotesContextProvider>
)

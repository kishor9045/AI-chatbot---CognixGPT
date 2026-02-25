import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Login } from './Login.jsx'
import { Account } from './Account.jsx'
import {BrowserRouter, Routes, Route} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/settings" element={<Account/>}/>
      </Routes>
    </BrowserRouter>
  </>,
)

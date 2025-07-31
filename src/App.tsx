
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QrScanner from './pages/Scanner'
import Navbar from './components/navbar'
import { AuthProvider } from './Context/AuthContext'
import InsertProduct from './pages/insert'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
    <AuthProvider>
      <Router>
    <Navbar/>
    <Toaster/>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/scanner' element={<QrScanner />}></Route>
          <Route path='/insert' element={<InsertProduct />}></Route>
        </Routes>
      </Router >
      </AuthProvider>
    </>
  )
}

export default App

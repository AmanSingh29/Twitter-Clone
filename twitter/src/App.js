import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TweetDetails from './components/TweetDetails';
import MyProfile from './components/MyProfile';
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login/>}/>
          <Route exact path='/signup' element={<Signup/>}/>
          <Route exact path='/home' element={<Home/>}/>
          <Route exact path='/profile/:userId' element={<Profile/>}/>
          <Route exact path='/myprofile' element={<MyProfile/>}/>
          <Route exact path='/tweet/:tweetId' element={<TweetDetails/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;

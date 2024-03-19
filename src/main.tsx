import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import './index.css';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Project from './pages/Project';
import Projects from './pages/Projects';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<App />}>
      <Route path='' element={<Welcome />} />
      <Route path='my-projects' element={<Projects />} />
      <Route path='my-projects/:id' element={<Project />} />
      <Route path='contact' element={<Contact />} />
      <Route path='about' element={<About />} />
      <Route path='profile' element={<Profile />} />
      <Route path='sign-in' element={<Signin />} />
      <Route path='sign-up' element={<Signup />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)

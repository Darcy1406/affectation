import Home from './Pages/Home';
import { RouterProvider } from 'react-router-dom';
import './assets/css/output.css';
// import './assets/css/bulma/bulma.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css'
import { router } from './Router';

export default function App() {
  return (
    <div className='App min-h-screen'>
        <RouterProvider router={router}/>
    </div>
  )
}

import Cursos from './components/Cursos'
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>E-Learning - Cursos Online</h1>
      <BrowserRouter>
        <ul>
          <li><Link to="/">Novo Curso</Link></li>
        </ul>

        <Routes>
          <Route path="/" index element={<Cursos />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

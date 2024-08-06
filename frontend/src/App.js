import Cursos from './components/Cursos'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modulos from "./components/Modulos";
import Aulas from "./components/Aulas";

function App() {
  return (
    <div className="App">
      <h1>E-Learning - Cursos Online</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/api/v1/cursos" index element={<Cursos />}></Route>
          <Route path="/cursos/:cursoId/modulos" element={<Modulos />} />
          <Route path="/modulos/:cursoId" element={<Modulos />} />
          <Route path="/aulas/:moduloId" element={<Aulas />} />
          <Route path="/modulos/:cursoId/:moduloId/aulas" element={<Aulas />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

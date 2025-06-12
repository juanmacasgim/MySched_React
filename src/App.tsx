import './App.css'
import { Navbar } from './components/Navbar';
import MyButton from './components/MyButton';
import { useNavigate } from 'react-router-dom';


function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/mysched/login');
  }
  return (
    <>
      <Navbar
        logo="MySched"
        actions={[
          <MyButton variant="contained" onClick={handleLogin} >
            Iniciar sesión
          </MyButton>
        ]} />
      <div className='home'>
        <div className='home-content'>
          <h1>Bienvenid@ a MySched</h1>
          <p>MySched es una aplicación web con la que podrás tener todas tus citas, eventos, agendas, diario y mucho más en un solo lugar. Se acabó el tener que depender de distintas aplicaciones para tener ordenado tu día a día, el de tu familia o el del trabajo.
            <strong>¿A qué esperas para usarla?</strong>
            <br />
            <br />
            <br />
            <br />
            <strong>Nota</strong>
            <br />
            Actualmente la aplicación está en desarrollo, por lo que puede haber errores o funcionalidades que no estén disponibles.
          </p>
          <footer>
            <p>Desarrollado por <strong>Juan María Castillo Gimenéz</strong>
              <br />Proyecto Final de <strong>CFGS de Desarrollo de Aplicaciones Web</strong>
              <br />IES Francisco de los Ríos, Fernán Núñez, Córdoba
              <br />2025</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App

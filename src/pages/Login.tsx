import { useEffect, useState } from 'react'
import '../styles/Login.css'
import MyButton from '../components/MyButton';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

function Login() {
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/mysched/calendar');
        }
    }, [navigate]);

    const handleHome = () => {
        navigate('/mysched/home');
    }

    return (
        <section>
            <Navbar
                logo="MySched"
                actions={[
                    <MyButton variant="contained" onClick={handleHome} >
                        Inicio
                    </MyButton>
                ]} />
            <div className='home'>
                <div className='home-content'>
                    <div className = 'login-register'>
                        <AuthForm />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Login;
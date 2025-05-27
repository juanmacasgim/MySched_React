import { useEffect, useState } from 'react';
import MyButton from './MyButton';
import LoginIcon from '@mui/icons-material/Login';
import Snackbar from '@mui/material/Snackbar';
import { login, register } from '../api/services';
import { UserInterface } from '../interfaces/UserInterface';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('MySchedToken');
        if (token) {
            navigate('/mysched/calendar');
        }
    }, [navigate]);

    const [formData, setFormData] = useState<UserInterface>({
        name: '',
        email: '',
        password: '',
        birthdate: '',
        photo: '',
    });

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { email, password, name, birthdate } = formData;

        if (!email || !password || (!isLogin && (!name || !birthdate))) {
            setMessage('Faltan datos por introducir');
            setOpen(true);
            return;
        }

        const response = isLogin ? await login({ email, password } as UserInterface)
                                 : await register(formData);

        if (response.status === 1) {
            setMessage(isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso');
            setOpen(true);
            setTimeout(() => navigate('/mysched/calendar'), 500);
        } else {
            setMessage(response.message || 'Error en la autenticación');
            setOpen(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleSubmit();
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="switch-buttons">
                    <MyButton
                        variant={isLogin ? 'contained' : 'outlined'}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </MyButton>
                    <MyButton
                        variant={!isLogin ? 'contained' : 'outlined'}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </MyButton>
                </div>

                <h2>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                name="name"
                                className="input-field"
                                type="text"
                                placeholder="Introduce tu nombre"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthdate">Fecha de nacimiento</label>
                            <input
                                id="birthdate"
                                name="birthdate"
                                className="input-field"
                                type="date"
                                value={formData.birthdate}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        name="email"
                        className="input-field"
                        type="email"
                        placeholder="Introduce tu correo"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        className="input-field"
                        type="password"
                        placeholder="Introduce tu contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="button-container">
                    <MyButton
                        variant="contained"
                        onClick={handleSubmit}
                        endIcon={<LoginIcon />}
                    >
                        {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                    </MyButton>
                </div>

                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={() => setOpen(false)}
                    message={message}
                />
            </div>
        </div>
    );
}

export default AuthForm;
import { useState } from 'react';
import loginImage from '../assets/product/login.jpg';
import { Link } from 'react-router-dom';
import useAuthContext from '@hooks/useAuthContext';
import { getUserQuery } from '@/services/userService';

const Login: React.FC = () => {
    const [error, setError] = useState<string>('');
    const { login, fetchUser } = useAuthContext();
    const { getUser } = getUserQuery();

    async function handleLogin() {
        await login({
            onSuccess: async () => {
                const result = await getUser([[]])
                if (!result || 'err' in result) {
                    setError('User not found');
                    return;
                }
                await fetchUser();
            }
        });
    }

    return (
        <div className="flex justify-between">
            <img src={loginImage} className='w-1/2 h-screen mr-1' />

            <div className='flex flex-col justify-center w-full p-10 space-y-8'>
                <p className='font-marcellus text-3xl'>SIGN IN</p>

                <div className='space-y-3'>
                    <p className='text-red-500 text-xs font-medium min-h-4'>{error}</p>

                    <button onClick={handleLogin} className='w-full bg-black border-black border-2 p-3 text-white text-lg font-bold'>SIGN IN</button>
                    <Link to="/register">
                        <p className="p-2 w-full text-center">
                            Don't have an account yet? <span className="font-bold">Sign up here.</span>
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default Login;
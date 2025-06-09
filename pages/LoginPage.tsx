
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      // Error message is handled by toast in AuthContext, but can set local error too
      setError('Login failed. Please check your credentials.'); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h2 className="text-3xl font-bold text-center text-neutral-100 mb-8">Login</h2>
      {error && <p className="text-status-danger text-sm text-center mb-4 p-2 bg-status-danger bg-opacity-10 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter your username"
        />
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
          Login
        </Button>
      </form>
      <p className="text-sm text-neutral-400 text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-neutral-300 hover:text-white transition-colors">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
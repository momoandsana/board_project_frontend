
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await signup(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/login');
    } else {
      // Error handled by toast, but can set local error
      // setError('Signup failed. Username might be taken or an error occurred.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h2 className="text-3xl font-bold text-center text-neutral-100 mb-8">Create Account</h2>
      {error && <p className="text-status-danger text-sm text-center mb-4 p-2 bg-status-danger bg-opacity-10 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Choose a username"
        />
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Create a strong password"
        />
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm your password"
          error={error && error.includes("Passwords do not match") ? error : undefined}
        />
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
          Sign Up
        </Button>
      </form>
       <p className="text-sm text-neutral-400 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-neutral-300 hover:text-white transition-colors">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
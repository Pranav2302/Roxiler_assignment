import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { login } from '../utils/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      const { user, token } = response.data;
      onLogin(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '40px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Typography align="center">
          Normal User? <Link to="/signup">Sign up here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
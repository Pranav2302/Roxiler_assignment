import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  address: '',
  password: '',
  confirmPassword: '',
  role: 'NORMAL_USER'
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be 20-60 characters';
    }

    
    if (formData.address.length > 400) {
      newErrors.address = 'Address must be max 400 characters';
    }

    
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password: 8-16 chars, 1 uppercase, 1 special character';
    }

   
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password !== formData.confirmPassword) {
  newErrors.confirmPassword = 'Passwords do not match';
}


    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signup(formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '40px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up - Normal User
        </Typography>

        {errors.general && <Alert severity="error" style={{ marginBottom: '20px' }}>{errors.general}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
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
            error={!!errors.password}
            helperText={errors.password}
            required
            margin="normal"
          />
            <TextField
  fullWidth
  label="Confirm Password"
  name="confirmPassword"
  type="password"
  value={formData.confirmPassword}
  onChange={handleChange}
  error={!!errors.confirmPassword}
  helperText={errors.confirmPassword}
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <Typography align="center">
          Already have account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;
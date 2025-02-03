import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoginApplicantMutation } from '../../state/applicantsApi';
import { useLoginRecruiterMutation } from '../../state/recruitersApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../state/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginApplicant] = useLoginApplicantMutation();
  const [loginRecruiter] = useLoginRecruiterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (role === 'applicant') {
        response = await loginApplicant({ email, password }).unwrap();
        /* set user and role details in state */
        dispatch(
          setUser({
            role,
            user: response.applicant,
          })
        );
      } else {
        response = await loginRecruiter({ email, password }).unwrap();
        /* set user and role details in state */
        dispatch(
          setUser({
            role,
            user: response.recruiter,
          })
        );
      }

      /* upon login, redirect based on role */
      if (response) {
        navigate(
          role === 'applicant' ? '/applicant-dashboard' : '/recruiter-dashboard'
        );
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login to Your Account
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <RadioGroup
          row
          aria-label="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel
            value="applicant"
            control={<Radio />}
            label="Applicant"
          />
          <FormControlLabel
            value="recruiter"
            control={<Radio />}
            label="Recruiter"
          />
        </RadioGroup>

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </form>

      <Typography sx={{ marginTop: 2 }}>
        Do not have an account?{' '}
        <NavLink
          to="/register"
          style={{ textDecoration: 'none', color: 'primary' }}
        >
          Register here
        </NavLink>
      </Typography>
    </Box>
  );
}

export default Login;

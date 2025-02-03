import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useRegisterApplicantMutation } from '../../state/applicantsApi';
import { useRegisterRecruiterMutation } from '../../state/recruitersApi';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('applicant');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobileNumber: '',
    organisation: '',
    profileSummary: '',
    skills: '',
    resumeUrl: '',
    currentRole: '',
    currentCompensation: '',
    currentLocation: '',
    preferredRole: '',
    preferredCompensation: '',
    preferredLocation: '',
  });

  const [registerRecruiter, { isLoading: recruiterLoading }] =
    useRegisterRecruiterMutation();
  const [registerApplicant, { isLoading: applicantLoading }] =
    useRegisterApplicantMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...formData };

      /* convert skills & preferredLocation from comma-separated string to array */
      if (userType === 'applicant') {
        payload.skills = payload.skills
          .split(',')
          .map((skill) => skill.trim().toLowerCase());
        payload.preferredLocation = payload.preferredLocation
          .split(',')
          .map((loc) => loc.trim().toLowerCase());
      }

      if (userType === 'recruiter') {
        await registerRecruiter(payload).unwrap();
      } else {
        await registerApplicant(payload).unwrap();
      }

      navigate('/');
    } catch (err) {
      console.error('Registration Error:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: '60px',
          p: 3,
          boxShadow: 0,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" mb={2}>
          Register
        </Typography>

        <Typography sx={{ marginTop: 2 }}>
          Already have an account?{' '}
          <NavLink to="/" style={{ textDecoration: 'none', color: 'primary' }}>
            Login here
          </NavLink>
        </Typography>

        {/* User Type Selection */}
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
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
        </FormControl>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            onChange={handleChange}
            required
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            name="name"
            onChange={handleChange}
            required
          />
          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            name="mobileNumber"
            onChange={handleChange}
            required
          />

          {/* Recruiter-specific field */}
          {userType === 'recruiter' && (
            <TextField
              label="Organisation"
              fullWidth
              margin="normal"
              name="organisation"
              onChange={handleChange}
              required
            />
          )}

          {/* Applicant-specific fields */}
          {userType === 'applicant' && (
            <>
              <TextField
                label="Profile Summary"
                fullWidth
                margin="normal"
                name="profileSummary"
                onChange={handleChange}
              />
              <TextField
                label="Skills (comma-separated)"
                fullWidth
                margin="normal"
                name="skills"
                onChange={handleChange}
                required
              />
              <TextField
                label="Resume URL"
                fullWidth
                margin="normal"
                name="resumeUrl"
                onChange={handleChange}
              />
              <TextField
                label="Current Role"
                fullWidth
                margin="normal"
                name="currentRole"
                onChange={handleChange}
                required
              />
              <TextField
                label="Current Compensation"
                fullWidth
                margin="normal"
                name="currentCompensation"
                onChange={handleChange}
                required
              />
              <TextField
                label="Current Location"
                fullWidth
                margin="normal"
                name="currentLocation"
                onChange={handleChange}
                required
              />
              <TextField
                label="Preferred Role"
                fullWidth
                margin="normal"
                name="preferredRole"
                onChange={handleChange}
                required
              />
              <TextField
                label="Preferred Compensation"
                fullWidth
                margin="normal"
                name="preferredCompensation"
                onChange={handleChange}
                required
              />
              <TextField
                label="Preferred Locations (comma-separated) Ex: Delhi, Pune"
                fullWidth
                margin="normal"
                name="preferredLocation"
                onChange={handleChange}
                required
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
            disabled={recruiterLoading || applicantLoading}
          >
            {recruiterLoading || applicantLoading
              ? 'Registering...'
              : 'Register'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

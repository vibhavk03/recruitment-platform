import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { useCreateJobMutation } from '../../state/jobsApi';

const JobCreationModal = ({ open, handleClose }) => {
  const [createJob] = useCreateJobMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState('Open');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!location) newErrors.location = 'Location is required';
    if (!skills) newErrors.skills = 'At least one skill is required';
    if (!type) newErrors.type = 'Job type is required';
    if (!status) newErrors.status = 'Job status is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newJobData = {
        title,
        description,
        location: location.split(',').map((loc) => loc.trim().toLowerCase()),
        type,
        skillsRequired: skills
          .split(',')
          .map((skl) => skl.trim().toLowerCase()),
        status,
      };

      try {
        await createJob(newJobData).unwrap();
        handleClose();
      } catch (err) {
        console.error('Error creating job:', err);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Job
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Job Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            margin="normal"
          />
          <TextField
            label="Job Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
          />
          <TextField
            label="Location (comma separated)"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            margin="normal"
          />
          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel>Job Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Job Type"
            >
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </Select>
            {errors.type && (
              <Typography color="error">{errors.type}</Typography>
            )}
          </FormControl>
          <TextField
            label="Skills Required (comma separated)"
            fullWidth
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            error={!!errors.skills}
            helperText={errors.skills}
            margin="normal"
          />
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Job Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Job Status"
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </Select>
            {errors.status && (
              <Typography color="error">{errors.status}</Typography>
            )}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Create Job
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

JobCreationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default JobCreationModal;

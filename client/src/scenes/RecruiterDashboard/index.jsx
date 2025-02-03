import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import JobCreationModal from '../../components/JobCreationModal';

const RecruiterDashboard = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      marginTop="60px"
    >
      <Typography variant="h4" gutterBottom>
        Recruiter Dashboard
      </Typography>

      {/* button to open modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ mb: 1 }}
      >
        Create New Job
      </Button>
      {/* job creation modal */}
      <JobCreationModal open={openModal} handleClose={handleCloseModal} />
    </Box>
  );
};

export default RecruiterDashboard;

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from '@mui/material';
import { useGetAllJobsQuery, useApplyToJobMutation } from '../../state/jobsApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ApplicantDashboard = () => {
  const { data, error, isLoading } = useGetAllJobsQuery();
  const [applyToJob] = useApplyToJobMutation();
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const applicantId = useSelector((state) => state?.auth?.user?._id);

  /* check if applicant has already applied for any job */
  useEffect(() => {
    if (data?.jobs) {
      const applied = new Set();
      data.jobs.forEach((job) => {
        job.applicants.forEach((applicant) => {
          if (applicant.applicant._id === applicantId) {
            applied.add(job._id);
          }
        });
      });
      setAppliedJobs(applied);
    }
  }, [data, applicantId]);

  const handleApply = async (jobId) => {
    if (appliedJobs.has(jobId)) return;
    try {
      await applyToJob({ jobId }).unwrap();
      setAppliedJobs((prev) => new Set(prev).add(jobId));
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  if (isLoading) return <Typography>Loading jobs...</Typography>;
  if (error) return <Typography>Error loading jobs.</Typography>;

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      justifyContent="center"
      p={3}
      marginTop="60px"
    >
      {data?.jobs?.map((job) => (
        <Card key={job._id} sx={{ maxWidth: 400, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {job.description}
            </Typography>
            <Typography variant="body2" mt={1}>
              Skills Required: {job.skillsRequired.join(', ')}
            </Typography>
            <Typography variant="body2" mt={1}>
              Location: {job.location.join(', ')}
            </Typography>
            <Typography variant="body2">Type: {job.type}</Typography>
            <Typography variant="body2">
              Recruiter: {job.recruiter?.name} ({job.recruiter?.organisation})
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  job.status === 'Closed'
                    ? 'error.main'
                    : job.status === 'On Hold'
                    ? 'warning.main'
                    : 'text.primary',
              }}
            >
              Job Status: {job.status}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApply(job._id)}
              disabled={
                appliedJobs.has(job._id) ||
                job.status === 'On Hold' ||
                job.status === 'Closed'
              }
              tabIndex={
                appliedJobs.has(job._id) ||
                job.status === 'On Hold' ||
                job.status === 'Closed'
                  ? -1
                  : 0
              }
            >
              {appliedJobs.has(job._id) ? 'Applied' : 'Apply'}
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default ApplicantDashboard;

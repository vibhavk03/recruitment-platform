import { Box, Card, CardContent, Typography } from '@mui/material';
import { useGetAppliedJobsQuery } from '../../state/jobsApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const AppliedJobs = () => {
  const { data, error, isLoading } = useGetAppliedJobsQuery();
  const applicantId = useSelector((state) => state?.auth?.user?._id);
  const [candidatureStatus, setCandidatureStatus] = useState({});

  /* update candidature status when data is fetched */
  useEffect(() => {
    if (data?.jobs) {
      const statusMap = {};
      data.jobs.forEach((job) => {
        const applicant = job.applicants.find(
          (a) => a.applicant._id === applicantId
        );
        if (applicant) {
          statusMap[job._id] = applicant.status;
        }
      });
      setCandidatureStatus(statusMap);
    }
  }, [data, applicantId]);

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
                  candidatureStatus[job._id] === 'Shortlisted' ||
                  candidatureStatus[job._id] === 'Contacted by Email' ||
                  candidatureStatus[job._id] === 'Contacted over Phone'
                    ? 'success.main'
                    : candidatureStatus[job._id] === 'Not Shortlisted'
                    ? 'error.main'
                    : 'text.primary',
              }}
            >
              Candidature Status: {candidatureStatus[job._id] || 'Applied'}
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
        </Card>
      ))}
    </Box>
  );
};

export default AppliedJobs;

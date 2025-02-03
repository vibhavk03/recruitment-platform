import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  useGetAllCreatedJobsQuery,
  useUpdateApplicantStatusMutation,
  useUpdateJobStatusMutation,
} from '../../state/jobsApi';
import { useState } from 'react';

const jobStatuses = ['Open', 'Closed', 'On Hold'];
const applicantStatuses = [
  'Applied',
  'Shortlisted',
  'Not Shortlisted',
  'Contacted by Email',
  'Contacted over Phone',
];

const CreatedJobs = () => {
  const { data, error, isLoading } = useGetAllCreatedJobsQuery();
  const [updateApplicantStatus] = useUpdateApplicantStatusMutation();
  const [statusUpdates, setStatusUpdates] = useState({}); // stores applicant status changes locally
  const [updateJobStatus] = useUpdateJobStatusMutation();
  const [jobStatusUpdates, setJobStatusUpdates] = useState({});

  const handleJobStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus({ jobId, status: newStatus }).unwrap();
      setJobStatusUpdates((prev) => ({ ...prev, [jobId]: newStatus }));
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleStatusChange = async (jobId, applicantId, newStatus) => {
    try {
      await updateApplicantStatus({
        jobId,
        applicantId,
        status: newStatus,
      }).unwrap();
      setStatusUpdates((prev) => ({
        ...prev,
        [`${jobId}-${applicantId}`]: newStatus,
      }));
    } catch (err) {
      console.error('Error updating status:', err);
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
            <Typography variant="body2" mt={1}>
              Job Status:
            </Typography>
            <Select
              value={jobStatusUpdates[job._id] || job.status}
              onChange={(e) => handleJobStatusChange(job._id, e.target.value)}
              size="small"
              sx={{ minWidth: 150, mt: 1 }}
            >
              {jobStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>

            {/* List Applicants */}
            <Typography variant="h6" mt={2}>
              Applicants:
            </Typography>
            {job.applicants.length > 0 ? (
              <List>
                {job.applicants.map((applicantObj) => (
                  <ListItem
                    key={applicantObj.applicant._id}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Typography variant="body2">
                      Name: {applicantObj.applicant.name}
                    </Typography>
                    <Typography variant="body2">
                      Email: {applicantObj.applicant.email}
                    </Typography>
                    <Typography variant="body2">
                      Mobile Number: {applicantObj.applicant.mobileNumber}
                    </Typography>
                    <Typography variant="body2">
                      Profile Summary: {applicantObj.applicant.profileSummary}
                    </Typography>
                    <Typography variant="body2">
                      Profile Summary:{' '}
                      {applicantObj.applicant.skills.join(', ')}
                    </Typography>
                    {applicantObj.applicant.resumeUrl && (
                      <Typography variant="body2">
                        Resume URL: {applicantObj.applicant.resumeUrl}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Current Role: {applicantObj.applicant.currentRole}
                    </Typography>
                    <Typography variant="body2">
                      Current Compensation:{' '}
                      {applicantObj.applicant.currentCompensation}
                    </Typography>
                    <Typography variant="body2">
                      Current Location: {applicantObj.applicant.currentLocation}
                    </Typography>
                    <Typography variant="body2">
                      Preferred Role: {applicantObj.applicant.preferredRole}
                    </Typography>
                    <Typography variant="body2">
                      Preferred Compensation:{' '}
                      {applicantObj.applicant.preferredCompensation}
                    </Typography>
                    <Typography variant="body2">
                      Preferred Location:{' '}
                      {applicantObj.applicant.preferredLocation.join(', ')}
                    </Typography>
                    <Typography variant="body2">
                      Applied Time: {applicantObj.appliedAt}
                    </Typography>
                    <Select
                      value={
                        statusUpdates[
                          `${job._id}-${applicantObj.applicant._id}`
                        ] || applicantObj.status
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          job._id,
                          applicantObj.applicant._id,
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      {applicantStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No applicants yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CreatedJobs;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/jobs/',
    credentials: 'include',
  }),
  tagTypes: ['Job', 'Applicant'],
  endpoints: (builder) => ({
    /* below endpoints used for applicants */
    /* fetch all jobs for applicants */
    getAllJobs: builder.query({
      query: () => '/getAllJobs',
      providesTags: ['Job'],
    }),
    /* apply to a job for applicants */
    applyToJob: builder.mutation({
      query: ({ jobId }) => ({
        url: `/${jobId}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Applicant'],
    }),
    /* fetch all jobs applied by an applicant */
    getAppliedJobs: builder.query({
      query: () => '/getApplied',
      providesTags: ['Applicant'],
    }),

    /* below endpoints used for recruiters */
    /* create a job for recruiters */
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/create',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    /* fetch all jobs created by a recruiter */
    getAllCreatedJobs: builder.query({
      query: () => '/getAllCreated',
      providesTags: ['Job'],
    }),
    /* delete a job for recruiters*/
    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/${jobId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
    /* update Job Status for recruiters*/
    updateJobStatus: builder.mutation({
      query: ({ jobId, status }) => ({
        url: `/${jobId}/updateJobStatus`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Job'],
    }),
    /* update Applicant Status in a Job for recruiters*/
    updateApplicantStatus: builder.mutation({
      query: ({ jobId, applicantId, status }) => ({
        url: `/${jobId}/applicants/${applicantId}/updateApplicantStatus`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Applicant'],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useApplyToJobMutation,
  useGetAppliedJobsQuery,

  useCreateJobMutation,
  useGetAllCreatedJobsQuery,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
  useUpdateApplicantStatusMutation,
} = jobsApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const applicantsApi = createApi({
  reducerPath: 'applicantsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/applicants/',
    credentials: 'include',
  }),
  tagTypes: ['Applicant'],
  endpoints: (build) => ({
    registerApplicant: build.mutation({
      query: (applicantData) => ({
        url: '/register',
        method: 'POST',
        body: applicantData,
      }),
      invalidatesTags: ['Applicant'],
    }),
    loginApplicant: build.mutation({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: ['Applicant'],
    }),
    logoutApplicant: build.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Applicant'],
    }),
    deleteApplicant: build.mutation({
      query: () => ({
        url: '/delete',
        method: 'DELETE',
      }),
      invalidatesTags: ['Applicant'],
    }),
  }),
});

export const {
  useRegisterApplicantMutation,
  useLoginApplicantMutation,
  useLogoutApplicantMutation,
  useDeleteApplicantMutation,
} = applicantsApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recruitersApi = createApi({
  reducerPath: 'recruitersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/recruiters/',
    credentials: 'include' /* ensures cookies (JWT) are sent */,
  }),
  tagTypes: ['Recruiter'],
  endpoints: (build) => ({
    registerRecruiter: build.mutation({
      query: (recruiterData) => ({
        url: '/register',
        method: 'POST',
        body: recruiterData,
      }),
      invalidatesTags: ['Recruiter'],
    }),
    loginRecruiter: build.mutation({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: ['Recruiter'],
    }),
    logoutRecruiter: build.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Recruiter'],
    }),
    deleteRecruiter: build.mutation({
      query: () => ({
        url: '/delete',
        method: 'DELETE',
      }),
      invalidatesTags: ['Recruiter'],
    }),
  }),
});

export const {
  useRegisterRecruiterMutation,
  useLoginRecruiterMutation,
  useLogoutRecruiterMutation,
  useDeleteRecruiterMutation,
} = recruitersApi;

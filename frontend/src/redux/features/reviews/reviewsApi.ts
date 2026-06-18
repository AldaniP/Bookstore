import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

console.log("Backend URL:", getBaseUrl());

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/reviews`,
  }),
  tagTypes: ["Reviews"],

  endpoints: (builder) => ({
    getReviewsByBook: builder.query({
      query: (bookId) => `/${bookId}`,
      providesTags: ["Reviews"],
    }),

    createReview: builder.mutation({
      query: (review) => ({
        url: "/",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsByBookQuery,
  useCreateReviewMutation,
} = reviewsApi;
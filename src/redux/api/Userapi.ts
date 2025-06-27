import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UpdateUserRoleRequest,
} from "../../types/api-types";
import { User } from "../../types/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user`,
    // credentials: "include",
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    // ✅ Register / Login Mutation
    loginUser: builder.mutation<MessageResponse, User>({
      query: (userData) => ({
        url: "new",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["users"],
    }),

    // ✅ Delete User Mutation
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    // ✅ Get All Users Query
    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),

    // ✅ Update User Role Mutation (correctly placed inside endpoints)
  updateUserRole: builder.mutation<MessageResponse, UpdateUserRoleRequest>({
  query: ({ userId, role }) => ({
    url: `${userId}/role`,
    method: "PUT",
    body: { role }, // ✅ Send plain JSON
    headers: {
      "Content-Type": "application/json", // ✅ Matches backend expectations
    },
  }),
  invalidatesTags: ["users"],
}),

  }),
});

// ✅ Axios helper function (Optional)
export const getUser = async (id: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

// ✅ Export hooks
export const {
  useLoginUserMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} = userApi;

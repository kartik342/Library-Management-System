import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {  
    users: [],
    loading: false,
  },
    reducers: {
        fetchAllUsersRequest: (state) => {
            state.loading = true;
        },
        fetchAllUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed: (state, action) => {
            state.loading = false;
        },
        addNewAdminRequest: (state) => {
            state.loading = true;
        },
        addNewAdminSuccess: (state, action) => {
            state.loading = false;
        },
        addNewAdminFailed: (state, action) => {
            state.loading = false;
        },

    },
});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    
    await axios.get("http://localhost:4000/api/v1/user/all", { withCredentials: true })
    .then((response) => {
        dispatch(userSlice.actions.fetchAllUsersSuccess(response.data.users));
    })
    .catch((error) => {
        dispatch(userSlice.actions.fetchAllUsersFailed(error.response.data.message));
    });
};

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    
    await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, { 
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
     })
    .then((response) => {
        dispatch(userSlice.actions.addNewAdminSuccess());
        toast.success(response.data.message);
    })
    .catch((error) => {
        dispatch(userSlice.actions.addNewAdminFailed());
        toast.error(error.response.data.message);
    });
};

export default userSlice.reducer;
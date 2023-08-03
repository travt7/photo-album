import { createAsyncThunk } from "@reduxjs/toolkit";
//to make a request to the API JSON server, I'm going 
//to use a library called Axios. Axios is a promise based
//HTTP client for the browser and node.js. It's a library
//that makes it easy to make HTTP requests to external
//resources. It's a library that is commonly used in React
//applications. 
import axios from 'axios';

//Async Thunk Functions automatically dispatch actions during data loading
//request lifecycle. 
//create thunk to fetch users from API
//first argument is a string that describes what I'm trying
//to fetch. Its referred to as our base action type. It's 
//used to generate the action types that are dispatched when
//the API call begins.
//second argument is an async function that will make the request
//The unwrap() function is not a built-in JavaScript function, 
//but rather a method provided by the Redux Toolkit library. 
//It is typically used with Redux Toolkit's createAsyncThunk function to handle promises returned by asynchronous thunks.
const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    //request logic goes here. Making a request to the API JSON server
    //going to get back the response object. From the async function
    //going to return the data I want to use inside of my usersSlice
    //reducer function. In this case, I want to return the array of users.
    const response = await axios.get('http://localhost:3005/users');
    //when we make the get request to the API JSON server, we get back a response
    //object that has a data property. The data that gets sent back to use is available
    //to us on the response.data property. //response.data === [{id: 1, name: 'Myra'}]
    //Need to access array of user objects [{id: 1, name: 'Myra'}] inside of my usersSlice reducer function
    //in order to update the state of my users slice. 

    //DEV ONLY!!!
    await pause(1000);//pause for 1 second before returning the response.data

    return response.data;//creates a pending action object with the payload property set to the response.data
});

//DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};
//doing this to make sure that the loading spinner is displayed


//export the fetchUsers thunk function
export { fetchUsers };





//first arg is base action type used to generate action types sent to dispatch function when API call begins
//the template is the string we just typed in, and the suffixes are the three different action types that will be dispatched
//when the API call begins, when the API call succeeds, and when the API call fails. Pending, fulfilled, and rejected are the
//default suffixes that are used when we don't provide any custom suffixes.

//so the action type that will be dispatched when the API call begins will be users/fetchUsers/pending
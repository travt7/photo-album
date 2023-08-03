//1. create a new file for the thunk and name it after the purpose of the request
//2. create the thunk and give it a base type that describes the purpose of the request
//3. inside of the thunk, make the request to the API JSON server and return the data that you want to use inside of your reducer function
//4. open the slice file usersSlice.js. In the slice file, add extra reducers to handle the pending, fulfilled, and rejected action types. watching for 
//the action types that are automatically dispatched when the API call begins, when the API call succeeds, and when the API call fails. These are made by the createAsyncThunk.
//5. export the thunk from the store/index.js file so that it can be imported into the component file
//6. import the thunk into the component file and dispatch it from inside of the useEffect hook

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { faker } from '@faker-js/faker';

const addUser = createAsyncThunk('users/add', async () => {
    const response = await axios.post('http://localhost:3005/users', {
        //the second argument is the data that we want to send to the API JSON server
        //it's an object that has a name property. The fulfilled action object's payload property will be the user object that was created
        //ie {id: 2, name: 'Ervin'}
        name: faker.person.fullName()
    });
    return response.data;
    //whatever we return here will show up inside of the users/add/fulfilled action object's payload property
    //the API will send back the user object that was created ie {id: 2, name: 'Ervin'} and is available on the response.data property
});
//first argument is the base action type used to generate action types sent to dispatch function when API call begins
//thunk functions generate their own action types not inherented from the slice file action types and the payload property
//of the action object will be the data that is returned from the async function. 

//inside of 2nd argument is an async function that will create a new user
//and send a post request to the API JSON server.

//export the addUser thunk function
export { addUser };
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const removeUser = createAsyncThunk('users/remove', async (user) => {
    //***if we don't pass an arg to our use-thunk hook it won't receive an arg here***
    await axios.delete(`http://localhost:3005/users/${user.id}`);
    //We are making the big assumption that we will pass in an argument called user to the removeUser thunk function
    //SO we need to pass the user object into the doRemoveUser function in the UsersListItem.js file which is called when the user clicks on the delete button

    //FIXME: DEV ONLY!!! 
    // because if you write out this return statement for the delete request, the API JSON server will send back an empty object
    //return response.data;//whatever we return here will show up inside of the users/remove/fulfilled action object's payload property
    //action.payload inside of our reducer function removeUser.fulfilled will be an empty object. Whenever we make a delete request to the API JSON server
    //it will send back an empty object. So response.data will be an empty object and we dont get any information about who is supposed to be deleted.
    //Instead of returning response.data that is empty, we need to return the user object that we passed into the removeUser thunk function as an argument
    return user;
    //Now when we get that removeUser.fulfilled action dispatched, now our payload property will be the id and name properties of the user object that was just deleted
    //And now it's much easier for us to go through our data array and find that particular user object and remove it from the array
});

export { removeUser };

//looking up the user object by id and sending a delete request to the API JSON server
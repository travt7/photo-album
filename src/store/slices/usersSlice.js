//Store a list of users that will change over time as we fetch
//data from the API and create new users to the list and delete
//existing users from the list. Goal of this slice is to manage
//everything related to users in our application.
import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from '../thunks/fetchUsers';
import { addUser } from '../thunks/addUser';
import { removeUser } from '../thunks/removeUser';

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        //first we need to store a list of users. We get the list of users from the API JSON server 
        //and we will store it in the data array. So we will initialize the data array to an empty array
        //list of users that will change over time as we fetch data from the API, 
        //create new users to the list, and delete existing users from the list 
        data: [],
        //will eventually have some other pieces of state that are tied to users
        //so initial state object will expand over time
        isLoading: false,
        error: null
    },
    //reducers: {} removing reducers object because we're going to use the createAsyncThunk function
    //to create a thunk function that will dispatch actions for us during the data loading request lifecycle
    //reducers: {} will be replaced by extraReducers: {}
    //extraReducers: {} is an object that allows us to listen for the action types that are dispatched by the
    //fetchUsers and addUsers thunk functions.

    //extraReducers allows us to watch for actions that are being dispatched that are not inherently tied to this slice. 
    //In this case, we're watching for 3 different action types: users/fetchUsers/pending, users/fetchUsers/fulfilled, and
    //users/fetchUsers/rejected. The `extraReducers` field in this `createSlice` function is used to define how the state should be updated
    // based on the different actions dispatched by the thunk(fetchUsers and addUser). In this case, the state is updated to reflect
    // the loading status, the fetched data, and any errors that occur during the async operation.
    extraReducers(builder) {
        //here we tell Redux Toolkit to watch for those 3 different action types that are dispatched by the fetchUsers and addUsers thunk functions
        //and then update the state of our users slice based on the action type that is dispatched.
        builder.addCase(fetchUsers.pending, (state, action) => {
            //Update state object to show the user that we're currently loading data from the API
            state.isLoading = true;

        });
        //addCase() takes 2 arguments: the action type that we want to listen for and a reducer function.
        //A big part of Redux Toolkit for us to NOT have to write out the action types manually. So when you create that thunk function
        //in the fetchUsers.js and addUsers.js files, the fetchUsers and addUsers variables will have 3 properties on them: pending, fulfilled, and rejected. Those 3
        //properties are the automatically generated action types that are dispatched by the fetchUsers and addUsers thunk functions. So we can
        //access those 3 properties on the fetchUsers and addUsers variables and pass them into the addCase() function. So instead of having to
        //manually type out the action type strings, we can refer to the automatically created properties(we don't see them being created) and access them on the 
        //fetchUsers and addUsers variables. 

        //The second argument to the addCase() function is a reducer function. These reducer functions are what gets executed when we see 
        //an action with these particular types. So when we see an action with the type users/fetchUsers/pending, we want to execute this reducer function.

        //The reducer function takes 2 arguments: the current state of the users slice and the action object that was dispatched. It makes an 
        //update to the state object based on the action object that was dispatched. Optionally we can return a new state object from the reducer function
        //and that new state object will replace the existing state object. But we don't have to return the object because we're using the immer library.

        builder.addCase(fetchUsers.fulfilled, (state, action) => {//action.payload contains the data that we got back from the API
            //Update state object to show the user that we finished loading data from the API(the request succeeded)
            //also need to update the data property on the state object to be the array of users that we got back from the API
            state.isLoading = false;
            //replace whatever the current data property is, with the data that we just fetched from the API
            state.data = action.payload;
            //data is empty array until the fetchUsers thunk function is run by passing fetchUsers to the dispatch() function. And we use the
            //useThunk hook to dispatch the fetchUsers thunk function and then we get the data back from the API and then we update the data property 
            //back inside of our fetchUsers thunk function, we made the request, then returned response.data. AND whatever we return from the 
            //thunk function, will be automatically assigned to the payload property of the users/fetchUsers/fulfilled action type. 

        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            //Update state object to show the user that we finished loading data from the API(the request failed)
            //also need to update the error property on the state object to be the error that we got back from the API
            state.isLoading = false;
            //when the request fails, an error object is automatically created for us and added on to the error property of the action object
            //that contains a message as to why the request failed. Take that object and assign it to the error property on the state object
            state.error = action.error;

        });

        //addUser reducer function will be executed when we see an action with the type users/addUser/pending and it will update the state object
        builder.addCase(addUser.pending, (state, action) => {
            //Update state object to show the user that we're currently loading data from the API
            state.isLoading = true;

        });
        //addCase() takes 2 arguments: the action type that we want to listen for and a reducer function. Here the reducer function takes 2 arguments:
        //the current state of the users slice and the action object that was dispatched. It makes an update to the state object based on the action object
        //that was dispatched by the addUser thunk function. 
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.isLoading = false;
            //add the new user that is available on the action object's payload property to the data array list of user objects
            state.data.push(action.payload);
            //back inside of our addUser thunk function, we made the request, then returned response.data. AND whatever we return from the 
            //thunk function called addUser, will be automatically assigned to the payload property of the users/addUser/fulfilled action type.
            //**payload property is the user object with a name property that was created because of the post request in the addUser thunk function
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error;//action.error property contains the error object that was created when the request failed

        });

        builder.addCase(removeUser.pending, (state, action) => {
            state.isLoading = true;
        });
        //made the fix to removeUser thunk function so now it returns the user object that was deleted from the API. So now action.payload will be the user object
        //that has an id and name properties that was deleted from the API. 
        builder.addCase(removeUser.fulfilled, (state, action) => {
            state.isLoading = false;
            //FIX ME!!!
            state.data = state.data.filter((user) => {
                return user.id !== action.payload.id;
            });
            //take a look at each user object in the data array and if the user object's id property does not match the id property of the user object that was
            //deleted from the API, then return that user object and add it to the new data array. 

        });
        builder.addCase(removeUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        });

    }
});

//export the combined reducer function that is created when this slice is created
export const usersReducer = usersSlice.reducer;
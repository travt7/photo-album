import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { usersReducer } from "./slices/usersSlice";
import { albumsApi } from "./apis/albumsApi";
import { photosApi } from "./apis/photosApi";


//export the store that is created when we call configureStore
//so we can wire it up to the react side of our application
//Now we have 2 reducers in our store. The usersReducer and the reducer that is returned from the albumsApi.reducer property. 
//So we have 2 keys in our BIG STORE reducer object. The users key and the albums key. The value of the users key is the usersReducer function.
//The value of the albums key is the reducer that is returned from the albumsApi.reducer property. We are managing 2 different pieces of state in our store.
//We are managing the users state. The albums state/key and the value assigned to it is being managed by the albumsApi using Redux Toolkit Query. We don't have to write any reducer functions for the albums state.
export const store = configureStore({
    reducer: {
        users: usersReducer,
        [albumsApi.reducerPath]: albumsApi.reducer,
        //this says go and look up the reducer path property on the albumsApi object. It is a string that says 'albums'
        //located in the store/apis/albumsApi.js file. And whatever that string is, put a new key inside of this reducer object
        //with that string as the key name and the value is the reducer that is returned from the albumsApi.reducer property.
        //So this is a way to dynamically add a key to the reducer object so we don't have to hardcode it as albums: albumsApi.reducer
        [photosApi.reducerPath]: photosApi.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(albumsApi.middleware).concat(photosApi.middleware);
        //getDefaultMiddleware is a function that returns an array of middleware that is automatically added to the store that gets 
        //the Api to work nicely with the store. 
    }
});

//window.store = store;//this is for debugging purposes. So we can mess around with the store from the browser console during development.

setupListeners(store.dispatch);//this is a function that takes in the dispatch function from the store and sets up the listeners

//reason we import/export in this store index.js file is that if we allow our components to import
//from individual files/slices/thunks inside the store folder, we end up
//with messy components. So I'm using my store index.js file as my central
//export point for everything related to the Redux store. So all of my components
//can import from this index.js file without going into any other files inside the store folder.

export * from './thunks/fetchUsers';
//this syntax means find everything that gets exported from the fetchUsers.js file
//and export it from the index.js file as well.
export * from './thunks/addUser';
export * from './thunks/removeUser';//need to export the removeUser thunk function from the store index.js file
//so that we can import it into the UsersList.js file. Create a delete button in the UsersList.js file
//that will call the removeUser thunk function when clicked.

//we need to export the useFetchAlbumsQuery hook from the store index.js file so that we can import it into the UsersListItem.js file
//and use it to fetch the albums for a user when the user clicks on the expand button.
export { useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation } from './apis/albumsApi';
//we need to export the useFetchPhotosQuery hook from the store index.js file so that we can import it into the PhotosList.js component 
//and use it to fetch the photos for an album when the user clicks on the expand button.
export { useFetchPhotosQuery, useAddPhotoMutation, useRemovePhotoMutation } from './apis/photosApi';

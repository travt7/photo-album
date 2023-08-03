import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';

//make a variable called albumsApi that is the result of calling createApi function
//pass in a configuation object to createApi function
//3 required properties on the configuration object: baseQuery, reducerPath, tagTypes

//DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const albumsApi = createApi({
    reducerPath: 'albums',
    baseQuery: fetchBaseQuery({
        //put in configuration object for fetchBaseQuery function
        //gives us a pre-configured fetch function that will be used to make all of our requests
        baseUrl: 'http://localhost:3005',
        //root url for the server that we are making requests to
        //where is our server hosted at? We are hosting our server at the same place that we are hosting our client in our case.
        fetchFn: async (...args) => {
            //REMOVE FOR PRODUCTION!!! Any request we make tied to the albumsApi will be delayed by 1 second.
            await pause(1000);
            return fetch(...args);
        }
    }),
    //anytime we need to tell Redux Toolkit Query how to make another kind of request, we will add
    //another property(a new key) to this endpoints configuration object. 
    endpoints(builder) {
        return {
            removeAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    //we provided album to the mutation function when we called it in the AlbumsListItem component in handleRemoveAlbum function.
                    //console.log(album);notice there is a userId property on the album object. We need to mark the fetchAlbums query as out of date for the user that we just deleted an album for.
                    return [{ type: 'Album', id: album.id }];//whenever we remove an album we want return an object that looks like this from our invalidateTags function to mark the fetchAlbums 
                    //query as out of date for the album that we just deleted. It matches up with one of the album objects returned from the map function in the fetchAlbums providesTags function. 
                    //And if just one object is matched it will invalidate the entire query.   
                    //return [{ type: 'Album', id: album.userId }];//but what would we do if the album object didn't have the userId property that we put on the addAlbum mutation request body below?
                    //How would we create the appropriate tag invalidation object to mark the fetchAlbums query as out of date? Because we have no idea who owns this album inside of this 
                    //invalidatesTags function without the userId property.  
                },
                query: (album) => {//no user object passed in as an argument to this query function because we don't need it. We only need the album object's id property.
                    return {
                        url: `/albums/${album.id}`,
                        method: 'DELETE',
                    };
                },

            }),
            //mutation function is used to make a POST request to the server that will change some data on the server
            addAlbum: builder.mutation({
                //tags can be strings or an object with an id/type property
                invalidatesTags: (result, error, user) => {//3rd arg is whatever you pass into the mutation function in AlbumsList component. But we don't pass in an arg
                    //to the hook. Instead we call addAlbum inside of a click event handler. And whatever you pass into addAlbum is what will be passed into this invalidatesTags function.
                    return [{ type: 'UsersAlbums', id: user.id }];
                    //invalidatesTags says we want to find all of the queries we have ever made that have the tag of 'UsersAlbums'. After running the addAlbum mutation function, we will go find the 
                    //query that we executed previously(in our case the fetchAlbums query) that has a tag of 'UsersAlbums' and mark it as out of date. When we mark the fetchAlbums query as out of date,
                    //we will wipe away the data that we previously fetched for that fetchAlbums query. Then we will make the same request we made previously with the exact same user argument. Essentially 
                    //we will refetch the albums for the user that we just added an album for.

                    //So the idea behind the tag system is we will mark certain endpoints with a string and then when we run a specific mutation, we will find all the queries that have been made with 
                    //that same tag and mark them as out of date. Then we will refetch them. So we will mark the fetchAlbums query as out of date and then refetch it automatically.
                },
                //['Albums'],//so when we run this mutation function, we will go find all of the queries that make use of this tag, mark them as 
                //out of date, and then refetch them. Problem is if every query that we make to fetchAlbums is marked with the same tag, then when we run this mutation function
                //and mark all of the queries as out of date, we will refetch all of the queries. We only want to refetch the query that is tied to the user that we just added an album for.

                //think of this query function that we have defined in the addAlbum key and fetchAlbums key as a function
                //being used to tell Redux Toolkit Query about some parameters to USE for the request. When we make the
                //request, we need to know what user to tie this album to. 
                query: (user) => {//only receiving user object bc we need it in the request body because we need to know what user to tie this album to.
                    return {
                        url: '/albums',
                        method: 'POST',
                        body: {
                            //body property is an object that will be converted into JSON and sent to the server
                            //when we make the request.
                            userId: user.id,
                            title: faker.commerce.productName(),
                            //faker.commerce.productName() is a function that will generate a random product/album name
                        },
                    };
                },
            }),
            fetchAlbums: builder.query({
                //tags can be strings or an object with type and id properties but we want to provide a dynamic set of tags. When you define 
                //the providesTags property, and put in an array of strings, it kind of hard codes the tags that are going to be used for this query. So we want to calculate the tags
                //on the fly so replace the array with a function instead. Then return an array that has my dynamically generated tags for whatever user we are passing in to 
                //useFetchAlbumsQuery(user) hook that we are fetching the albums for. 

                //result is the data we fetch from the backend server and in our case it is an array of albums. For every album in the result array we return an object that has a type property
                //of 'Album' and an id property of album.id. So we are generating an array of objects that have a type property of 'Album' and an id property of the album id. So we are generating
                //an array of tags, one for each album in the result array. So if we have 3 albums in the result array, we will generate an array of 3 tags elements. Now we have a dynamic set of tags. 
                //Now add another element on that array, a tag for the user that we are fetching the albums for. 
                providesTags: (result, error, user) => {
                    const tags = result.map((album) => {
                        return { type: 'Album', id: album.id }
                    });
                    tags.push({ type: 'UsersAlbums', id: user.id });
                    return tags;//Now we have all of the tags that we need to mark the fetchAlbums query as out of date. We have a tag for each album in the result array and a tag for the user that we 
                    //are fetching the albums for.
                    //return [{ type: 'Album', id: user.id }];
                },//the user arg is whatever we pass in as an argument to the useFetchAlbumsQuery hook back inside of the AlbumsList component.

                //['Albums'],//generally name it after the resource you are fetching/resource you are working with
                //now EVERY QUERY we make to fetchAlbums is going to be marked with the tag 'Albums' which is a problem because
                //when we run the addAlbum mutation function, we will go find all of the queries that make use of this tag, mark them as
                //out of date, and then refetch them. We only want to refetch the query that is tied to the user that we just added an album for.
                //So we need to add a tag to the fetchAlbums query that is unique to the user that we are fetching the albums for. So we will add a tagTypes property to the configuration object

                query: (user) => {//only receiving user object bc we need it to customize some aspects of the request. We need to know what user to fetch the albums for.
                    return {
                        url: '/albums',
                        params: {
                            userId: user.id,
                        },
                        method: 'GET',
                    };
                },
            }),
        };
    },
});
//GOAL of Query function is to specify exactly how to make the request to the server
//Super critical part is fetchAlbums and addAlbum keys. When we create an Api, we get back a slice of state,
//thunks, action creators, and a set of automatically generated hooks. The fetchAlbums and addAlbum keys are
//used as a template for deciding what the name of a hook should be. 

//albumsApi.useFetchAlbumsQuery();

export const { useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation } = albumsApi;
export { albumsApi };
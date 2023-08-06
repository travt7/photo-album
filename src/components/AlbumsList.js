import { useFetchAlbumsQuery, useAddAlbumMutation } from '../store';
import Skeleton from './Skeleton';
//import ExpandablePanel from './ExpandablePanel';
import Button from './Button';
import AlbumsListItem from './AlbumsListItem';

function AlbumsList({ user }) {
    //this is me practicing github DELETE LATER
    //user is passed in as a prop to the AlbumsList component from the UsersListItem component because we want to fetch the albums that are tied to that particular user.

    //fetching data with a query and changing data with a mutation. Queries run immediately(default behavior) when the AlbumsList is rendered on the screen. AlbumsList is a children prop of Expandable Panel
    //and is rendered to the screen when isExpanded state in Expandable Panel is truthy(meaning user clicked on arrow next to user) 
    //We can tell a query hook to delay that fetching operation but usually when we show a component we want to immediately fetch some data. 
    //frequently referred to as the results object with properties that describe the data fetching process along with the actual data that was fetched.
    const { data, error, isFetching } = useFetchAlbumsQuery(user);//an object is returned from this hook. We can destructure the object and get the data, isLoading, error properties.
    //need to specify which user we want to fetch the albums for. So we will pass in the user object as an argument to the useFetchAlbumsQuery hook.

    //automatic data refetching using the tag system. We can tell the useFetchAlbumsQuery hook to use a tag to identify the data 
    //that is being fetched.

    //Mutations give you a function to run when you want to change some data on the server. When do you want to run that function and change data? Usually we want to change data
    //on the server in response to some user interaction. Such as when a user clicks on a button, types something into a text box, or submits a form etc. 
    const [addAlbum, results] = useAddAlbumMutation();//useAddAlbumMutation hook returns an array with two elements. The first element is a function that we can call to run the mutation
    //and then it actually gets executed. The second element is an object that contains the results of the mutation. It's an object very similar to the one that gets returned from 
    //the useFetchAlbumsQuery hook. It has a data property, an error property, and an isLoading property and a few other properties as well.

    //console.log(results);//the console says uninitialized because we have not yet executed this mutation function. We have not yet called the addAlbum function. We call the addAlbum function
    //when the user clicks on the add album button. Then yes the request body is made to the server and we get the response back. Then our application needs to do something with the results 
    //of the mutation/response from the server of the newly created album.    

    const handleAddAlbum = () => {
        addAlbum(user);//we add the user id to the body of the request that we send to the server. We need to know what user to tie this album to.
    }
    //need to detect whenever we are in the process of making a request to the server to add an album. So make use of the isLoading property on the results object when we call the 
    //useAddAlbumMutation hook. isLoading is going to be set to true whenever we are in the process of making a request to the server to add an album. Pass the isLoading property as a prop
    //to the Button component. 

    let content;
    if (isFetching) {
        content = <Skeleton className='h-10 w-full' times={3} />;
    } else if (error) {
        content = <div>Error loading albums.</div>
    } else {
        //AlbumsList is only displayed when we expand one of the user panels. So we only want to show the albums for a user when the user clicks on the expand button.
        //But we can have all the user panels expanded at the same time. This means that we will have multiple AlbumsList components rendered on the screen at the same time and useFetchAlbumsQuery
        //hook will be called multiple times. So we will have multiple queries running at the same time. So we need to make sure that when we run the addAlbum mutation function, we mark the query
        //that we ran to fetch the albums for THAT particular user as out of date. We don't want to mark all of the queries as out of date. We only want to mark the query that we ran to fetch the albums
        //for that particular user as out of date. So we need to pass in the user object as an argument to the useFetchAlbumsQuery hook. Then we need to pass in the user object as an argument to the
        //addAlbum mutation function. Then we need to pass in the user object as an argument to the invalidatesTags function. 
        //Each user passed to AlbumsList by UsersListItem makes a separate call to useFetchAlbumsQuery hook because there can be several AlbumsList components rendered on the screen at the same
        //time. So a separate query is issued for each user's albums hook that we call. So we 
        //need to make sure that when we call addAlbum mutation for a particular user, we mark ONLY THAT PARTICULAR USER'S ALBUMS AS OUT OF DATE, or user's query as being stale
        //or expired. We don't want to mark all of the users' albums as out of date. We only want to mark the albums for the user that we just added an album for as out of date so we go and 
        //refetch the list of albums(with the new album included). Grider 395 
        content = data.map((album) => {
            return <AlbumsListItem key={album.id} album={album} />;
        });
    }
    //we return an ExpandablePanel component for each album that we get back from the server. We pass the album title as the header prop to the ExpandablePanel component. So each 
    //album has its own ExpandablePanel component. We pass the album title as the header prop and the album id as the key prop. The user the album is tied to is passed in as a prop and that
    //user has an id property on the user object. 
    //We will render the list of photos inside of the ExpandablePanel component when it is expanded. For now, we will just put the text "List of Photos in the Album" inside of the ExpandablePanel component.

    //we don't have to put it inside a useEffect hook because the useFetchAlbumsQuery hook
    //is already doing that for us. So we can just call it directly inside the component function.
    //We also don't have to put it inside of a click event handler because we want to fetch the albums
    //for a user whenever the AlbumsList component is rendered on the screen. So we can just call it and 
    //it will immediately try to fetch some data. In this case it will run the request to the server to
    //get all of the albums for the user that we pass in as a prop to the AlbumsList component.
    return <div>
        <div className='m-2 flex flex-row items-center justify-between'>
            <h3 className='text-lg font-bold'>Albums for {user.name}</h3>
            <Button loading={results.isLoading} onClick={handleAddAlbum}>
                + Add Album
            </Button>
        </div>
        <div>{content}</div>
    </div>;
}

//show this component inside of UsersListItem.js because 
//UsersListItem.js is responsible for rendering/displaying 
//one individual user in the list of users. So we need to pass
//down the user to AlbumsList that AlbumsList.js is going to show the albums for.

//Whenever this component is rendered on the screen, we want to fetch all the different albums 
//tied to that particular user passed in as a prop. This is where we want to fetch some data.
//So we need to use the useFetchAlbumsQuery hook from the store index.js file.
export default AlbumsList;
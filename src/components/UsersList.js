//when a user does something we are going to call dispatch 
//and pass in that thunk function in fetchUsers.js to it. And
//that's how we are going to run the fetchUsers thunk function 
//and make the API call to the API JSON server. We dispatch it.

//So we could call it from an event handler but that's not what I 
//want to do in this case. Want to make sure when component UsersList
//is first rendered to the screen, we go and fetch some data. Going to 
//use a useEffect hook. useEffect hook is a hook that allows us to run
//some code when a component is first rendered to the screen. So when
//the UsersList component is first rendered to the screen, we dispatch our
//fetchUsers thunk function and kick off the data loading process.

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store";
import Skeleton from "./Skeleton";
import Button from "./Button";
import { useThunk } from "../hooks/use-thunk";
//import addUser thunk function from the store/index.js file and also 
//import the Button component from the Button.js file to use in the JSX
//when adding a new user. When someone clicks on the button, we will dispatch
//the addUser thunk function and make the API call to the API JSON server.
import UsersListItem from "./UsersListItem";



function UsersList() {
    const [doFetchUsers, isLoadingUsers, isLoadingUsersError] = useThunk(fetchUsers);//useThunk hook returns an array with 3 elements: the runThunk function, the isLoading state, and the error state
    //const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    //whether or not we are currently loading users from the API JSON server. 
    //If true, show a loading indicator(Our Skeleton component). If false, don't show it.
    const [doCreateUser, isCreatingUser, isCreatingUserError] = useThunk(addUser);
    //Instead of declaring these 2 pieces of state, we will use the useThunk hook to do it for us.
    //const [isLoadingUsersError, setIsLoadingUsersError] = useState(null);
    //If we get an error(meaning not null)with our request to the API JSON server, update this piece of state
    //with the error message on the screen. If null, don't show it.
    //const [isCreatingUser, setIsCreatingUser] = useState(false);
    //const [isCreatingUserError, setIsCreatingUserError] = useState(null);
    //const dispatch = useDispatch();//don't need this anymore because we are using the useThunk hook
    //useSelector hook will give us access to the state of our Redux store. 
    //get access to the users slice of state which is an object that has {isLoading: false, data: [], error: null}
    //destructure out these properties from what gets returned from useSelector and use them to 
    //render/customize what this component actually displays.
    const { data } = useSelector((state) => {
        return state.users;
    });

    //To indicate we are about to start loading users and to change the state of the component
    //const [isLoadingUsers, setIsLoadingUsers] = useState(false); to show the Skeleton component loader
    //Right before we call dispatch(fetchUsers()), we will set isLoadingUsers to true.

    //All of the logic for fetching users from the API JSON server is now encapsulated in the useThunk hook. So when the component
    //is first rendered to the screen, all I have to do is call doFetchUsers() and it will run the thunk function and dispatch it
    useEffect(() => {
        doFetchUsers();
        //setIsLoadingUsers(true);//updated that state and in the next ms we will start the API fetchUsers call request
        //to the API JSON server. We need to know when that request is complete and change isLoadingUsers back to false.
        //dispatch the fetchUsers thunk function and call it
        //when the UsersList component is first rendered to the screen
        //dispatch(fetchUsers())
        //.unwrap()//unwrap the promise returned from the dispatch call that will follow the conventional promise chain
        //.then called only if the request succeeds/promise is fulfilled but we don't need it because we have .finally() to take care of setIsLoadingUsers
        //.catch((error) => setIsLoadingUsersError(error.toString()))
        //when request fails we need to make sure we set the loading state back to false. Either way
        //whether the request succeeds or fails, we need to set isLoadingUsers back to false(hiding the spinner)//called only if the request fails/promise is rejected, we will run this callback function
        //.finally(() => setIsLoadingUsers(false));//called no matter what, we will run this callback function

        //setIsLoadingUsers(false);//CANNOT DO THIS HERE without the unwrap.then.catch. The dispatch call is asynchronous by nature because it's making an API call request
        //to the API JSON server because we passed in the fetchUsers thunk function to dispatch. The fetchUsers thunk function is making
        //an API call request to the API JSON server at http://localhost:3005/users
        //. It will take some time to complete but we are not waiting on it to complete. So we are setting isLoadingUsers back to false before the API call request is complete.
        //So we need to add in some code to detect when the API call request is complete and then set isLoadingUsers back to false.
        //We can use .then() and .catch() to detect when the API call request is successful or when it fails. So we can use these
        //2 functions to update isLoadingUsers back to false and isLoadingUsersError to null.

    }, [doFetchUsers]);//to make esLint happy, BUT I don't need dispatch inside of the dependency array anymore
    //because I am using the useThunk hook to dispatch the thunk function for me. So I can remove dispatch from the dependency array.

    const handleUserAdd = () => {
        doCreateUser();
        //we don't need all of the code below because we are using the useThunk hook to dispatch the thunk function for us
        //pass in the addUser thunk function to dispatch and call it at the same time
        //when the user clicks on the button. This will make the API call to the API JSON server
        //setIsCreatingUser(true);//to kick off the loading indicator
        //dispatch(addUser())
        //.unwrap()
        //.catch((error) => setIsCreatingUserError(error.toString()))
        //.finally(() => setIsCreatingUser(false));
    };

    let content; //declare a variable called content and if we are loading users, we will assign the Skeleton component to it
    //otherwise if we are not loading users, but there is an error Im going to assign the div with the error message to it
    //otherwise if we are not loading users and there is no error, I will assign the data to it. 
    //if we are not loading users and there is no error, we will assign the renderedUsers list to the content variable
    //so the header and the button will always be visible on the screen and the content variable will change depending on the state of the component
    if (isLoadingUsers) {
        content = <Skeleton times={6} className='h-10 w-full' />;
    } else if (isLoadingUsersError) {
        content = <div>Error fetching data...</div>;
    } else {
        content = data.map((user) => {
            return (
                <UsersListItem key={user.id} user={user} />
            );
        });
    }
    //had to get the data from the users slice of state. The users slice of state had to get the data from the API JSON server at http://localhost:3005/users
    //using the fetchUsers thunk function. The fetchUsers thunk function had to get the data from the API JSON server at http://localhost:3005/users using the fetchUsers
    //async action creator function. The useThunk hook had to get the data from the API JSON server at http://localhost:3005/users using the fetchUsers 
    //async action creator function that was passed in as an argument to the useThunk hook.   

    //only show error text if loadingUsersError is not null meaning it's defined

    //if we get to this point, we know that the data has been fetched successfully
    //and we can render out the data.

    //UsersList is Fetching Users and Creating Users. For every user we fetch or create, we will render a UsersListItem component.
    return (
        <div>
            <div className="flex flex-row justify-between items-center m-3">
                <h1 className="m-2 text-xl">Users</h1>
                <Button loading={isCreatingUser} onClick={handleUserAdd}>
                    + Add User
                </Button>
                {isCreatingUserError && 'Error creating user'}
            </div>
            {content}
        </div >
    );
}
//if we are in the process of loading users, show the Skeleton component loader. If there is an error loading users, show the error text.
//if everything went ok and we fetched our data I want to show the data/list of users.

//If isCreatingUser is truthy, show the text 'Creating user...'. If falsy, show the button. This is a ternary expression. But instead
//of 'Creating user...', we want to show a loading indicator/spinner. I would also like to disable the button while the user is being created so
//the user can't click on the button multiple times and create multiple users. Pass the Button a prop called loading that tells the Button whether or not
//it should show a loading spinner and disable itself. If I pass in true to the loading prop then have the Button show a loading spinner and disable itself,
//disallowing any click events. I want the loading prop to be true when isCreatingUser is true. We have a piece of state isCreatingUser that keeps track of whether or not
//we are creating a user and pass that into the Button component as the loading prop. Open up the Button component and receive the loading prop and customize
//it's behavior based on whether or not the loading prop is true or false. 

//data is an array of user objects [{id: 1, name: 'Myra'}] that gets returned from the API JSON server. 
//We are going to map over this data array of user objects, render out each individual user object inside
//of a gray box/div. 
export default UsersList;
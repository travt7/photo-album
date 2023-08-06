//UsersList.js file is getting a little messy. So I'm going to create a new component called UsersListItem.js
//This component will be responsible for rendering a single user in the list of users.
//Pass the user object to the UsersListItem component as a prop.
import { GoTrashcan } from "react-icons/go";
import Button from "./Button";
import { removeUser } from "../store";
import { useThunk } from "../hooks/use-thunk";
import ExpandablePanel from "./ExpandablePanel";
import AlbumsList from "./AlbumsList";

function UsersListItem({ user }) {
    const [doRemoveUser, isLoading, error] = useThunk(removeUser);

    const handleClick = () => {
        doRemoveUser(user);
    };

    //we don't want a div in this case bc back inside ExpandablePanel.js the div that contains the header already has 
    //some classnames that are going to make everything inside that header line up right next to each other. 
    //So if we add a div here, we will lose that styling of "everything lining up next to each other". 
    //So we will use a React.Fragment that will allow us to take this bit of JSX markup and directly copy paste it into 
    //the header prop of the ExpandablePanel component without additional elements in between.
    const header = <>
        <Button className='mr-3' loading={isLoading} onClick={handleClick} >
            <GoTrashcan />
        </Button>
        {error && <div>Error deleting user...</div>}
        {user.name}
    </>;

    return (
        <ExpandablePanel header={header}>
            <AlbumsList user={user} />
        </ExpandablePanel>
    );
}
//practicing github DELETE
//If we delete the user object from the server, we want to remove the ExpandablePanel from the screen as well. And all of the
//content that is inside of the ExpandablePanel component. UsersListItem is only returned from the UsersList component if the user object is still on the server
//in the data array that we map over. So if the user is still on the server, we want to render the ExpandablePanel component. If the user is not on the server, we don't want to
//render the ExpandablePanel component for deleted user.
//So we will return the ExpandablePanel component function from UsersListItem.js. We will pass the header prop to the ExpandablePanel component.
//We have the header with the delete button and the user name that ExpandablePanel will render. Bc if we delete the user from the server the ExpandablePanel
//will still be rendered on the screen. If we delete the user from the server, we want to remove the ExpandablePanel from the screen as well. And all of the
//content that is inside of the ExpandablePanel component. Bc a UsersListItem is only returned from the UsersList component if the user is still on the server
//in the data array that we map over. So if the user is still on the server, we want to render the ExpandablePanel component. If the user is not on the server, we don't want to
//render the ExpandablePanel component for deleted user. So we will pass the header prop to the ExpandablePanel component. The header prop will be the JSX markup that we want to
//render inside of the header of the ExpandablePanel component. So we will put the delete button and the user name inside of the header prop.
//The content will be whatever we want to render
//inside of the panel when it is expanded. So we will just put the word CONTENT!!!! for now.

//to indicate to the Button component if it should show a loading spinner and disable itself, pass the Button component a prop called loading
//Finally, when user clicks on the button, we want to run our removeUser thunk function. So we need an onClick handler on the button and call
//doRemoveUser in our handleClick function.
export default UsersListItem;
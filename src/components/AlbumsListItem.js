import { GoTrashcan } from "react-icons/go";
import { useRemoveAlbumMutation } from "../store";
import Button from "./Button";
import ExpandablePanel from "./ExpandablePanel";
import PhotosList from "./PhotosList";

function AlbumsListItem({ album }) {
    //this is me practicing github DELETE LATER
    const [removeAlbum, results] = useRemoveAlbumMutation();
    //first element is a function that we can call to run the mutation. Results object tells us about the status of the mutation.

    const handleRemoveAlbum = () => {
        removeAlbum(album);
    }
    //as we are making the request to the server to remove the album, we want to disable the button so the user can't click on it multiple times and make multiple requests to the server.
    //react fragment here because we already have styling set up in ExpandablePanel component for the header. So we want to use that styling.
    const header = <>
        <Button className='mr-2' loading={results.isLoading} onClick={handleRemoveAlbum}>
            <GoTrashcan />
        </Button>
        {album.title}
    </>;

    return (
        <ExpandablePanel key={album.id} header={header}>
            <PhotosList album={album} />
        </ExpandablePanel>
    );
}

//right now the only way to see the updated list after deleting an album is to refresh the page. So we need to refetch the list of albums for the particular user that we just deleted an album for.
//To automate the update we need to use the tag system.

export default AlbumsListItem;
import { useFetchPhotosQuery, useAddPhotoMutation } from "../store";
//right now we dont have any photos to fetch from any user or any album so even if we run the useFetchPhotosQuery hook, we will get back an empty array. But I want to
//try and run the hook to see if everything is wired up correctly.
import Button from "./Button";
import Skeleton from "./Skeleton";
import PhotosListItem from "./PhotosListItem";

//Whenever we show this component on the screen we want to make a request and get all the different photos for that album. 

function PhotosList({ album }) {//destructuring the album object from the props object. Then taking destructuring data, isFetching, and error properties from the object that gets returned from 
    //the useFetchPhotosQuery hook.
    const { data, isFetching, error } = useFetchPhotosQuery(album);//since we provided an argument to the query and two mutations in photosApi.js, we need to provide an argument to the useFetchPhotosQuery hook as well. It 
    //will be the album object that we want to fetch the photos for. It means the album object we just provided will be taken and sent off to the fetchPhotos query function in photosApi.js. It will
    //show up as that argument in the query function. Then the query function will use that album object to find the album id and then it will use that album id to find the photos for that album.
    const [addPhoto, addPhotoResults] = useAddPhotoMutation();

    const handleAddPhoto = () => {
        addPhoto(album);//run the mutation by calling the addPhoto function
    };
    //going to take a look at data, isFetching, and error properties that get returned from the useFetchPhotosQuery hook.
    let content;
    if (isFetching) {
        content = <Skeleton className='h-8 w-8' times={4} />;
    } else if (error) {
        content = <div>Error loading photos...</div>;
    } else {
        content = data.map((photo) => {
            return <PhotosListItem key={photo.id} photo={photo} />;//pass the photo object as a prop to the PhotosListItem component so it can show some information about the photo.
        });
    }
    return (
        <div>
            <div className="m-2 flex flex-row items-center justify-between">
                <h3 className="text-lg font-bold">Photos In {album.title}</h3>
                <Button loading={addPhotoResults.isLoading} onClick={handleAddPhoto}>
                    + Add Photo
                </Button>
            </div>
            <div className="mx-8 flex flex-row flex-wrap justify-center">
                {content}
            </div>
        </div>
    );
}
//I want the Button to display loading spinner and disable itself whenever addPhotoResults.isLoading is truthy. When we are currently running the mutation we want to disable the button and 
//show the loading spinner. When the mutation is done running, we want to enable the button and hide the loading spinner.

export default PhotosList;
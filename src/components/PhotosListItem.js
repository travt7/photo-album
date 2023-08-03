import { GoTrashcan } from "react-icons/go";
import { useRemovePhotoMutation } from "../store";

function PhotosListItem({ photo }) {
    const [removePhoto] = useRemovePhotoMutation();//don't need results object bc not showing a loading spinner

    const handleRemovePhoto = () => {
        removePhoto(photo);//run the mutation by calling the removePhoto function and giving it the photo object as an argument that we
        //get from the props object.
    }

    return (
        <div onClick={handleRemovePhoto} className="relative cursor-pointer m-2">
            <img className="h-20 w-20" src={photo.url} alt="random pic" />
            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200 opacity-0 hover:opacity-80">
                <GoTrashcan className="text-3xl" />
            </div>
        </div >
    );
}

export default PhotosListItem;
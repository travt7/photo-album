import { useState } from "react";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";

function ExpandablePanel({ header, children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className="mb-2 border rounded">
            <div className="flex p-2 justify-between items-center">
                <div className="flex flex-row items-center justify-between">
                    {header}
                </div>
                <div onClick={handleClick} className="cursor-pointer">
                    {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
                </div>
            </div>
            {
                isExpanded && <div className="p-2 border-t">{children}</div>
            }
        </div>
    );
}
//delete button and header will be displayed by header prop
//need state to expand and collapse the panel

//when we expand a panel, we will fetch all of the albums related to that user
//and AlbumsList component has a prop called user that we can pass the user object to 
//so that the AlbumsList component can fetch the albums that are tied to that user.
//We use the children prop to render the content inside of the panel when it is expanded.
//the content displayed inside the bottom of the expandable panel component will be 
//rendered by the AlbumsList component. 
export default ExpandablePanel;
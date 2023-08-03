import classNames from "classnames";

//convenience thing to allow us to use this skeleton
//loader several times inside this application

//times(number) is how many grey boxes we want to show on the screen
//if we pass in a times prop of 1 we want to show one grey box on the screen
//we are generating a number of divs inside of an array and then we are
//returning that array of divs. Number of divs is whatever we pass in as the times prop

function Skeleton({ times, className }) {
    //we are creating these variables ahead of time so we can write out all of the classNames
    //and we can see them on the screen very easily. We could put them directly into the classNames
    //function call but it would be a little bit harder to read.
    //Goal of the className prop is to allow us to set the height and width of the boxes
    const outerClassNames = classNames('relative', 'overflow-hidden', 'bg-gray-200', 'rounded', 'mb-2.5', className);
    //set of classNames for the outer div
    const innerClassNames = classNames('animate-shimmer', 'absolute', 'inset-0', '-translate-x-full', 'bg-gradient-to-r', 'from-gray-200', 'via-white', 'to-gray-200');

    //underscore is a convention to indicate that we don't care about the value of the first argument
    //outer div stays steady and inner div moves to the right
    const boxes = Array(times).fill(0).map((_, i) => {
        return (
            <div key={i} className={outerClassNames}>
                <div className={innerClassNames}></div>
            </div >
        );
    });
    return boxes;
}
//this code above is the same as the code below but more concise. It creates a new array with the 
//number of items in it(length) equal to the times prop. We then iterate over that array and for 
//each element, we create and return a div for each item in the array. 

export default Skeleton;


/* function Skeleton({ times }) {
    const boxes = [];

    for (let i = 0; i < times; i++) {
        boxes.push(<div key={i}></div>)
    }
    return boxes;
} */
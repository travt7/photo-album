import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

//the arg is the thunk function that we want to run and dispatch. This custom hook
//It allows us to easily run our thunk functions fetchUsers and addUsers without having to write the same code over and over again
//for example in the useEffect hook and the handleUserAdd event handler for the button.
//and it will maintain the loading state and error state for us.
export function useThunk(thunk) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();//we need access to the dispatch function from inside hook. The dispatch function 
    //is used to run the thunk functions we pass in such as fetchUsers and addUser and update the loading state and error state
    const runThunk = useCallback((arg) => {
        setIsLoading(true);
        //dispatch the thunk function either fetchUsers or addUser or removeUser 
        dispatch(thunk(arg))
            .unwrap()
            .catch(err => setError(err))//if the promise returned from dispatch(thunk()) rejects, we will catch it here
            //and take the err argument and set the error state to that error message
            .finally(() => setIsLoading(false));//no matter what happens, we will set the loading state back to false
    }, [dispatch, thunk]);//the dependencies array is the second argument to the useCallback hook. Section 9 in Grider React course explains this.
    //It's used to help React understand that the function is not actually changing on rerender. So we need to pass in the dispatch function to dependencies array
    //because we are using it inside of the runThunk function. And we need to pass in the thunk function to the dependencies array because we are using it inside of the runThunk function
    //and we want to make sure that the runThunk function has a stable identity. A stable identity means that the runThunk function is not changing on rerender. 
    //Otherwise we would get an infinite loop of rerenders from the useEffect hook since we are calling runThunk doFetchUsers inside of the useEffect hook.
    //return the 3 things that my component cares about: the loading state isLoading, the error state error, and the runThunk function
    return [runThunk, isLoading, error];
}
//the useCallback hook allows us to create a function and only actually redefine that function if the dependencies change. To make sure we
//don't get an infinite loop of rerenders from the useEffect hook we need to return the runThunk function with a stable identity.
//useCallback hook: It's used to help React understand that the function is not actually changing on rerender. On the first render,
//we get the exact same function object every time. But the behavior is different for the second render.
//If the second argument is an empty array, useCallback gives you back the original function from first render. If second argument is not an empty array,
//and has elements that have changed since last render, useCallback gives you back a new function.

//If dispatch or thunk were not included in the dependencies array, the runThunk function would always refer to the initial values of dispatch and thunk that were present when
//the useCallback hook was initially called. Any changes to dispatch or thunk would not be reflected in the runThunk function, potentially leading to unexpected behavior or bugs.

//By including dispatch and thunk in the dependencies array, the runThunk function will be recreated whenever either of these values change.
//This ensures that the runThunk function has access to the most up-to-date values of dispatch and thunk whenever it is executed.
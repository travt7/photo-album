import className from 'classnames';
import { GoSync } from 'react-icons/go';

//create a button component that will be used in multiple places in our application.
function Button({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  loading,
  ...rest
}) {
  const classes = className(
    rest.className,
    'flex items-center px-3 py-1.5 border h-8',//border is always applied bc this is the fixed part of the button
    {
      'opacity-80': loading,//if loading is true, apply opacity-80 class. This will make the button look faded out giving visual feedback to the user that the button is disabled
      'border-blue-500 bg-blue-500 text-white': primary,
      'border-gray-900 bg-gray-900 text-white': secondary,
      'border-green-500 bg-green-500 text-white': success,
      'border-yellow-400 bg-yellow-400 text-white': warning,
      'border-red-500 bg-red-500 text-white': danger,
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-yellow-400': outline && warning,
      'text-red-500': outline && danger,
    }
  );

  return (
    <button {...rest} disabled={loading} className={classes}>
      {loading ? <GoSync className="animate-spin" /> : children}
    </button>
  );
}
//if loading is true that means we are in the process of creating a user and we want to show a loading spinner and disable the button.

//all html button elements have a disabled attribute/prop. If loading is true, the button will be disabled. Also, if loading is true, the button will have the opacity-80 class applied to it.
//Also if loading is true I don't want to show children. I want to show a loading icon/spinner.
//Children is a special prop that is passed into every component. Children is whatever is between the opening and closing tags of the component. In this case, the children prop is whatever 
//is between the opening and closing tags of the Button component. In this case, the children prop is the text '+ Add User' from the UsersList component.
Button.propTypes = {
  checkVariationValue: ({ primary, secondary, success, warning, danger }) => {
    const count =
      Number(!!primary) +
      Number(!!secondary) +
      Number(!!warning) +
      Number(!!success) +
      Number(!!danger);

    if (count > 1) {
      return new Error(
        'Only one of primary, secondary, success, warning, danger can be true'
      );
    }
  },
};

export default Button;

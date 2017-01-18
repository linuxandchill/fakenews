import React from 'react'; 

//Button component
const Button = ({onClick, className = '', children}) => {
  return(
    <button 
    onClick={onClick}
    className={className}
    type="button"
    > {children}
    </button> 
  )
}

export default Button; 

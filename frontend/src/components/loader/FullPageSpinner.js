import React from 'react';
import { IconContext } from "react-icons";
import { FaSpinner, FaBeer } from 'react-icons/fa';

import spinnerCss from './spinner.module.css';

const FullPageSpinner = () => {
  const { container, innerContainer } = spinnerCss;
  return (
    <IconContext.Provider
      value={{ color: '#812457', size: '30px' }}>
      <div className={container}>
        <span className={innerContainer}>
          <FaSpinner aria-label="loading" />

        </span>
      </div>
    </IconContext.Provider>


  );
};
export default FullPageSpinner;

import React, { Fragment, useEffect } from 'react'
import Navbar from '../header/Navbar';
const Insure = (props) => {
    useEffect(() => {
        console.log('props.location, pageType', props.history.location.pathname);
        return () => {
        }
    }, [])

    return (<Fragment>
        <Navbar />
        <div>How are you</div>
    </Fragment>);
}

export default Insure;
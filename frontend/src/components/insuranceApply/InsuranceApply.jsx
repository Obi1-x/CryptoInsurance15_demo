import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import Storage from '../../service/Storage';

const schemaNew = {
    insureName: Joi.string().optional().allow(""),
    estimatedCost: Joi.string().required().min(3).label("Industry."),
    estimatedTenure: Joi.string().required().min(3).label("Industry."),
}

const localData = new Storage();

const InsuranceApply = () => {
    return (<Fragment>
        <div>

            {/* title heading */}
            <div className="card">
                <h2 className="my-4">Insurance Application</h2>

                {/*  */}
            </div>
        </div>
    </Fragment>);
}

export default InsuranceApply;
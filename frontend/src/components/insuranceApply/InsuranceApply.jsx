import React, { Fragment, useEffect, useState } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import inputL from '../../assets/images/f_l_name.svg';
import {
    updateSchemaData, updateSubmitBTNState,
    storeInsurerPack
} from '../../store/actions/index';
import { HookForm } from '../form/Hookform';
import Storage from '../../service/Storage';
import generalCss from '../general.module.css';


const schemaNew = {
    // insureName: Joi.string().optional().allow("").label("Insure Name"),
    insureName: Joi.string().required().min(3).label("Insure Name"),
    estimatedCost: Joi.string().required().min(3).label("Estimated Cost"),
    estimatedTenure: Joi.string().required().min(1).label("Estimated Tenure"),
    insurerAddress: Joi.string().required().min(3).default('0x0fd46577').label("Insurer Engine Address"),
    initialDeposit: Joi.string().required().default(0).min(3).label("'Initial deposit(BUSD) 10%"),


}

const localData = new Storage();

const InsuranceApply = () => {

    const { centerDiv, divRelative, userImageBG, columnBox, has_search,
        employInfoLeftIn, dIcon_feedback, dIcon, formSubmitButton, formTitleBold, btnLoadIcon,
        formFieldContainer, validationErrMsg } = generalCss;
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        insureName: undefined, estimatedCost: undefined,
        estimatedTenure: undefined, insurerAddress: '0x0fd46577', initialDeposit: '0',
    });
    const { disableSubmitBtn, userDatar } = useSelector(state => ({
        disableSubmitBtn: state.submitBTN,
        userDatar: state.userData
    }));

    // initialiaze the schema data
    useEffect(() => {
        dispatch(updateSchemaData(schemaNew)); return () => { };
    }, []);

    async function checkDatad() {
        console.log('inputs', inputs);
        parseFloat(inputs.estimatedCost)
        if (inputs.estimatedCost) {

        }
        try {
            if (inputs.estimatedCost && inputs.estimatedTenure) {

                // SUBMIT_BTN_STATE
                dispatch(updateSubmitBTNState(true));
                await dispatch(storeInsurerPack({ ...inputs }));
            } else {
                toast.error("password does not match")
                dispatch(updateSubmitBTNState(false));
            }
        } catch (error) {
            console.log("server error encounter");
            dispatch(updateSubmitBTNState(false));

        }
    }

    const { renderHInput, renderHInputP, renderHInputDisabled, handleSubmit, renderHInputRequired, inputs, errors, renderButtonH, renderDropdownH, onEmployeeInformation, setInputs } = HookForm(checkDatad);

    useEffect(() => {

        setInputs({ ...userData })
        // setInputs({
        //     insureName: userData.insureName, estimatedCost: userData.estimatedCost, estimatedTenure: userData.estimatedTenure,
        //      });

        if (inputs.estimatedCost) {
            const fractionCost = parseFloat(inputs.estimatedCost);
            if (fractionCost.constructor.name === "Number") setInputs({ ...inputs, initialDeposit: fractionCost * 0.1 });

        } else { setInputs({ ...inputs, initialDeposit: 0 }); }
        console.log('inputs', inputs);
        return () => {

        }
    }, [setInputs, inputs.estimatedCost]);


    return (<Fragment>
        <div style={{ height: '100vh' }}>

            <div className={` ${centerDiv}`} style={{ justifyContent: 'center' }}>

                {/* title heading */}
                <div className={`card  `}>
                    <div className="px-4">
                        <h2 className="my-4">Insurance Application</h2>

                        {/*  */}
                        <form onSubmit={handleSubmit}>
                            <div className={` ${divRelative} `}>

                                <div className="py-4 ">
                                    <div className="row mb-4">

                                        <div className={`  form-group ${has_search}`}>
                                            {renderHInput('What to Insure', `${employInfoLeftIn} ${dIcon} mr-sm-2`, '', 'Name of good to insure', 'text', 'insureName', inputs, errors,
                                                <span className={`${dIcon_feedback} `}><img src={inputL} alt="bvn visual" width='15' /></span>)}

                                            {errors && errors.insureName ?
                                                <div className={` ${validationErrMsg}`}>{'invalid insurer Name '}</div> : ""}
                                        </div>


                                    </div>
                                    <div className="row">
                                        <div className={`form-group ${has_search} `}>
                                            {renderHInput('Estimated Cost', `${employInfoLeftIn} ${dIcon} mr-sm-2`, '', 'Estimated cost of insurance', 'text', 'estimatedCost', inputs, errors,
                                                <span className={`${dIcon_feedback} `}><img src={inputL} alt="estimate-cost" width='15' /></span>)}

                                            {/* error */}
                                            {errors && errors.estimatedCost ?
                                                <div className={` ${validationErrMsg}`}>{'invalid estimate cost '}</div> : ""}
                                        </div>
                                    </div>
                                    <div className="row my-4">
                                        <div className={` form-group ${has_search}`}>
                                            {renderHInput('Estimated Tenure', `${employInfoLeftIn} ${dIcon} mr-sm-2`, '', 'Estimated tenure f insurance', 'text', 'estimatedTenure', inputs, errors,
                                                <span className={`${dIcon_feedback} `}><img src={inputL} alt="estimate-cost" width='15' /></span>)}

                                            {/* error */}
                                            {errors && errors.estimatedTenure ?
                                                <div className={` ${validationErrMsg}`}>{'invalid estimate cost '}</div> : ""}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className={` form-group ${has_search}`}>
                                            {renderHInputDisabled('Initial deposit(BUSD) 10% of Estimated Cost', `${employInfoLeftIn} ${dIcon} mr-sm-2`, '', 'Estimated tenure f insurance', 'text', 'initialDeposit', inputs, errors,
                                                <span className={`${dIcon_feedback} `}><img src={inputL} alt="estimate-cost" width='15' /></span>)}

                                            {/* error */}
                                            {errors && errors.initialDeposit ?
                                                <div className={` ${validationErrMsg}`}>{'invalid initial deposit '}</div> : ""}
                                        </div>
                                    </div>

                                    <div className="row my-4">
                                        <div className={` form-group ${has_search}`}>
                                            {renderHInputDisabled('Insurer Engine Address', `${employInfoLeftIn} ${dIcon} mr-sm-2`, '', 'Insurer Engine Address', 'text', 'insurerAddress', inputs, errors,
                                                <span className={`${dIcon_feedback} `}><img src={inputL} alt="estimate-cost" width='15' /></span>)}

                                            {/* error */}
                                            {errors && errors.insurerAddress ?
                                                <div className={` ${validationErrMsg}`}>{'invalid insurer engine address '}</div> : ""}
                                        </div>
                                    </div>

                                    <div className="text-center" style={{ marginTop: '3vh', width: '100%' }} >
                                        {renderButtonH("", "Apply", `${formSubmitButton} ml-2`, disableSubmitBtn, "submit", {})}

                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </div>
    </Fragment>);
}

export default InsuranceApply;
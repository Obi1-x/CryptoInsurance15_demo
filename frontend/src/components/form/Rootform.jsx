import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Joi from 'joi-browser'

export const RootForm = callback => {
    const schemaH = useSelector(state => state.schemaDetail);
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [disabledButtonH, setDisabledButtonH] = useState(false);
    const [inputJob, setInputJob] = useState({});
    const [errorsJob, setErrorsJob] = useState({});

    const schemaJobH = {
        email: Joi.string().email().required().label("Email"),
        name: Joi.string().required().min(3).max(20).label("First Name"),
        position: Joi.string().required(),
        dob: Joi.string().min(2).required(),
        phone: Joi.string().min(11).max(14).required().label("Phone"),
    };


    const schemaSIH = {
        personalName: Joi.string().required().min(2).max(40).label("Employee Name"),
        personalDOB: Joi.string().min(2).required().label("DOB"),
        personalPhone: Joi.string().min(11).max(14).required().label("Personal Phone"),
        personalEmail: Joi.string().email().required().label("Personal Email"),
        employerName: Joi.string().required().min(2).max(40).label("Employee Name"),
        employerEmail: Joi.string().email().required().label("Email"),
        employerPhone: Joi.string().min(11).max(14).required().label("Phone"),
        employerID: Joi.string().required(),
        employerPosition: Joi.string().required().label("Position"),
        salary: Joi.string().optional().allow(''),
    };


    const handleSubmit = event => {
        if (event) {
            event.preventDefault();
            const errors = validate();
            // setErrors(errors =>({ ...errors, errors:errors || {} }));
            if (errors !== null) { setErrors(errors); }
            if (errors) return;
            callback();  // a callback function have to be present in the parameter unless this will throw an error
        }
    };


    const handleInputChange = event => {
        event.persist();
        const errorsH = { ...errors };

        const errorMessage = validateProperty(event.target);
        if (errorMessage) errorsH[event.target.name] = errorMessage;
        else delete errorsH[event.target.name];
        const inputsH = { ...inputs };
        inputsH[event.target.name] = event.target.value;
        setErrors(errorsH);

        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));

    };

    const validateProperty = ({ name, value },) => {
        const obj = { [name]: value };
        const schema = { [name]: schemaH[name] }

        const { error } = Joi.validate(obj, schema);
        console.log('error', error);
        return error ? error.details[0].message : null;
    }

    const validate = () => {
        const option = { abortEarly: false };
        const result = Joi.validate(inputs, schemaH, option);
        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details) {
            errors[item.path[0]] = item.message;
            return errors;
        }
    };

    const validateCheck = () => {
        const option = { abortEarly: false };
        const result = Joi.validate(inputs, schemaH, option);
        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details) {
            errors[item.path[0]] = item.message;
            if (Object.keys(errors).length > 0) {
                return Object.keys(errors)[0];
            } else { return null; }
        }
    };

    // handleCheckSubmitDisable() {
    //     let emptyField = 0;
    //     const option = { abortEarly: false };
    //     const result = Joi.validate(this.state.dataJob, this.schemaJob, option);
    //     if (result.error === null) { return null; }
    //     const errorsJob = {};

    //     for (let item of result.error.details) {
    //         errorsJob[item.path] = item.message;
    //         ++emptyField;
    //         if (Object.keys(errorsJob).length > 0) {

    //             // console.log(this.state.errorTransfer);
    //             return Object.keys(errorsJob)[0];
    //         } else { return null; }


    //     };

    // }

    // schemaJob
    const handleSubmitJob = event => {
        if (event) {
            event.preventDefault();
            const errorsJob = validateJob();
            if (errorsJob !== null) { setErrors(errorsJob); }
            if (errorsJob) return;
            callback();  // a callback function have to be present in the parameter unless this will throw an error
        }
    };


    const handleInputChangeJob = event => {
        event.persist();
        const errorsJobH = { ...errorsJob };
        const errorMessage = validatePropertyJob(event.target);
        if (errorMessage) errorsJobH[event.target.name] = errorMessage;
        else delete errorsJobH[event.target.name];
        const inputsJobH = { ...inputJob };
        inputsJobH[event.target.name] = event.target.value;
        setErrorsJob(errorsJobH);
        setInputs(inputJob => ({ ...inputJob, [event.target.name]: event.target.value }));
    };

    const validatePropertyJob = ({ name, value }, schemaJobH) => {
        const obj = { [name]: value };
        const schemaJob = { [name]: schemaJobH[name] }
        const { error } = Joi.validate(obj, schemaJob);
        return error ? error.details[0].message : null;
    }

    const validateJob = (schemaJobH) => {
        const option = { abortEarly: false };
        const result = Joi.validate(inputJob, schemaJobH, option);
        if (!result.error) return null;
        const errorsJob = {};
        for (let item of result.error.details) {
            errorsJob[item.path[0]] = item.message;
            return errorsJob;
        }
    };

    const validateJobCheck = (schemaJobH) => {
        const option = { abortEarly: false };
        const result = Joi.validate(inputJob, schemaJobH, option);
        if (!result.error) return null;
        const errorsJob = {};
        for (let item of result.error.details) {
            errorsJob[item.path[0]] = item.message;
            if (Object.keys(errorsJob).length > 0) {
                console.log(errorsJob);
                return Object.keys(errorsJob)[0];
            } else { return null; }
        }
    };

    return {
        handleSubmit,
        handleInputChange, validateJobCheck,
        inputs, errors, validate, validateCheck, disabledButtonH, setInputs,
        validateJob, validatePropertyJob, handleInputChangeJob,
        handleSubmitJob, inputJob, errorsJob, setInputJob
    };
};

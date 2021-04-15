import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../header/Navbar';


const testList = [{
    id: 1, insureName: undefined, estimatedCost: undefined,
    estimatedTenure: undefined, insurerAddress: '0x0fd46577', initialDeposit: '0'
},
{
    id: 2, insureName: undefined, estimatedCost: undefined,
    estimatedTenure: undefined, insurerAddress: '10x0fd46577', initialDeposit: '0'
},
{
    id: 3, insureName: undefined, estimatedCost: undefined,
    estimatedTenure: undefined, insurerAddress: '20x0fd46577', initialDeposit: '0'
},
{
    id: 4, insureName: undefined, estimatedCost: undefined,
    estimatedTenure: undefined, insurerAddress: '30x0fd46577', initialDeposit: '0'
},
{
    id: 5, insureName: undefined, estimatedCost: undefined,
    estimatedTenure: undefined, insurerAddress: '40x0fd46577', initialDeposit: '0'
},]
const InsureListAndPolicy = (props) => {

    const { userInsureData } = useSelector((state) => {
        return { userInsureData: state.userData };
    });

    useEffect(() => {
        console.log('userInsureData', userInsureData);
        return () => {

        }
    }, []);



    return (<Fragment>
        <Navbar />
        <div className="container-fluid">
            <div className="card">
                <div className="mx-4 my-4">
                    <h2 className="text-center"> Insurance Applications</h2>
                    <div><Link style={{ fontSize: '1.8rem' }} type="button" className="new-loan btn btn-block btn-lg btn-secondary h1" to="/insurance-apply">Apply for New Insurance</Link>
                    </div>

                    <div className="py-3">
                        <div className="row">
                            {userInsureData.map((data, i) => (
                                <div id={i + data.id} key={i + data.id} className="col-md-3">
                                    <div className="card">
                                        <h3 className="text-center py-3">App {` ${i + 1}`}</h3>
                                        {/* <h4 className="text-center">{data.id}</h4> */}
                                        <h4 className="text-center py-3"> P= {data.estimatedCost}</h4>
                                        <h4 className="text-center"> address: {data.insurerAddress}</h4>

                                        <div className="text-center h4">
                                            <Link style={{ fontSize: '1.8rem' }} type="button" className="new-loan btn btn-block btn-lg btn-secondary h2" to={`/insurance-apply/${data.id}`}>View</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>);
}

export default InsureListAndPolicy;
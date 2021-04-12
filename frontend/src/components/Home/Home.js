import React, { Fragment, Component } from 'react';
import getBlockchain from '../../ethereum.js';
import env from '../../env';
import Navbar from '../header/Navbar';
import homeCss from './home.module.css';
import '../general.scss';


const policyList = [{ id: 1, policyPremiumAmt: 890, policyTenure: 1000, policyStatus: true },
{ id: 2, policyPremiumAmt: 250, policyTenure: 2000, policyStatus: true },
{ id: 3, policyPremiumAmt: 7500, policyTenure: 300000, policyStatus: false }];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bscState: false,
            tokenName: undefined,
            policyList
        }
    }
    render() {
        const { bscState, tokenName } = this.state;
        const { centerDiv } = homeCss
        return (<Fragment>
            <Navbar />


            <div className="container-fluid" style={{ height: '100vh' }}>


                <div className={centerDiv}>
                    <div className="w-100">

                        {/* Insurance Apply Btn */}
                        <div className="row">
                            <div className="col-lg-2 col-md-4">
                                <a style={{ fontSize: '1.8rem' }} type="button" class="new-loan btn btn-block btn-lg btn-secondary h1" href="#new-loan">Apply for New Insurance</a>
                            </div>
                        </div>

                        {policyList.length > 0 ?

                            <div >
                                {/*  Existing Policies */}

                                <div className="my-4 h2">Existing Policies</div>
                                <div className="row">
                                    {policyList.map((data, i) => (
                                        <div className="col-md">
                                            <div className="card">
                                                <h3 className="text-center py-3">Policy</h3>
                                                <h4 className="text-center">{data.id}</h4>
                                                <h4 className="text-center py-3"> P= {data.policyTenure}</h4>
                                                <h4 className="text-center"> P= {data.policyPremiumAmt}</h4>

                                            </div>
                                        </div>
                                    ))}


                                </div>

                                <div className="row my-3">
                                    {policyList.map((data, i) => (
                                        <div className="col-md">
                                            <div className="text-center h4">{data.policyStatus ? "Valid" : "Invalid"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            : <div className="my-4">

                                <div className=" h2">No Existing Policy</div>
                            </div>}

                        {/* Applications */}
                        {/* Applications Btn */}
                        <div className="row">
                            <div className="col-lg-2 col-md-4">
                                <a style={{ fontSize: '1.8rem' }} type="button" class="new-loan btn btn-block btn-lg btn-secondary h2" href="#new-loan">Applications</a>

                            </div>
                        </div>

                    </div>



                </div>
            </div>



        </Fragment>);
    }
}

export default Home;
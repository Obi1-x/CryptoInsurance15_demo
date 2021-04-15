import React, { useState, useEffect, Fragment, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import getBlockchain from './ethereum';
// import env from './env';
import InsuranceApply from './components/insuranceApply/InsuranceApply';
import Home from './components/Home/Home';
import InsureListAndPolicy from './components/insureListAndPolicy/InsureListAndPolicy';
import FullPageSpinner from './components/loader/FullPageSpinner';
import NoMatch from './components/notfound/NotFound';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import "react-toastify/dist/ReactToastify.css";
import './App.css';


const InsureRoute = lazy(() => import('./components/insure/Insure'));
export interface Props {

}

export interface State {
    bscState: boolean,
    _insurengine: any,
    data: string | undefined
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            bscState: false,
            _insurengine: undefined,
            data: undefined
        }
    }

    componentDidMount() {
        // initialize blockchain through metamask
        this.init();
    }

    init = async () => {
        const { _insurengine }: { _insurengine: any } = await getBlockchain();
        if ('checkNetwork()' in _insurengine === false) {
            this.setState({
                _insurengine, data: 'Select Binance Smart Chain Test Network Required'
            })
            // setHashsurance(hashsurance);
            // setData('Select Binance Smart Chain Test Network Required');
            return;
        }

        // const dataTest = await Promise.all([_insurengine.checkNetwork(), _insurengine.totalSupply(), _insurengine.getHashTokenName()]);
        const dataTest = await Promise.all([_insurengine.checkNetwork()]);
        console.log('dataTest', dataTest[0]);
        this.setState({ _insurengine, bscState: dataTest[0] });
    };



    render() {
        const { bscState, data }: { bscState: boolean, data: string | undefined } = this.state
        return (
            <Fragment>
                <ToastContainer />
                {bscState === false && <div className="row">
                    <div className="text-center mt-5">
                        <h1>{data}</h1>
                    </div>
                </div>}

                {bscState === true && <Router>
                    <ErrorBoundary>
                        <Suspense fallback={FullPageSpinner}>
                            <Switch>
                                <Route path="/insure-list/:id" render={props => (
                                    <Suspense
                                        fallback={
                                            <div> <span><i className="fa fa-spinner"></i></span> </div>}>
                                        <InsureRoute {...props} />
                                    </Suspense>)} />
                                <Route path="/insure-list" component={InsureListAndPolicy} />
                                <Route path="/insurance-apply" component={InsuranceApply} />
                                <Route exact path="/" component={Home} />
                                <Route component={NoMatch} />
                            </Switch>
                        </Suspense>
                    </ErrorBoundary>
                </Router>}
            </Fragment>
        );
    }
}

export default App;

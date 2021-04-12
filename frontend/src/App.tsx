import React, { useState, useEffect, Fragment, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Home from './components/Home/Home';
import FullPageSpinner from './components/loader/FullPageSpinner';
import NoMatch from './components/notfound/NotFound';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import "react-toastify/dist/ReactToastify.css";
import './App.css';



// import HOC from './components/HOC/hoc'

// interface inputDataMsg {
//   username: string;
//   prevState: undefined
// }



// function App() {
//     // app state


//     useEffect(() => {
//         console.log('env', env.api);
//         setBscState(true);
//         setTokenName("Hashsurance Token")
//     }, []);





//     return (

//     );
// }

export interface Props {

}

export interface State {

}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            bscState: false,
            tokenName: undefined,
        }
    }

    componentDidMount() {
        this.setState({ bscState: true, tokenName: "Hashsurance Token" })
    }

    render() {
        return (
            <Fragment>
                <ToastContainer />
                <Router>
                    <ErrorBoundary>
                        <Suspense fallback={FullPageSpinner}>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                {/* <Route path="/about" component={About} /> */}
                                <Route component={NoMatch} />
                            </Switch>
                        </Suspense>
                    </ErrorBoundary>
                </Router>
            </Fragment>
        );
    }
}

export default App;

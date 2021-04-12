import * as React from 'react';
import logo from '../../assets/images/savings.svg';
import './navbar.scss';
export interface NavbarProps {

}

const Navbar: React.SFC<NavbarProps> = () => {
    return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <a className="navbar-brand" href="#none"><img src={logo} alt="default logo" width="40" /></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#none">Hashsurance Protocol</a>
                    </li>

                </ul>
                {/* <span className="navbar-text">
                    Navbar text with an inline element
        </span> */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#none">Policy Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#none">Validation Hub</a>
                    </li>
                    <li className="nav-item">
                        <a id="walletSelect" type="button" className="nav-link btn waves-effect waves-light btn-rounded btn-secondary" href="#none">Connect to a wallet</a>

                    </li>
                </ul>
            </div>
        </div>
    </nav>);
}

export default Navbar;
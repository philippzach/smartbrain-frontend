import React from 'react';
import Tilt from 'react-tilt';
import Acai from './logo.svg';
import './logo.css';

const Logo = () => {
    return (
    <div className="ma4 mt0">
        <Tilt className="Tilt br3 shadow-3" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner"> <img alt="" src={Acai} /> </div>
        
        </Tilt>
    </div>
    );
    }
    
    export default Logo;
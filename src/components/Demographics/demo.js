import React from 'react';
import './demo.css';

const Demographics = ({ age, gender, culture }) => {
    return (
    <div className="container">
        <div className="field">
            <p>Your calculated age is: </p>
            <p className="display">{age}</p>
        </div>
        <div className="field">
            <p>Gender: </p>
            <p className="display">{gender}</p>
        </div>
        <div className="field">
            <p>Ethnicity: </p>
            <p className="display">{culture}</p>
        </div>
    </div>
    );
    }
    
    export default Demographics;
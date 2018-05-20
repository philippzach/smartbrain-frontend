import React from 'react';

const Rank = ({name, count}) => {
    return (
    <div>
        <div className="white f3">
            {`${name}, This is your Facedetector. Use this or any other link to give it a try`}
        </div>
        <div className="white f2">
            <h3>Your curren Rank is</h3>
            <h4>{count}</h4>
        </div>
        <div className="white f2">
            {'https://goo.gl/zRXtpt'}
        </div>
    </div>
    );
    }
    
    export default Rank;
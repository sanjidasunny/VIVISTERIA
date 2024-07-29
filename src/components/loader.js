
import React from 'react';
import { DotSpinner } from '@uiball/loaders';
import './loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <DotSpinner size={40} speed={0.9} color="black" />
        </div>
    );
};

export default Loader;

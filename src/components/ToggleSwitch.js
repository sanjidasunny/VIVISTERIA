import React from 'react'
import "../Toggle.css"
const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <label className="switch">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider round"></span>
        </label>
    );
};

export default ToggleSwitch;
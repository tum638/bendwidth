
const CaretDropdown = ({ defaultValue, changeHandler, deviceList, type }) => {
    let dropDownEl;
    
    if (type === 'video') {
        dropDownEl = deviceList.map(vd => <option key={vd.deviceId} value={vd.deviceId}>{vd.label}</option>)

    } else if (type === 'audio') {
        const audioInputEl = [];
        const audioOutputEl = [];

        deviceList.forEach((d, i) => {
            if (d.kind === "audioinput") {
                console.log("input", d.label);
                audioInputEl.push(<option key={`input${i}`} value={`input${d.deviceId}`} >{d.label}</option>)
            } else if (d.kind === "audiooutput") {
                console.log("output", d.label);
                audioOutputEl.push(<option key={`ouput${i}`} value={`ouput${d.deviceId}`} >{d.label}</option>)
            }
        })
     
        audioInputEl.unshift(<optgroup label="Input Devices" />);
        audioOutputEl.unshift(<optgroup label="Output Devices" />);
        dropDownEl = audioInputEl.concat(audioOutputEl);
    }

    return (
        <div className="caret-dropdown">
            <select defaultValue={defaultValue} onChange={changeHandler}>
                {dropDownEl}
            </select>
        </div>
    )
}
export default CaretDropdown;
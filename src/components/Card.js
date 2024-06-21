import React from 'react';

function Card(props) {
  let options = props.options;
  let priceOptions = Object.keys(options);

  return (
    <div style={{ marginLeft: "10px" }}>
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={props.imgSrc}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodName}</h5>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              
              <select className="m-2 h-100 bg-success rounded">
                {Array.from(Array(6), (e, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            

            <div className="d-flex align-items-center">
              
              <select className="form-select">
                {priceOptions.map((data) => (
                  <option key={data} value={options[data]}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
           
            <div className="text-uppercase">price</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

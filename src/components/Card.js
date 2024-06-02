import React from 'react'

function Card() {
  return (
    <div>
      <div className="card">
        <img src="https://static01.nyt.com/images/2023/12/20/multimedia/LH-Shrimp-Pasta-ftvh/LH-Shrimp-Pasta-ftvh-superJumbo.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">Some important text</p>
          <div className="container">
            <select className="card-select" name="" id="">
              <option value="half">Half</option>
              <option value="full">Full</option>
            </select>
            <select className="card-select" name="" id="">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <div style={{ marginLeft: "10px" }}>price</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card

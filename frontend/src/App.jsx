import { useState } from 'react'
import './App.css'
import axios from "axios";

function App() {
  addEventListener("submit", async(e) => { // listens to the user entering a url
    e.preventDefault();
    const value = document.querySelector('input').value;

    try {
      await axios.post("http://localhost:1337/api", {value});
      const data = await axios.get("http://localhost:1337/api");
      const dataObject = data.data[0];
      generateProduct(dataObject);
      prepareListeners();
    }
    catch(error) {
      console.log(error.response)
    }
  })

  function generateProduct(dataObject) { // generates html for a product entry
    const resultHeader = document.querySelector("#result-header");
    resultHeader.insertAdjacentHTML("afterend", 
     `<div class="product" id=${dataObject._id}>
      <div class="product-content">
        <a href=${dataObject.link} class="productLink" id=${dataObject._id+"-link"}>
          ${dataObject.product}
        </a>
        <p class="${dataObject.available}" id=${dataObject._id+"-available"}>in stock: ${dataObject.available ? "✅":"❌"}</p>
        <p class="${dataObject.sale}" id=${dataObject._id+"-sale"}>on sale: ${dataObject.sale ? "✅":"❌"}</p>
      </div>
      <div class="content-buttons">
        <button type="button" class="refresh" id=${dataObject._id+"-refresh"}>refresh</button>
        <button type="button" class="delete" id=${dataObject._id+"-delete"}>delete</button>
      </div>
    </div>`
    )
  }
  
  function prepareListeners() {
    const allRefreshButtons = document.querySelector(".refresh");
    const allDeleteButtons = document.querySelector(".delete");

    allRefreshButtons.addEventListener("click", async(e) => { // for all refresh buttons
      const refreshButtonId = e.target.id;
      const productId = refreshButtonId.slice(0, refreshButtonId.indexOf("-"));
      const productLink = document.getElementById(`${productId}-link`).href;
      const available = document.getElementById(`${productId}-available`).class; // "true" or "false", in string type, boolean
      const sale = document.getElementById(`${productId}-sale`).class; // "true" or "false", in string type, boolean

      try {
        const updatedObj = await axios.put("http://localhost:1337/api", {link: productLink});
        const updatedData = updatedObj.data;

        if (updatedData.available != available) { // if availability as displayed doesn't match that of the updated data
          document.getElementById(`${productId}-available`).innerHTML = updatedData.available ? "✅":"❌";
        }
        else if (updatedData.sale != sale) { // if sale status as displayed doesn't match that of the updated data
          document.getElementById(`${productId}-sale`).innerHTML = updatedData.sale ? "✅":"❌";
        }
      }
      catch(error) {
        console.log(error.response)
      }
    })

    allDeleteButtons.addEventListener("click", async(e) => { // for all delete buttons
      const deleteButtonId = e.target.id;
      const productId = deleteButtonId.slice(0, deleteButtonId.indexOf("-"));
      const productLink = document.getElementById(`${productId}-link`).href;

      console.log(productLink);

      try {
        await axios.delete(`http://localhost:1337/api/${productId}`); // delete from database
        document.getElementById(productId).remove();
      }
      catch(error) {
        console.log(error.response);
      }
    })
  }




  return (
    <>
      <div className="app">
        <div className="start-div"></div>
        <div className="main">
          <h1>welcome to scraBBer.</h1>
          <p id="purpose">track the availability of your BB 🇨🇦 products here.</p>
          <form>
            <input id="url-box" type="text" placeholder="(enter a product URL here, i.e. https://www.bestbuy.ca/en-ca/product/...)"></input>
          </form>
          <h3 id="result-header">results will appear below 👇</h3>
          
        </div>
        <div className="end-div">
          made by <a href="https://github.com/rjchen8">ronald chen</a>
        </div>
      </div>
    </>
  )
}

export default App;

import React from 'react'
import Websocket from 'react-websocket';
import * as bulma from "reactbulma";
import StocksList from "./StocksList.jsx";
import StocksGraph from "./StocksGraph.jsx";

class Dashboard extends React.Component {

  state = {
  // stocks = {name: {current_value: 12, history: [{time: '2131', value: 45}, ...]}, ...}
   stocks: {}
  }

  saveNewStockValues = (data) => {
    let result = JSON.parse(data);

    // time stored in histories should be consisitent across stocks(better for graphs)
    let current_time = Date.now();
    let new_stocks = this.state.stocks
    result.map((stock) =>
    {
      // stock = [name, value]
      if(this.state.stocks[stock[0]])
      {
        new_stocks[stock[0]].current_value = Number(stock[1])
        new_stocks[stock[0]].history.push({time: current_time, value: Number(stock[1])})
      }
      else
      {
        new_stocks[stock[0]] = { current_value: stock[1], history: [{time: Date.now(), value: Number(stock[1])}], is_selected: false }
      }
    });
    new_stocks[result[0][0]].is_selected = true // temp, add some mechanism to select stocks
    this.setState({stocks: new_stocks})
  }

  render() {
    return (
      <div className='container'>
        <Websocket url='ws://stocks.mnet.website/' onMessage={this.saveNewStockValues} />
        <div className='columns'>
          <StocksList stocks={this.state.stocks} />
          <StocksGraph stocks={this.state.stocks} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
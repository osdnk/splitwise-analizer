import React, { Component } from 'react';
import './App.css';
import {Sigma, RandomizeNodePositions, RelativeSize, EdgeShapes} from 'react-sigma';


import algorithms from './algorithms'
import data from './data'

import Select from 'react-select';

class App extends Component {
  state = {
    selectedStrategy: null,
    selectedSet: null,
    done: false,
    showInput: false,
    showResult: false
  };
  handleStrategyChange = selectedStrategy => {
    this.setState({ selectedStrategy, done: false, showResult: false });
  };
  handleSetChange = selectedSet => {
    this.setState({ selectedSet, done: false, showResult: false, showInput: false  });
    this.input = data[selectedSet.value];
  };
  drawInput = () => {
    this.setState({
      showInput: !this.state.showInput
    })
  };

  drawResult = () => {
    this.setState({
      showResult: !this.state.showResult
    })
  };

  calc = () => {
    this.result = algorithms[this.state.selectedStrategy.value](this.input);
    this.setState({
      done: true
    })
    let sumBefore = 0;
    for (let i = 0; i < this.input.debts.length; i++) {
      sumBefore += this.input.debts[i].sum;
    }

    let sumAfter = 0;
    for (let i = 0; i < this.result.debts.length; i++) {
      sumAfter += this.result.debts[i].sum;
    }
    this.stats = {
      "Members": this.result.members,
      "Total number of debts before": sumBefore,
      "Avg dept before: ": sumBefore / this.input.debts.length,
      "Number of edges before": this.input.debts.length,
      "Avg dept after: ": sumAfter / this.result.debts.length,
      "Number of edges after": this.result.debts.length
    }
  }
  ;

  parseData = input => {
    const nodes = [];
    console.log(input);
    for (let i = 0; i < input.members; i++) {
      nodes.push({
        id: `n${i}`,
        label: `${i}`
      })
    }
    const edges = input.debts.map((d, i) =>
      ({
        source: `n${d.from}`,
        target: `n${d.to}`,
        label: `${d.sum}`,
        id: `e${i}`,
        weight: 3
      })
    )
    return {
      nodes,
      edges
    }
  };

  renderStats = () =>
    <div>
      {
        Object.keys(this.stats).map(s =>
        <div key = {s}>
          {s} : {this.stats[s]}
        </div>
        )
      }
    </div>

  renderChart = input => {
    return <Sigma graph={this.parseData(input)} settings={{ drawEdges: true, clone: true, drawEdgeLabels: true }}>
      <EdgeShapes default="arrow"/>
      <RelativeSize initialSize={15}/>
      <RandomizeNodePositions/>
    </Sigma>
  }

  render() {
    const { selectedStrategy, selectedSet } = this.state;

    return (
      <div>
        Select strategy
        <Select
          value={selectedStrategy}
          onChange={this.handleStrategyChange}
          options={Object.keys(algorithms).map(a => ({value: a, label: a}))}
        />
        Select data
        <Select
          value={selectedSet}
          onChange={this.handleSetChange}
          options={Object.keys(data).map(a => ({value: a, label: a}))}
        />
        <button onClick={this.drawInput} disabled={this.state.selectedSet === null}>
          DrawInput
        </button>
        <button onClick={this.calc} disabled={this.state.selectedSet === null || this.state.selectedStrategy === null || this.state.done}>
          Calc
        </button>
        <button onClick={this.drawResult} disabled={!this.state.done}>
          Draw result
        </button>
        {
          this.state.showInput && this.renderChart(this.input)
        }
        {
          this.state.done && this.renderStats()
        }
        {
          this.state.showResult && this.renderChart(this.result)
        }
      </div>
    );
  }
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import NEOList from './components/NEOList.jsx';
import sampleData from '../data/data.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      showError: false,
      neos: []
    };

    this.search = this.search.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.getNeos = this.getNeos.bind(this);
    this.countHazardousNeos = this.countHazardousNeos.bind(this);
  }

  onStartDateChange(startDate) {
    this.setState({
      startDate: startDate.target.value
    });
  }

  onEndDateChange(endDate) {
    this.setState({
      endDate: endDate.target.value
    });
  }

  componentDidMount() {
    this.getNeos();
  }

  getNeos() {
    var context = this;

    $.ajax({
      type: 'GET',
      url: '/neos',
      contentType: 'application/json',
      success: (data) => {
        context.setState({
          neos: data,
          showError: false
        }, () => {
          context.countHazardousNeos();
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }



  countHazardousNeos() {
    var hazardCount = 0;

    this.state.neos.forEach((neo) => {
      if (neo.hazardous) {
        hazardCount++;
      }
    });

    if (hazardCount > 0) {
      alert(`There are ${hazardCount} potentially dangerous asteroids!!`);
    }
  }

  search() {
    var context = this;

    $.ajax({
      type: 'POST',
      url: '/neos/import',
      data: JSON.stringify({
        startDate: context.state.startDate,
        endDate: context.state.endDate
      }),
      contentType: "application/json",
      success: () => {
        console.log('client post successful');
        context.getNeos();
      },
      error: () => {
        context.setState({
          showError: true
        });
      }
    });
  }

  render () {
    return (
    <div>
      <h1>Space Ops</h1>
      <div>Start date</div>
      <input id="start-date" placeholder="YYYY-MM-DD" onChange={this.onStartDateChange}></input>
      <div>End date</div>
      <input id="end-date" placeholder="YYYY-MM-DD" onChange={this.onEndDateChange}></input>
      <button name="neo" onClick={this.search}>Submit</button>
      <div>{this.state.showError ? 'Date max range is 7 days.' : ''}</div>
      <NEOList neos={this.state.neos}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
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
      showNeos: false,
      showRovers: false,
      showError: false,
      neos: []
    };

    this.toggleShowNeos = this.toggleShowNeos.bind(this);
    this.toggleShowRovers = this.toggleShowRovers.bind(this);
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

  toggleShowNeos() {
    this.setState({
      showNeos: !this.state.showNeos
    }, () => {
      if (this.state.showNeos) {
        this.countHazardousNeos();
      }
    });

    if (this.state.showRovers) {
      this.setState({
        showRovers: false
      });
    }
  }

  toggleShowRovers() {
    this.setState({
      showRovers: !this.state.showRovers
    });

    if (this.state.showNeos) {
      this.setState({
        showNeos: false
      });
    }
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
          if (context.state.showNeos) {
            context.countHazardousNeos();
          }
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
      alert(`WARNING: There are ${hazardCount} potentially dangerous asteroids!!`);
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
        <button name="showNeos" onClick={this.toggleShowNeos}>Near Earth Objects</button>
        <button name="showRovers" onClick={this.toggleShowRovers}>Curiosity Rover Photos</button>
        {this.state.showNeos ?
          <div id="neos">
            <div>Start date</div>
            <input id="start-date" placeholder="YYYY-MM-DD" onChange={this.onStartDateChange}></input>
            <div>End date</div>
            <input id="end-date" placeholder="YYYY-MM-DD" onChange={this.onEndDateChange}></input>
            <button name="neoSubmit" onClick={this.search}>Submit</button>
            <div>{this.state.showError ? 'Date max range is 7 days.' : ''}</div>
            <NEOList neos={this.state.neos}/>
          </div> : null}
        {this.state.showRovers ?
          <div id="rovers">
            <button name="prev" >Prev Image</button>
            <button name="next" >Next Image</button>
            <div></div>
          </div> : null}
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
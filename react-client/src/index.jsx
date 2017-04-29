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

  // componentDidMount() {
  //   $.ajax({
  //     url: '/items',
  //     success: (data) => {
  //       this.setState({
  //         items: data
  //       })
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     }
  //   });
  // }

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
      success: (data) => {
        console.log('client post successful');
        context.setState({
          neos: JSON.parse(data),
          showError: false
        });
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
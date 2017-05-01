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
      neos: [],
      photos: [],
      index: 0
    };

    this.toggleShowNeos = this.toggleShowNeos.bind(this);
    this.toggleShowRovers = this.toggleShowRovers.bind(this);
    this.search = this.search.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.getNeos = this.getNeos.bind(this);
    this.countHazardousNeos = this.countHazardousNeos.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.showNext = this.showNext.bind(this);
    this.showPrev = this.showPrev.bind(this);
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
    this.getPhotos();
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
    }, () => {
      if (this.state.showRovers) {
        var context = this;

        $.ajax({
          type: 'POST',
          url: '/photos/import',
          contentType: "application/json",
          success: () => {
            console.log('client post successful');
            context.getPhotos();
          },
          error: () => {
            console.log('error retrieving photos');
          }
        });
      }
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

  getPhotos() {
    var context = this;

    $.ajax({
      type: 'GET',
      url: '/photos',
      contentType: 'application/json',
      success: (data) => {
        context.setState({
          photos: data
        }, () => {
          console.log('photos retrieved');
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  showNext() {
    var next = this.state.index + 1;
    if (next < this.state.photos.length) {
      this.setState({
        index: next
      });
    }
  }

  showPrev() {
    var prev = this.state.index - 1;
    if (prev >= 0) {
      this.setState({
        index: prev
      });
    }
  }

  render () {
    return (
    <div>
      <h1>Space Ops</h1>
        <button name="showNeos" onClick={this.toggleShowNeos}>Near Earth Object Detection</button>
        <button name="showRovers" onClick={this.toggleShowRovers}>View Curiosity Rover Photos</button>
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
            <button name="prev" onClick={this.showPrev}>Prev Image</button>
            <button name="next" onClick={this.showNext}>Next Image</button>
            <div id="photosCount">
              {`Photo ${this.state.index + 1} of ${this.state.photos.length}`}
            </div>
            {this.state.photos.length > 0 ?
              <div>
                <h2>Curiosity Rover - Mars</h2>
                <h3>{`${this.state.photos[this.state.index].cameraName} (${this.state.photos[this.state.index].cameraFullName})`}</h3>
                <h4>{`${this.state.photos[this.state.index].date}`}</h4>
                <img src={this.state.photos[this.state.index].src} alt="Rover Photo" />
              </div> : null}
          </div> : null}
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
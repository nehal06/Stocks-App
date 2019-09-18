import React, { PureComponent } from 'react';
import TableData from './Components/TableData';
// import the core library.
/* reference : echarts-for-react */
import ReactEchartsCore from 'echarts-for-react';
import './App.css';
class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arrayOfObj: [],
      option: {}
    };
  }

  wsUri = 'ws://stocks.hulqmedia.com';
  websocket = new WebSocket(this.wsUri);
  onMessage = evt => {
    console.log(evt);

    for (let i = 0; i < evt.length; i++) {
      let key = evt[i][0],
        val = evt[i][1].toFixed(3),
        greater;
      let newArray = [];
      let time = new Date().toLocaleTimeString();
      var index =
        this.state.arrayOfObj.length > 0
          ? this.state.arrayOfObj.findIndex(o => o.key == key)
          : -1;
      if (index != -1) {
        newArray = [...this.state.arrayOfObj];
        greater = this.state.arrayOfObj[index].val > val ? false : true;
        var obj = {
          key,
          val,
          greater,
          time
        };
        newArray[index] = obj;

        this.setState({
          arrayOfObj: newArray,
          option: this.getOption()
        });
      } else {
        var obj = {
          key,
          val,
          greater,
          time
        };
        newArray.push(obj);
        this.setState({
          arrayOfObj: [...this.state.arrayOfObj, ...newArray],
          option: this.getOption()
        });
      }
    }
  };
  onOpen = evt => {
    console.log('CONNECTED');
    this.websocket.send('Hello Server!');
  };
  onError = evt => {
    console.log(evt.data);
  };
  componentDidMount() {
    this.websocket.onopen = evt => {
      this.onOpen(evt);
    };

    this.websocket.onmessage = async evt => {
      console.log('onMessage');
      await this.onMessage(JSON.parse(evt.data));
      //   this.websocket.close();
    };
    this.websocket.onerror = evt => {
      this.onError(evt);
    };
    setTimeout(() => {
      this.websocket.close();
    }, 600000);
  }
  getOption = () => {
    let keys =
      this.state.arrayOfObj.length > 0
        ? this.state.arrayOfObj.map(o => o.key)
        : ['a'];
    let values =
      this.state.arrayOfObj.length > 0
        ? this.state.arrayOfObj.map(o => o.val)
        : ['b'];
    return {
      textStyle: {
        color: '#FFFFFF'
      },
      grid: {
        show: false,
        left: '10%',
        top: '7%',
        right: '10%',
        bottom: '5%',
        zlevel: 100
      },
      tooltip: {
        trigger: 'item',
        formatter: `{a} <br/> {b} : &#x20b9; {c}`
      },
      legend: {
        data: keys
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: keys
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'value',
          data: values,
          type: 'line',
          areaStyle: {}
        }
      ]
    };
  };
  render() {
    return (
      <div className="App">
        <h1 className="mainHeading">Stocks App</h1>
        <div className="container">
          <TableData arrayOfObj={this.state.arrayOfObj} />

          <div>
            <p className="chartHeading">Chart Data</p>
            <ReactEchartsCore
              className="chart"
              option={this.state.option}
              // style={{ height: 500, color: '#FFFFFF' }}
            />
          </div>
        </div>
        <span className="note">
          Note : Connection will close after 10 minutes.
        </span>
      </div>
    );
  }
}
export default App;

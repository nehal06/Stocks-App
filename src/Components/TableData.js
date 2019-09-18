import React, { PureComponent } from 'react';

class TableData extends PureComponent {
  render() {
    const { arrayOfObj } = this.props;
    console.log('render called');
    return (
      <div>
        <p className="tableHeading">Table Of Content</p>
        <table width="100%">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {arrayOfObj.map((obj, index) => {
              return (
                <tr key={index}>
                  <td>{obj.key}</td>
                  <td
                    style={{
                      color:
                        obj.greater != undefined
                          ? obj.greater == true
                            ? '#08ff08'
                            : '#e53935'
                          : 'white'
                    }}
                  >
                    &#x20b9; {obj.val}
                  </td>
                  <td>{obj.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableData;

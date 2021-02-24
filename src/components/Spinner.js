import React from 'react'

class Spinner extends React.Component {
  render(){
      if(this.props.type ==='table') {
        return (<tbody className="spinner-border test-light text-center"></tbody>)
      } else {
        return (<div className="spinner-border test-light text-center"></div>)
      }
  }
}

export default Spinner;

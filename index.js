import React from "./react";
import ReactDom from "./react-dom";

const ele = (
  <div className="active" title="123">
    hello,<span>123</span>
  </div>
);

//组件化
// function Home() {
//   const ele = (
//     <div className="active" title="123">
//       hello,<span>123</span>
//     </div>
//   );

//   return ele;
// }

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  componentWillMount() {
    console.log("组件将要加载");
  }

  componentWillReceiveProps() {
    console.log("组件将要获取数据");
  }

  componentWillUpdate() {
    console.log("组件将要更新");
  }

  componentDidUpdate() {
    console.log("组件完成更新");
  }

  componentDidMount() {
    console.log("组件完成加载");
  }

  clickMe() {
    // let n = ++this.state.num;
    // this.setState({
    //   num: n,
    // });
    this.setState((prevState, prevProps) => {
      return {
        num: prevState.num + 1,
      };
    });
  }

  render() {
    return (
      <div className="active" title="123">
        hello,<span>123</span>
        {this.state.num}
        <button onClick={this.clickMe.bind(this)}>点击</button>
      </div>
    );
  }
}

console.log(<Home name="123" />);

ReactDom.render(<Home name="123" />, document.querySelector("#root"));

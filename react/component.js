import { renderComponent } from "../react-dom";
import { enqueueSetState } from "./setState_squeue";
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(obj) {
    // for (let o in obj) {
    //   this.state[o] = obj[o];
    // }

    // renderComponent(this);
    enqueueSetState(obj, this);
  }
}
export default Component;

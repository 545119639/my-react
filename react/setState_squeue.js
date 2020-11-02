import { renderComponent } from "../react-dom";

/**
 * 1：异步更新satate,短时间吧多个setState合并成 一个（队列：先进先出）
 * 2：一段时间之后,循环清空队列，渲染组件
 */
const setStateQueue = [];
export function enqueueSetState(statechange, component) {
  //短时间合并多个setSate
  setStateQueue.push({
    statechange,
    component,
  });

  setTimeout(() => {
    flush(component, statechange);
  }, 0);
}
//一段时间后
function flush(component, statechange) {
  let item;
  while ((item = setStateQueue.shift())) {
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }
    if (typeof statechange === "function") {
      //是一个函数
      Object.assign(
        component.state,
        statechange(component.prevState, component.prevProps)
      );
    } else {
      //是一个对象
      Object.assign(component.state, statechange);
    }

    component.prevState = component.state;
    renderComponent(component);
  }
}

import Component from "../react/component";
import { diff, diffNode } from "./diff";
const ReactDom = {
  render,
};

function render(vnode, container, dom) {
  if (vnode === undefined || vnode === null || typeof vnode === "boolean")
    return;
  // return container.appendChild(_render(vnode));
  return diff(dom, vnode, container);
}

export function createComponent(comp, props) {
  let inst;
  if (comp.prototype && comp.prototype.render) {
    //如果是类定义的组件，则创建实例返回
    inst = new comp(props);
  } else {
    //如果是函数组件将其转换为类组件，方便后面统一管理
    inst = new Component(props);
    inst.constructor = comp;
    inst.render = function () {
      return this.constructor(props);
    };

    console.log(inst);
  }
  return inst;
}

export function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.componentWillMount) comp.componentWillMount();
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps();
  }
  comp.props = props;

  renderComponent(comp);
}

export function renderComponent(comp) {
  const renderer = comp.render();
  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }
  // const base = _render(renderer);
  const base = diffNode(comp.base, renderer);
  if (comp.base && comp.componentDidUpdate) {
    comp.componentDidUpdate();
  }
  if (!comp.base && comp.componentDidMount) {
    comp.componentDidMount();
  }

  //节点替换
  // if (comp.base && comp.base.parentNode) {
  //   comp.base.parentNode.replaceChild(base, comp.base);
  // }
  comp.base = base;
}

function _render(vnode) {
  //如果是字符串，直接创建一个文本节点
  if (typeof vnode === "string") {
    let textNode = document.createTextNode(vnode);
    return textNode;
  }

  if (typeof vnode === "number") {
    let textNode = document.createTextNode(vnode);
    return textNode;
  }
  console.log(vnode);
  //如果tag是函数，则渲染组件
  if (typeof vnode.tag === "function") {
    //1.创建组件
    const comp = createComponent(vnode.tag, vnode.attrs);
    //2.设置组件属性
    setComponentProps(comp, vnode.attrs);
    //3.组件渲染节点返回
    return comp.base;
  }

  //如果是一个虚拟dom对象
  const { tag, attrs, childrens } = vnode;
  const dom = document.createElement(tag);

  if (attrs) {
    //设置属性
    Object.keys(attrs).forEach((key) => {
      const val = attrs[key];
      setAttribute(dom, key, val);
    });
  }

  if (childrens && childrens.length > 0) {
    childrens.forEach((child) => {
      render(child, dom);
    });
  }

  return dom;
}

function setAttribute(dom, key, val) {
  if (key === "className") {
    key = "class";
  }

  //如果是事件
  if (/on\w+/.test(key)) {
    let ev = key.toLowerCase();
    dom[ev] = val;
  } else if (key === "style") {
    if (!val || typeof val === "string") {
      dom.style.cssText = val;
    } else if (val && typeof val === "object") {
      for (let o in val) {
        if (typeof val[o] === "number") {
          dom.style[o] = val[o] + "px";
        } else {
          dom.style[o] = val[o];
        }
      }
    }
  } else {
    //其他属性
    if (key in dom) {
      dom[key] = val || "";
    }
    if (val) {
      dom.setAttribute(key, val);
    } else {
      dom.removeAttribute(key);
    }
  }
}

export default ReactDom;

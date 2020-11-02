import { setComponentProps, createComponent } from ".";

export function diff(dom, vnode, container) {
  let ret = diffNode(dom, vnode);
  if (container) {
    container.appendChild(ret);
  }
  return ret;
}

export function diffNode(dom, vnode) {
  let out = dom;

  //文本节点
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  if (typeof vnode === "string") {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent != vnode) {
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom);
      }
    }
    return out;
  }

  if (typeof vnode.tag === "function") {
    return diffComponent(out, vnode);
  }

  //非文本dom节点
  if (!dom) {
    out = document.createElement(vnode.tag);
  }

  if (
    (vnode.childrens && vnode.childrens.length > 0) ||
    (out.childNodes && out.childNodes.length > 0)
  ) {
    //   对比子节点
    diffChildren(out, vnode.childrens);
  }
  diffAttribute(out, vnode);
  return out;
}

function diffComponent(dom, vnode) {
  // 如果组件没有变化
  let comp = dom;
  if (comp && comp.constructor === vnode.tag) {
    //重新设置props
    setComponentProps(comp, vnode.attrs);
    //赋值
    dom = comp.base;
  } else {
    //组件类型发生了变化
    if (comp) {
      //先移除旧的组件
      unmountComponent(comp);
      comp = null;
    }

    //创建新的组件
    comp = createComponent(vnode.tag, vnode.attrs);
    //设置新组建的属性
    setComponentProps(comp, vnode.attrs);
    //给当前组件挂载base--实际dom
    dom = comp.base;
  }

  return dom;
}

function unmountComponent(comp) {
  removeNode(comp.base);
}

function removeNode(node) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(node);
  }
}

function diffChildren(dom, vChildrens) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  if (domChildren.length > 0) {
  }
  if (vChildrens && vChildrens.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    [...vChildrens].forEach((vchild, i) => {
      const key = vchild.key;
      let child;
      if (key) {
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];
          if (c) {
            child = c;
            childrens[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }
      child = diffNode(child, vchild);
      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

function diffAttribute(dom, vnode) {
  //保存之前的所有属性
  let oldAttrs = {};
  const domAttrs = dom.attributes;
  [...domAttrs].forEach((elem) => {
    oldAttrs[elem.name] = elem.value;
  });

  //比较  如果原来的属性不在新的属性中，去除原属性
  Object.keys(oldAttrs || {}).forEach((it) => {
    if (!(it in vnode["attrs"])) {
      setAttribute(dom, it, undefined);
    }
  });

  //存在即更新
  Object.keys(vnode["attrs"] || {}).forEach((item) => {
    if (vnode["attrs"][item] != oldAttrs[item]) {
      setAttribute(dom, item, vnode["attrs"][item]);
    }
  });
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

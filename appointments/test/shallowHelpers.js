import React from 'react';

export const childrenOf = element => {
  if (typeof element === 'string' || !element.props.children) {
    return [];
  }
  const {
    props: { children }
  } = element;
  if (typeof children === 'string') {
    return [children];
  }
  if (Array.isArray(children)) {
    return children;
  }
  return [children];
};

import React, { Children } from 'react';

type EachProps<T> = {
  of: T[];
  render: (item: T, index: string) => React.ReactNode;
};

const Each = <T,>({ of, render }: EachProps<T>) =>
  Children.toArray(of.map((item, index) => render(item, String(index))));

export default Each;

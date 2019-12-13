
<div align="center">
  <h1>
    React Table Sticky
    <br/>
    <br/>
  </h1>
    :warning: Under developpment, still unstable
    <br/>
    <br/>
    <a href="https://www.npmjs.com/package/react-table-sticky">
      <img src="https://img.shields.io/npm/v/react-table-sticky.svg" alt="npm package" />
    </a>
    <br/>
    <br/>
    Sticky components and tools for <a href="https://github.com/tannerlinsley/react-table">React Table v7</a>
    <br/>
  <br/>
  <br/>
  <pre>npm i <a href="https://www.npmjs.com/package/react-table-sticky">react-table-sticky</a></pre>
  <br/>
  <br/>
</div>

:warning: `react-table@7.x` is still in beta. Last verified compatible version is `7.0.0-rc.10`

## Documentation

* [Demo on CodeSandbox](https://codesandbox.io/s/sweet-cori-gl81g)
* [Features](#features)
* [Simple example](#simple-example)
* [Sticky columns for react-table v6](#sticky-columns-for-react-table-v6)
* [Browser support](#browser-support)
* [Contribute](#contribute)

## Features
* sticky header
* sticky columns left and/or right
* full customizable

## Simple example

Steps:

1. create CSS classes `.table` `.header` `.body` `.sticky` etc... (check following example)
2. create HTML elements `<div className="table sticky">`, `<div className="header">`, `<div className="body">` etc...
3. add `stickyStyles` and `useSticky`
4. then, add `sticky: 'left'` or `sticky: 'right'` to your column

full example:

```js
import React from 'react';
import styled from 'styled-components';
import { useTable, useBlockLayout } from 'react-table';
import { useSticky } from 'react-table-sticky';

const Styles = styled.div`
  .table {
    border: 1px solid #ddd;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }

    &.sticky {
      overflow: scroll;
      .header {
        position: sticky;
        top: 0;
        z-index: 1;
        box-shadow: 0px 3px 3px #ccc;
        width: fit-content;
      }

      .body {
        position: relative;
        z-index: 0;
      }
    }
  }
`;

function TableDemo() {
  const columns = [
    {
      Header: 'First Name',
      accessor: 'firstName',
      sticky: 'left',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
      sticky: 'left',
    },
    ...
    {
      Header: 'age',
      accessor: 'age',
      sticky: 'right',
    }
  ]

  const data = [
    ...
  ]

  const stickyStyles = {
    lastLeftTdStyle: {
      boxShadow: '2px 0px 3px #ccc',
    },
    firstRightTdStyle: {
      boxShadow: '-2px 0px 3px #ccc',
    },
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      stickyStyles,
    },
    useBlockLayout,
    useSticky,
  );

  return (
    <Styles>
      <div {...getTableProps()} className="table sticky" style={{ width: 1000, height: 500 }}>
        <div className="header">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => (
                  <div {...cell.getCellProps()} className="td">
                    {cell.render('Cell')}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
}

```

*Tips:* if your table contain at least one header group, place yours sticky columns into a group too (even with an empty Header name)

```js
const columns = [
  {
    Header: ' ',
    sticky: 'left',
    columns: [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
    ]
  },
  {
    Header: 'Other group',
    columns: [
      ...
    ]
  }
]
```

## Sticky columns for React Table v6
If you search tool for sticky position in React Table v6, take a look at [react-table-hoc-fixed-columns](https://github.com/GuillaumeJasmin/react-table-hoc-fixed-columns)

## Browser support

Check CSS sticky support [https://caniuse.com/#search=sticky](https://caniuse.com/#search=sticky)

## Contribute

* `git clone https://github.com/guillaumejasmin/react-table-sticky.git`
* `npm install`
* `npm run demo`
* Go to http://localhost:8080

/* eslint-disable import/no-extraneous-dependencies */

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// @ts-ignore
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import { getData } from './makeData';
import { useSticky } from '../index';

const Styles = styled.div`
  padding: 1rem;

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

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: scroll;

      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;

function Table({ columns, data }: any) {
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
    },
    useBlockLayout,
    useResizeColumns,
    useSticky,
  );

  // Workaround as react-table footerGroups doesn't provide the same internal data than headerGroups
  const footerGroups = headerGroups.slice().reverse();

  return (
    <div {...getTableProps()} className="table sticky" style={{ width: 1500, height: 500 }}>
      <div className="header">
        {headerGroups.map((headerGroup: any) => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column: any) => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
                <div
                  {...column.getResizerProps()}
                  className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className="body">
        {rows.map((row: any) => {
          prepareRow(row);
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map((cell: any) => (
                <div {...cell.getCellProps()} className="td">
                  {cell.render('Cell')}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="footer">
        {footerGroups.map((footerGroup: any) => (
          <div {...footerGroup.getHeaderGroupProps()} className="tr">
            {footerGroup.headers.map((column: any) => (
              <div {...column.getHeaderProps()} className="td">
                {column.render('Footer')}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Demo() {
  const columns = useMemo(() => [
    {
      Header: 'Other details',
      Footer: 'Other details',
      sticky: 'left',
      columns: [{
        Header: 'Other Infos',
        Footer: 'Other Infos',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            Footer: (info: any) => {
              const total = info.rows.reduce((sum: any, row: any) => row.values.age + sum, 0);
              const average = Math.round(total / info.rows.length);
              return (
                <div>
                  Moyenne:
                  {average}
                </div>
              );
            },
          },
        ],
      }],
    },
    {
      Header: 'User details',
      Footer: '',
      sticky: 'left',
      columns: [{
        Header: ' ',
        Footer: ' ',
        columns: [
          {
            Header: 'First Name',
            Footer: 'First Name',
            accessor: 'firstName',
            width: 150,
          },
          {
            Header: 'Last Name',
            Footer: 'Last Name',
            accessor: 'lastName',
            width: 150,
          },
        ],
      }],
    },
    {
      Header: 'Address',
      Footer: 'Address',
      columns: [{
        Header: 'Location',
        Footer: 'Location',
        columns: [
          {
            Header: 'Street',
            Footer: 'Street',
            accessor: 'street',
            width: 300,
          },
          {
            Header: 'Street bis',
            Footer: 'Street bis',
            accessor: 'streetBis',
            width: 300,
          },
          {
            Header: 'City',
            Footer: 'City',
            accessor: 'city',
          },
        ],
      }],
    },
    {
      Header: 'Contact details',
      Footer: 'Contact details',
      sticky: 'right',
      columns: [{
        Header: 'Contact',
        Footer: 'Contact',
        columns: [
          {
            Header: 'Professional Email',
            Footer: 'Professional Email',
            accessor: 'proEmail',
            width: 200,
          },
          {
            Header: 'Email',
            Footer: 'Email',
            accessor: 'email',
            width: 200,
          },
        ],
      }],
    },
  ], []);

  const data = useMemo(() => getData(), []);

  return (
    <div className="table">
      <Styles>
        <Table columns={columns} data={data} />
      </Styles>
    </div>
  );
}

ReactDOM.render(<Demo />, document.getElementById('app'));

/* eslint-disable import/no-extraneous-dependencies */

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// @ts-ignore
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import { getData } from './makeData';
import { stickyHeaderGroups, stickyRow } from '../index';

const Styles = styled.div`
  padding: 1rem;

  .table {
    border-spacing: 0;
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
      .header {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      .tr[data-sticky-last-header-tr] {
        box-shadow: 0px 3px 3px #ccc;
      }

      .td, .th {
        overflow: hidden;

        &[data-sticky-last-left-td] {
          box-shadow: 2px 0px 3px #ccc;
        }

        &[data-sticky-first-right-td] {
          box-shadow: -2px 0px 3px #ccc;
        }
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
  );

  return (
    <div {...getTableProps()} className="table sticky" style={{ width: 1500, height: 500 }}>
      <div className="header">
        {stickyHeaderGroups(headerGroups).map((headerGroup: any) => (
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
              {stickyRow(row).cells.map((cell: any) => (
                <div {...cell.getCellProps()} className="td">
                  {cell.render('Cell')}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Demo() {
  const columns = useMemo(() => [
    {
      Header: ' ',
      sticky: 'left',
      columns: [
        {
          Header: 'First Name',
          accessor: 'firstName',
          width: 150,
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
          width: 150,
        },
      ],
    },
    {
      Header: 'Other Infos',
      columns: [
        {
          Header: 'Age',
          accessor: 'age',
        },
      ],
    },
    {
      Header: 'Location',
      columns: [
        {
          Header: 'Street',
          accessor: 'street',
          width: 300,
        },
        {
          Header: 'Street bis',
          accessor: 'streetBis',
          width: 300,
        },
        {
          Header: 'City',
          accessor: 'city',
        },
      ],
    },
    {
      Header: 'Contact',
      sticky: 'right',
      columns: [
        {
          Header: 'Professional Email',
          accessor: 'proEmail',
          width: 200,
        },
        {
          Header: 'Email',
          accessor: 'email',
          width: 200,
        },
      ],
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

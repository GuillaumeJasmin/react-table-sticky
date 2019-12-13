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

function Table({ columns, data }: any) {
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
    useResizeColumns,
    useSticky,
  );

  return (
    <div {...getTableProps()} className="table sticky" style={{ width: 1500, height: 500 }}>
      <div className="header">
        {/* {stickyHeaderGroups(headerGroups).map((headerGroup: any) => ( */}
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
              {/* {stickyRow(row).cells.map((cell: any) => ( */}
              {row.cells.map((cell: any) => (
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
      Header: 'Other Infos',
      sticky: 'left',
      columns: [
        {
          Header: 'Age',
          accessor: 'age',
        },
      ],
    },
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

/* eslint-disable import/no-extraneous-dependencies */

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// @ts-ignore
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import { getData } from './makeData';
import { stickyHeaderGroups, stickyRow, Sticky } from '../index';

const Styles = styled.div`
  padding: 1rem;
  font-family: Helvetica;

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
      margin: 0;
      padding: 7px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      overflow: hidden;
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
      // defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
  );

  return (
    <Sticky.Table {...getTableProps()} className="table" style={{ width: 1500, height: 500 }}>
      <Sticky.Header>
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
      </Sticky.Header>
      <Sticky.Body {...getTableBodyProps()}>
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
      </Sticky.Body>
    </Sticky.Table>
  );
}

function Demo() {
  const columns = useMemo(() => [
    {
      Header: ' ',
      fixed: 'left',
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
      fixed: 'right',
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

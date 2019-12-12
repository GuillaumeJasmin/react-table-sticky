/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

interface Column {
  Header: any;
  columns?: Column[];
  fixed?: 'left' | 'right';
  getHeaderProps: () => {
    style: object;
  };
  id: string | number;
  parent?: Column;
  totalLeft: number;
}

export const checkErrors = (columns: Column[]) => {
  const hasGroups = !!columns.find((column: Column) => column.parent);
  const fixedColumnsWithoutGroup = columns.filter((column: Column) => column.fixed && !column.parent).map(({ Header }) => `'${Header}'`);

  if (hasGroups && fixedColumnsWithoutGroup.length) {
    throw new Error(`WARNING react-table-sticky:
      \nYour ReactTable has group and fixed columns outside groups, and that will break UI.
      \nYou must place ${fixedColumnsWithoutGroup.join(' and ')} columns into a group (even a group with an empty Header label)\n`);
  }

  const bugWithUnderColumnsFixed = columns.find((parentCol) => !parentCol.fixed && parentCol.columns && parentCol.columns.find((col) => col.fixed));

  if (!bugWithUnderColumnsFixed) return;

  // @ts-ignore
  const childBugs = bugWithUnderColumnsFixed.columns.find(({ fixed }) => fixed);

  if (!childBugs) return;

  throw new Error(`WARNING react-table-sticky:
    \nYour ReactTable contain columns group with at least one child columns fixed.
    \nWhen ReactTable has columns groups, only columns groups can be fixed
    \nYou must set fixed: 'left' | 'right' for the '${bugWithUnderColumnsFixed.Header}' column, or remove the fixed property of '${childBugs.Header}' column.`);
};

export function getFixedValue(column: Column): null | 'left' | 'right' {
  if (column.fixed === 'left' || column.fixed === 'right') {
    return column.fixed;
  }

  if (column.parent) {
    return getFixedValue(column.parent);
  }

  return null;
}

export function columnIsLastLeftFixed(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const nextColumn = columns[index + 1];
  const columnIsLeftFixed = getFixedValue(column) === 'left';
  const nextColumnIsLeftFixed = nextColumn && getFixedValue(nextColumn) === 'left';
  return columnIsLeftFixed && !nextColumnIsLeftFixed;
}

export function columnIsFirstRightFixed(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const prevColumn = columns[index - 1];
  const columnIsRightFixed = getFixedValue(column) === 'right';
  const prevColumnIsRightFixed = prevColumn && getFixedValue(prevColumn) === 'right';
  return columnIsRightFixed && !prevColumnIsRightFixed;
}

export function getMarginRight(columnId: Column['id'], columns: any) {
  const currentIndex = columns.findIndex(({ id }: any) => id === columnId);
  let rightMargin = 0;
  for (let i = currentIndex + 1; i < columns.length; i += 1) {
    if (columns[i].isVisible !== false) {
      rightMargin += columns[i].width;
    }
  }

  return rightMargin;
}

function getStyleFromColumn(column: Column, columns: any) {
  const props = column.getHeaderProps();
  const fixed = getFixedValue(column);
  if (!fixed) {
    return props.style;
  }

  if (fixed !== 'left' && fixed !== 'right') {
    throw new Error(`react-table-sticky: fixed value "${fixed}" is not allowed`);
  }

  const margin = fixed === 'left'
    ? column.totalLeft
    : getMarginRight(column.id, columns);

  const isLastLeftFixed = columnIsLastLeftFixed(column.id, columns);
  const isFirstRightFixed = columnIsFirstRightFixed(column.id, columns);

  const style = {
    ...props.style,
    position: 'sticky',
    [fixed]: margin,
    zIndex: 2,
    backgroundColor: '#fff',
  };

  if (isLastLeftFixed) {
    style.boxShadow = '2px 0px 3px #ccc';
  }

  if (isFirstRightFixed) {
    style.boxShadow = '-2px 0px 3px #ccc';
  }

  return style;
}

function stickyHeaderGroup(headerGroup: any) {
  const headers = headerGroup.headers.map((header: any) => {
    return {
      ...header,
      isLastLeftFixed: columnIsLastLeftFixed(header.id, headerGroup.headers),
      getHeaderProps: () => ({
        ...header.getHeaderProps(),
        style: getStyleFromColumn(header, headers),
      }),
    };
  });

  return {
    ...headerGroup,
    headers,
  };
}

export function stickyHeaderGroups<T extends any>(headerGroups: T): T {
  return headerGroups.map((headerGroup: any, index: number) => ({
    ...stickyHeaderGroup(headerGroup),
    getHeaderGroupProps: () => {
      const props = headerGroup.getHeaderGroupProps();

      const style = {
        ...props.style,
      };

      const isLast = index === (headerGroups.length - 1);

      if (isLast) {
        style.boxShadow = '0px 3px 3px #ccc';
      }

      return {
        ...props,
        style,
      };
    },
  }));
}

export function stickyRow<T extends any>(row: T): T {
  const columns = row.cells.map((cell: any) => cell.column);
  checkErrors(columns);
  const cells = row.cells.map((cell: any) => {
    return {
      ...cell,
      getCellProps: () => ({
        ...cell.getCellProps(),
        style: getStyleFromColumn(cell.column, columns),
      }),
    };
  });

  return {
    ...row,
    cells,
  };
}

interface StickyProperties {
  body: React.CSSProperties;
  header: React.CSSProperties;
  table: React.CSSProperties;
}

export const stickyStyles: StickyProperties = {
  table: {
    overflow: 'scroll',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    background: '#fff',
  },
  body: {
    position: 'relative',
    zIndex: 0,
  },
};

function StickyTable(props: React.HTMLProps<HTMLDivElement>) {
  const { style, ...restProps } = props;
  return (
    <div
      {...restProps}
      style={{
        ...stickyStyles.table,
        ...style,
      }}
    />
  );
}

function StickyHeader(props: React.HTMLProps<HTMLDivElement>) {
  const { style, ...restProps } = props;
  return (
    <div
      {...restProps}
      style={{
        ...stickyStyles.header,
        ...style,
      }}
    />
  );
}

function StickyBody(props: React.HTMLProps<HTMLDivElement>) {
  const { style, ...restProps } = props;
  return (
    <div
      {...restProps}
      style={{
        ...stickyStyles.body,
        ...style,
      }}
    />
  );
}

export const Sticky = {
  Table: StickyTable,
  Header: StickyHeader,
  Body: StickyBody,
};

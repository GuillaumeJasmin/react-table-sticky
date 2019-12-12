/* eslint-disable import/no-extraneous-dependencies */

const constants = {
  CSSAttrLastLeftTd: 'data-sticky-last-left-td',
  CSSAttrFirstRightTd: 'data-sticky-first-right-td',
  CSSAttrLastHeaderTr: 'data-sticky-last-header-tr',
};

interface Column {
  Header: any;
  columns?: Column[];
  getHeaderProps: () => {
    style: object;
  };
  id: string | number;
  parent?: Column;
  sticky?: 'left' | 'right';
  totalLeft: number;
}

export const checkErrors = (columns: Column[]) => {
  const hasGroups = !!columns.find((column: Column) => column.parent);
  const stickyColumnsWithoutGroup = columns.filter((column: Column) => column.sticky && !column.parent).map(({ Header }) => `'${Header}'`);

  if (hasGroups && stickyColumnsWithoutGroup.length) {
    throw new Error(`WARNING react-table-sticky:
      \nYour ReactTable has group and sticky columns outside groups, and that will break UI.
      \nYou must place ${stickyColumnsWithoutGroup.join(' and ')} columns into a group (even a group with an empty Header label)\n`);
  }

  const bugWithUnderColumnsSticky = columns.find((parentCol) => !parentCol.sticky && parentCol.columns && parentCol.columns.find((col) => col.sticky));

  if (!bugWithUnderColumnsSticky) return;

  // @ts-ignore
  const childBugs = bugWithUnderColumnsSticky.columns.find(({ sticky }) => sticky);

  if (!childBugs) return;

  throw new Error(`WARNING react-table-sticky:
    \nYour ReactTable contain columns group with at least one child columns sticky.
    \nWhen ReactTable has columns groups, only columns groups can be sticky
    \nYou must set sticky: 'left' | 'right' for the '${bugWithUnderColumnsSticky.Header}'
    column, or remove the sticky property of '${childBugs.Header}' column.`);
};

export function getStickyValue(column: Column): null | 'left' | 'right' {
  if (column.sticky === 'left' || column.sticky === 'right') {
    return column.sticky;
  }

  if (column.parent) {
    return getStickyValue(column.parent);
  }

  return null;
}

export function columnIsLastLeftSticky(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const nextColumn = columns[index + 1];
  const columnIsLeftSticky = getStickyValue(column) === 'left';
  const nextColumnIsLeftSticky = nextColumn && getStickyValue(nextColumn) === 'left';
  return columnIsLeftSticky && !nextColumnIsLeftSticky;
}

export function columnIsFirstRightSticky(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const prevColumn = columns[index - 1];
  const columnIsRightSticky = getStickyValue(column) === 'right';
  const prevColumnIsRightSticky = prevColumn && getStickyValue(prevColumn) === 'right';
  return columnIsRightSticky && !prevColumnIsRightSticky;
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

function getDataAttrs(column: Column, columns: any) {
  const dataAttrs = {};

  const isLastLeftSticky = columnIsLastLeftSticky(column.id, columns);
  const isFirstRightSticky = columnIsFirstRightSticky(column.id, columns);

  if (isLastLeftSticky) {
    // @ts-ignore
    dataAttrs[constants.CSSAttrLastLeftTd] = true;
  }

  if (isFirstRightSticky) {
    // @ts-ignore
    dataAttrs[constants.CSSAttrFirstRightTd] = true;
  }

  return dataAttrs;
}

function getStyleFromColumn(column: Column, columns: any) {
  const props = column.getHeaderProps();
  const sticky = getStickyValue(column);
  if (!sticky) {
    return props.style;
  }

  if (sticky !== 'left' && sticky !== 'right') {
    throw new Error(`react-table-sticky: sticky value "${sticky}" is not allowed`);
  }

  const margin = sticky === 'left'
    ? column.totalLeft
    : getMarginRight(column.id, columns);

  return {
    ...props.style,
    position: 'sticky',
    [sticky]: margin,
    zIndex: 2,
  };
}

export function stickyHeaderGroups<T extends any>(headerGroups: T): T {
  return headerGroups.map((headerGroup: any, index: number) => ({
    ...headerGroup,
    headers: headerGroup.headers.map((header: any) => {
      return {
        ...header,
        isLastLeftSticky: columnIsLastLeftSticky(header.id, headerGroup.headers),
        getHeaderProps: () => ({
          ...header.getHeaderProps(),
          style: getStyleFromColumn(header, headerGroup.headers),
          ...getDataAttrs(header, headerGroup.headers),
        }),
      };
    }),
    getHeaderGroupProps: () => {
      const props = headerGroup.getHeaderGroupProps();
      const isLast = index === (headerGroups.length - 1);
      const dataAttrs = {};

      if (isLast) {
        // @ts-ignore
        dataAttrs[constants.CSSAttrLastHeaderTr] = true;
      }

      return {
        ...props,
        ...dataAttrs,
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
        ...getDataAttrs(cell.column, columns),
      }),
    };
  });

  return {
    ...row,
    cells,
  };
}

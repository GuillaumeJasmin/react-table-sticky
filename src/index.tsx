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

const cellStylesSticky = {
  // hard coded inline style will be remove in the next major release
  position: 'sticky',
  zIndex: 3,
};

function findHeadersSameLevel(header: any, headers: any) {
  return headers.filter((flatHeaderItem: any) => {
    return flatHeaderItem.depth === header.depth;
  });
}

function getStickyProps(header: any, instance: any) {
  let style = {};
  const dataAttrs = {};

  checkErrors(instance.columns);

  const sticky = getStickyValue(header);

  if (sticky) {
    style = {
      ...cellStylesSticky,
    };

    // @ts-ignore
    dataAttrs['data-sticky-td'] = true;

    const headers = findHeadersSameLevel(header, instance.flatHeaders);

    const margin = sticky === 'left'
      ? header.totalLeft
      : getMarginRight(header.id, headers);

    style = {
      ...style,
      [sticky]: `${margin}px`,
    };

    const isLastLeftSticky = columnIsLastLeftSticky(header.id, headers);

    if (isLastLeftSticky) {
      // @ts-ignore
      dataAttrs['data-sticky-last-left-td'] = true;
    }

    const isFirstRightSticky = columnIsFirstRightSticky(header.id, headers);

    if (isFirstRightSticky) {
      // @ts-ignore
      dataAttrs['data-sticky-first-right-td'] = true;
    }
  }

  return {
    style,
    ...dataAttrs,
  };
}

export const useSticky = (hooks: any) => {
  hooks.getHeaderProps.push((props: any, { instance, column }: any) => {
    const nextProps = getStickyProps(column, instance);
    return [props, nextProps];
  });

  hooks.getCellProps.push((props: any, { instance, cell }: any) => {
    const nextProps = getStickyProps(cell.column, instance);
    return [props, nextProps];
  });
};

useSticky.pluginName = 'useSticky';

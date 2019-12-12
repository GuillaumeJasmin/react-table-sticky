import {
  getFixedValue,
  columnIsLastLeftFixed,
  columnIsFirstRightFixed,
  getMarginRight,
} from '../index';

function createColumn(data: any) {
  return {
    Header: '',
    getHeaderProps: () => ({}),
    totalLeft: 0,
    ...data,
  };
}

describe('tests', () => {
  it('getFixedValue works with left', () => {
    const column = createColumn({ fixed: 'left' });
    expect(getFixedValue(column)).toEqual('left');
  });

  it('getFixedValue works with right', () => {
    const column = createColumn({ fixed: 'right' });
    expect(getFixedValue(column)).toEqual('right');
  });

  it('getFixedValue doesn\'t works with bad value', () => {
    const column = createColumn({ fixed: 'foo' });
    expect(getFixedValue(column)).toEqual(null);
  });

  it('getFixedValue works with parent', () => {
    const column = createColumn({
      parent: {
        fixed: 'left',
      },
    });
    expect(getFixedValue(column)).toEqual('left');
  });

  it('columnIsLastLeftFixed true', () => {
    const columns = [
      {
        id: 1,
        fixed: 'left',
      },
      {
        id: 2,
        fixed: 'left',
      },
      {
        id: 3,
      },
    ];

    expect(columnIsLastLeftFixed(2, columns)).toEqual(true);
  });

  it('columnIsLastLeftFixed false', () => {
    const columns = [
      {
        id: 1,
        fixed: 'left',
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    expect(columnIsLastLeftFixed(2, columns)).toEqual(false);
  });

  it('columnIsFirstRightFixed true', () => {
    const columns = [
      {
        id: 1,
      },
      {
        id: 2,
        fixed: 'right',
      },
      {
        id: 3,
        fixed: 'right',
      },
    ];

    expect(columnIsFirstRightFixed(2, columns)).toEqual(true);
  });

  it('columnIsFirstRightFixed false', () => {
    const columns = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
        fixed: 'right',
      },
    ];

    expect(columnIsFirstRightFixed(2, columns)).toEqual(false);
  });

  it('getMarginRight case 1', () => {
    const columns = [
      {
        id: 1,
        width: 100,
      },
      {
        id: 2,
        width: 200,
      },
      {
        id: 3,
        width: 300,
      },
    ];

    expect(getMarginRight(1, columns)).toEqual(500);
  });

  it('getMarginRight case 2', () => {
    const columns = [
      {
        id: 1,
        width: 100,
      },
      {
        id: 2,
        width: 200,
      },
      {
        id: 3,
        width: 300,
      },
    ];

    expect(getMarginRight(2, columns)).toEqual(300);
  });

  it('getMarginRight case 3', () => {
    const columns = [
      {
        id: 1,
        width: 100,
      },
      {
        id: 2,
        width: 200,
        isVisible: false,
      },
      {
        id: 3,
        width: 300,
      },
    ];

    expect(getMarginRight(1, columns)).toEqual(300);
  });
});

import {
  getStickyValue,
  columnIsLastLeftSticky,
  columnIsFirstRightSticky,
  getMarginRight,
} from '../index';

function createColumn(data: any) {
  return {
    Header: '',
    getHeader(): () => ({}),
    totalLeft: 0,
    ...data,
  };
}

describe('tests', () => {
  it('getStickyValue works with left', () => {
    const column = createColumn({ sticky: 'left' });
    expect(getStickyValue(column)).toEqual('left');
  });

  it('getStickyValue works with right', () => {
    const column = createColumn({ sticky: 'right' });
    expect(getStickyValue(column)).toEqual('right');
  });

  it('getStickyValue doesn\'t works with bad value', () => {
    const column = createColumn({ sticky: 'foo' });
    expect(getStickyValue(column)).toEqual(null);
  });

  it('getStickyValue works with parent', () => {
    const column = createColumn({
      parent: {
        sticky: 'left',
      },
    });
    expect(getStickyValue(column)).toEqual('left');
  });

  it('columnIsLastLeftSticky true', () => {
    const columns = [
      {
        id: 1,
        sticky: 'left',
      },
      {
        id: 2,
        sticky: 'left',
      },
      {
        id: 3,
      },
    ];

    expect(columnIsLastLeftSticky(2, columns)).toEqual(true);
  });

  it('columnIsLastLeftSticky false', () => {
    const columns = [
      {
        id: 1,
        sticky: 'left',
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    expect(columnIsLastLeftSticky(2, columns)).toEqual(false);
  });

  it('columnIsFirstRightSticky true', () => {
    const columns = [
      {
        id: 1,
      },
      {
        id: 2,
        sticky: 'right',
      },
      {
        id: 3,
        sticky: 'right',
      },
    ];

    expect(columnIsFirstRightSticky(2, columns)).toEqual(true);
  });

  it('columnIsFirstRightSticky false', () => {
    const columns = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
        sticky: 'right',
      },
    ];

    expect(columnIsFirstRightSticky(2, columns)).toEqual(false);
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

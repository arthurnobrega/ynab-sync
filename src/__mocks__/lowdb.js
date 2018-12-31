import savedActions from './data/savedActions.json';

class LowdbMock {
  tableName = '';

  defaults() {
    return this;
  }

  get(tableName) {
    this.tableName = tableName;

    return this;
  }

  set() {
    return this;
  }

  unset() {
    return this;
  }

  push() {
    return this;
  }

  read() {
    return this;
  }

  write() {
    return this;
  }

  remove() {
    return this;
  }

  find() {
    return this;
  }

  filter() {
    return this;
  }

  sortBy() {
    return this;
  }

  take() {
    return this;
  }

  map() {
    return this;
  }

  size() {
    return this;
  }

  assign() {
    return this;
  }

  cloneDeep() {
    return this;
  }

  value() {
    if (this.tableName === 'favoriteActions') {
      return savedActions;
    }

    return undefined;
  }
}

export default function lowdb() {
  return new LowdbMock();
}

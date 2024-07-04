import InMemoryDB from './InMemoryDB';

describe('InMemoryDB', () => {
  let db: InMemoryDB;

  beforeEach(() => {
    db = new InMemoryDB();
  });

  test('SET_OR_INC', () => {
    expect(db.SET_OR_INC('Alice', 'age', 20)).toEqual('20');
    expect(db.SET_OR_INC('Alice', 'age', 1)).toEqual('21');
    expect(db.SET_OR_INC('Bob', 'age', 24)).toEqual('24');
  });

  test('GET', () => {
    db.SET_OR_INC('Alice', 'age', 20);
    expect(db.GET('Alice', 'age')).toEqual('20');
    expect(db.GET('Alice', 'height')).toEqual('');
  });

  test('DELETE', () => {
    db.SET_OR_INC('Alice', 'age', 20);
    expect(db.DELETE('Alice', 'age')).toEqual(true);
    expect(db.DELETE('Alice', 'height')).toEqual(false);
  });

  test('TOP_N_KEYS', () => {
    db.SET_OR_INC('Bob', 'height', 170);
    db.SET_OR_INC('Bob', 'age', 27);
    db.SET_OR_INC('Bob', 'experience', 7);
    db.SET_OR_INC('Alice', 'age', 24);

    expect(db.TOP_N_KEYS(1)).toEqual(['Bob(3)']);
});

test('Additional TOP_N_KEYS Tests', () => {
    db.SET_OR_INC('Alice', 'height', 170);
    db.SET_OR_INC('Bob', 'age', 24);
    db.SET_OR_INC('Bob', 'experience', 5);
    db.SET_OR_INC('Bob', 'height', 182);
    expect(db.TOP_N_KEYS(2)).toEqual(['Bob(3)', 'Alice(1)']);
    expect(db.TOP_N_KEYS(0)).toEqual([]);
});

test('DELETE after TOP_N_KEYS', () => {
    db.SET_OR_INC('Alice', 'height', 170);
    db.SET_OR_INC('Bob', 'age', 24);
    db.SET_OR_INC('Bob', 'experience', 5);
    db.SET_OR_INC('Bob', 'height', 182);
    expect(db.DELETE('Charlie', 'age')).toEqual(false);
    expect(db.DELETE('Bob', 'age')).toEqual(true);
    expect(db.TOP_N_KEYS(1)).toEqual(['Bob(2)']);
});

test('TOP_N_KEYS with large count', () => {
    db.SET_OR_INC('Alice', 'height', 170);
    db.SET_OR_INC('Bob', 'age', 24);
    db.SET_OR_INC('Bob', 'experience', 5);
    db.SET_OR_INC('Bob', 'height', 182);
    db.SET_OR_INC('Charlie', 'age', 30);
    db.SET_OR_INC('Charlie', 'height', 180);
    db.SET_OR_INC('Dave', 'age', 22);
    db.SET_OR_INC('Dave', 'experience', 8);
    db.SET_OR_INC('Dave', 'height', 175);
    expect(db.TOP_N_KEYS(5)).toEqual(['Bob(3)', 'Dave(3)', 'Charlie(2)', 'Alice(1)']);
});


  test('SET and DELETE', () => {
    db.SET_OR_INC('Alice', 'age', 20);
    db.SET_OR_INC('Alice', 'height', 170);
    expect(db.GET('Alice', 'age')).toEqual('20');
    expect(db.DELETE('Alice', 'age')).toEqual(true);
    expect(db.GET('Alice', 'age')).toEqual('');
    expect(db.DELETE('Alice', 'age')).toEqual(false);
  });

  test('DELETE non-existing key', () => {
    expect(db.DELETE('Charlie', 'age')).toEqual(false);
  });

  test('Multiple increments', () => {
    db.SET_OR_INC('Alice', 'age', 20);
    db.SET_OR_INC('Alice', 'age', 5);
    db.SET_OR_INC('Alice', 'age', 7);
    expect(db.GET('Alice', 'age')).toEqual('32');
  });
  
  test('Negative increment', () => {
    db.SET_OR_INC('Alice', 'age', 20);
    db.SET_OR_INC('Alice', 'age', -5);
    expect(db.GET('Alice', 'age')).toEqual('15'); 
  });
   
    
});

const Objetovazio = require('./Objetovazio');

describe('Objetovazio', () => {

  test('retorna true quando o objeto está vazio', () => {
    const obj = {};
    const resultado = Objetovazio(obj);
    expect(resultado).toBe(true);
  });

  test('retorna false quando o objeto não está vazio', () => {
    const obj = { propriedade: 'valor' };
    const resultado = Objetovazio(obj);
    expect(resultado).toBe(false);
  });
  
});

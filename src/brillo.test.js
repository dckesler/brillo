const { brilloMain } = require('./brillo-main');
process.type = 'renderer';
const { brilloRenderer } = require('./brillo-renderer');
const { currentWindow } = require('electron');


brilloMain.register({
  async mainAction() {
    return 'mainResponse'
  },
  async anotherAction() {
    return 5 + 5;
  },
  async rejectedAction() {
    throw Error('things are changing!');
  },
});

brilloRenderer.register({
  async rendererAction() {
    return 'rendererResponse';
  },
  async anotherRendererAction() {
    return 20 + 20;
  },
});

describe('Brillo', () => {
  test('sending message to main process should return a response', (done) => {
    brilloRenderer.talk('mainAction').then(res => {
      expect(res).toEqual('mainResponse');
      done()
    });
  });

  test('sending message to renderer should return a response', (done) => {
    brilloMain.talk('rendererAction', null, currentWindow).then(res => {
      expect(res).toEqual('rendererResponse');
      done();
    })
  });

  test('sending another message to main should work too', (done) => {
    brilloRenderer.talk('anotherAction').then(res => {
      expect(res).toEqual(10);
      done();
    });
  });

  test('should send message to all windows', (done) => {
    brilloMain.talk('anotherRendererAction').then(res => {
      expect(res).toEqual(40);
      done();
    });
  });

  test('should handle rejected promises', (done) => {
    brilloRenderer.talk('rejectedAction').then(() => {}, err => {
      expect(err.message).toEqual('things are changing!');
      done();
    });
  });
});
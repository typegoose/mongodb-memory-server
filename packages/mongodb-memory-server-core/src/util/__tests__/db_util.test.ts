import { uriTemplate } from '../db_util';

describe('db_util', () => {
  describe('uriTemplate', () => {
    it('should not add "?" without query options', () => {
      expect(uriTemplate('0.0.0.0', 1001, 'somedb')).toEqual('mongodb://0.0.0.0:1001/somedb');
    });

    it('should add "?" with query options', () => {
      expect(uriTemplate('0.0.0.0', 1001, 'somedb', 'option1=1&option2=2')).toEqual(
        'mongodb://0.0.0.0:1001/somedb?option1=1&option2=2'
      );
    });
  });
});

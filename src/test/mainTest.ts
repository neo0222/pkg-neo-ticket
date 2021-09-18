import moment from 'moment';
import * as assert from 'power-assert';

describe('初回', async () => {
  it('test', async () => {
    assert.equal(moment('2021-09-18T09:05:49Z', 'YYYY-MM-DDTHH:mm:ssZ').format('YYYYMMDDHHmmss'), '20210918180549')
  })
})
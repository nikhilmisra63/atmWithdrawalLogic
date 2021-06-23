const { expect } = require('chai');
const { atm } = require('../../index');

describe('ATM', () => {
  it('should return a proper error message if invalid function call', async () => {
    const res = await atm();
    expect(res.message).to.be.equal('Not a Valid Call');
  });
  it('should be able to get note count of 900 RS', async () => {
    const res = await atm({ withdrawalAmount: 900 });
    expect(res[0].count).to.be.equal(1);
    expect(res[1].count).to.be.equal(2);
  });
  it('should not be able to send invalid supported notes', async () => {
    const res = await atm({ withdrawalAmount: 900, supportedNotes: 300 });
    expect(res.message).to.be.equal('Invalid Supported Notes');
  });
  it('should not be able to send invalid supported notes', async () => {
    const res = await atm({ withdrawalAmount: 900, supportedNotes: [] });
    expect(res.message).to.be.equal('Invalid Supported Notes');
  });
  it('should not be able to send invalid supported notes', async () => {
    const res = await atm({ withdrawalAmount: 900, supportedNotes: [{ note: '3012s0' }] });

    expect(res.message).to.be.equal('"[0].note" must be a number');
  });
  it('should not be able to send invalid supported notes', async () => {
    const res = await atm({ withdrawalAmount: 900, supportedNotes: [{ notes: '3012s0' }] });
    expect(res.message).to.be.equal('"[0].note" is required');
  });
  it('should be able to send supported notes', async () => {
    const res = await atm({ withdrawalAmount: 9000, supportedNotes: [{ note: 500 }, { note: 2000 }] });
    expect(res[0].count).to.be.equal(4);
    expect(res[1].count).to.be.equal(2);
  });
  it('should be able to get amount without Denomination as per the doc', async () => {
    const res = await atm({
      withdrawalAmount: 900,
      supportedNotes: [
        { note: 10 },
        { note: 20 },
        { note: 50 },
        { note: 100 },
        { note: 200 },
        { note: 500 },
        { note: 1000 }
      ]
    });
    expect(res[1].count).to.be.equal(1);
    expect(res[2].count).to.be.equal(2);
  });
  it('should be able to send Denomination', async () => {
    const res = await atm({
      withdrawalAmount: 9200,
      supportedNotes: [{ note: 500 }, { note: 2000 }],
      denomination: 2000
    });
    expect(res[0].count).to.be.equal(4);
    expect(res[1].count).to.be.equal(2);
  });
  it('should be able to send Denomination of 200', async () => {
    const res = await atm({
      withdrawalAmount: 9200,
      supportedNotes: [{ note: 500 }, { note: 2000 }, { note: 200 }],
      denomination: 2000
    });
    expect(res[0].count).to.be.equal(4);
    expect(res[1].count).to.be.equal(2);
    expect(res[2].count).to.be.equal(1);
  });
  it('should be able to get amount wit Denomination as per the doc', async () => {
    const res = await atm({
      withdrawalAmount: 900,
      supportedNotes: [
        { note: 1000 },
        { note: 500 },
        { note: 200 },
        { note: 100 },
        { note: 50 },
        { note: 20 },
        { note: 10 }
      ],
      denomination: 200
    });
    expect(res[2].count).to.be.equal(4);
    expect(res[3].count).to.be.equal(1);
  });
});

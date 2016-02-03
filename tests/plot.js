'use strict';

/* globals it, describe */
const expect = require('chai').expect;
const Plot = require('../bin/plot');

class TestPlot extends Plot {
  get requirements() {
    return ['foo', 'bar'];
  }
}

describe('Plot', () => {
  it('can getRequirements', () => {
    const t = new TestPlot();

    expect(t.getRequirements()).to.deep.equal(['foo', 'bar']);
  });
});

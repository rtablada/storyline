'use strict';

/* globals it, describe, beforeEach */
const chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Storyline = require('../bin/storyline');
const Plot = require('../bin/plot');

class SimplePlot extends Plot {
  get requirements() {
    return ['foo', 'bar'];
  }

  run(app) {
    app.spy();
  }
}

describe('Storyline', () => {
  let spy;
  let story;

  beforeEach(() => {
    spy = sinon.spy();

    const appMock = {
      expect,
      spy,
      obj: 'foo',
    };

    story = new Storyline(appMock);
  });

  it('can add a scenario', () => {
    story.addScenario('simple', SimplePlot);

    expect(story.scenarios.simple).to.equal(SimplePlot);
  });

  it('can instantiate a scenario', () => {
    story.addScenario('simple', SimplePlot);
    const scenario = story.getScenario('simple');

    expect(scenario).to.be.instanceOf(SimplePlot);
  });

  it('can run a scenario with no requirements', () => {
    story.addScenario('simple', SimplePlot);

    story.run('simple');
    expect(spy).to.have.been.calledWith();
  });
});

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
  run(app) {
    app.spy();
  }
}

class RequirePlot extends Plot {
  get requirements() {
    return ['simple'];
  }

  run(app) {
    app.spy2();
  }
}

describe('Storyline', () => {
  let spy;
  let spy2;
  let story;

  beforeEach(() => {
    spy = sinon.spy();
    spy2 = sinon.spy();

    const appMock = {
      expect,
      spy,
      spy2,
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
    expect(spy).to.have.been.called;
  });

  it('can run a scenario with some requirements', () => {
    story.addScenario('simple', SimplePlot);
    story.addScenario('double', RequirePlot);

    story.run('double');
    expect(spy, 'the run before double scenario').to.have.been.calledBefore(spy2);
  });
});

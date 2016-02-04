'use strict';

var resolve = Promise.resolve;

module.exports = class Storyline {
  constructor(app) {
    app = app || {};

    this.app = app;
    this.scenarios = {};
  }

  addPlot(name, plot) {
    this.scenarios[name] = plot;
  }

  getPlot(name) {
    const Plot = this.scenarios[name];

    if (Plot) {
      return new Plot();
    }
  }

  run(name) {
    const plot = this.getPlot(name);

    if (plot.getRequirements().length === 0) {
      return Promise.resolve(plot.run(this.app));
    }

    return Promise.all(plot.getRequirements().map((requirement) => {
      return Promise.resolve(this.run(requirement));
    })).then(() => {
      return Promise.resolve(plot.run(this.app));
    });
  }
};

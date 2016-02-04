'use strict';

module.exports = class Storyline {
  constructor(app) {
    app = app || {};

    this.app = app;
    this.scenarios = {};
  }

  addScenario(name, plot) {
    this.scenarios[name] = plot;
  }

  getScenario(name) {
    const Plot = this.scenarios[name];

    if (Plot) {
      return new Plot();
    }
  }

  run(name) {
    const plot = this.getScenario(name);

    plot.getRequirements().forEach((requirement) => {
      this.run(requirement);
    });

    plot.run(this.app);
  }
};

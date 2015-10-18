var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Ransac = factory();
})(this, function () {
  'use strict';

  var Ransac = (function () {
    function Ransac(problem) {
      _classCallCheck(this, Ransac);

      this.problem = problem;
    }

    // Get a randome sample from problem of sampleSize

    _createClass(Ransac, [{
      key: 'sample',
      value: function sample(sampleSize) {
        var sample = [];
        var currentSample = 0;
        while (currentSample < sampleSize) {
          var randomIndex = Math.floor(Math.random() * this.problem.data.length);
          // Avoid adding duplicated entries
          if (sample.indexOf(this.problem.data[randomIndex]) === -1) {
            sample.push(this.problem.data[randomIndex]);
            ++currentSample;
          }
        }
        return sample;
      }

      // Tell how good a model is, for all points. By default,
      // it uses sum of squared differences
    }, {
      key: 'modelError',
      value: function modelError(model) {
        var problem = this.problem;
        var ssd = problem.data.reduce(function (a, b) {
          var error = problem.fit(model, b);
          return a + Math.pow(error, 2);
        }, 0);
        return ssd;
      }

      // Tell which elements in data are inliers
    }, {
      key: 'classifyInliers',
      value: function classifyInliers(model, sample, options) {
        var inliers = [];
        var outliers = [];
        var problem = this.problem;
        problem.data.forEach(function (point) {
          // Exclude inliers
          if (sample.indexOf(point) === -1) {
            if (problem.fit(model, point) <= options.threshold) {
              inliers.push(point);
            } else {
              outliers.push(point);
            }
          }
        });

        return {
          inliers: inliers,
          outliers: outliers
        };
      }

      // Actually perform RANSAC model fitting
    }, {
      key: 'estimate',
      value: function estimate(options) {
        var iteration = 0;

        // When iterating, we keep track of the best model so far
        var bestSolution = {
          error: Infinity,
          model: {},
          inliers: [],
          outliers: [],
          status: 'Failed'
        };

        while (iteration < options.maxIterations) {
          // Get a Sample. Only indexes are returned
          var sample = this.sample(options.sampleSize);

          // Estimate a model from the sample
          var model = this.problem.model(sample);

          // Get the inlier set
          var pointGroups = this.classifyInliers(model, sample, options);
          var inliers = pointGroups.inliers;
          var outliers = pointGroups.outliers;

          var inliersRatio = inliers.length / parseFloat(this.problem.data.length);
          if (inliersRatio >= options.inliersRatio) {
            var candidateModel = model;
            if (options.improveModelWithConcensusSet) {
              // Found a good model. Now fit all inliers and sampled
              candidateModel = this.problem.model(inliers.concat(sample));
            }
            var candidateError = this.modelError(candidateModel);
            if (candidateError < bestSolution.error) {
              bestSolution = {
                inliers: inliers,
                outliers: outliers,
                model: candidateModel,
                error: candidateError,
                status: 'Success'
              };
            }
          }

          ++iteration;
        }

        return bestSolution;
      }
    }]);

    return Ransac;
  })();

  var ransac = Ransac;

  return ransac;
});
//# sourceMappingURL=ransac.js.map

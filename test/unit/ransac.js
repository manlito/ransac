import Ransac from '../../src/ransac';

describe('Ransac', () => {
  describe('Ransac model estimation', () => {
    var solution;
    var ransacProblem;
    var maxIterations = 30;
    beforeEach(() => {
      // Line fitting for f(x) = x
      var data = [
        [0, 0], [1, 1.1], [1, 1.3], [2, 1.9], [2, 1.6], [3, 3], [3, 2.9],
        [3, 3.3], [4, 3.8], [4, 4.4], [5, 5.3], [5, 5.1], [5, 4.9],
        [6, 5.7], [6, 6.1], [6, 6.2], [7, 6.6], [7, 7], [7, 6.5],
        [3, 8], [4, -1] // These last are our outliers
      ];
      var problem = {
        model: (p) => {
          var m = (p[1][1] - p[0][1]) / (p[1][0] - p[0][0]);
          var b = p[0][1] - m * p[0][0];
          return {
            m: m,
            b: b
          };
        },
        fit: (model, point) => {
          var yEstimated = model.m * point[0] + model.b;
          return Math.abs(point[1] - yEstimated);
        },
        data: data
      };
      // We expect adding more tests in the futuure, using same instance
      ransacProblem = new Ransac(problem);
    });

    it('should find at least 2 ouliers and a maximum of 4', () => {
      solution = ransacProblem.estimate({
        sampleSize: 2,
        threshold: 0.5,
        maxIterations: maxIterations,
        inliersRatio: 0.7,
        improveModelWithConcensusSet: false
      });
      var validatedOutliers = solution.outliers.filter((outlier) => {
        return Math.abs(outlier[0] - outlier[1]) > 3;
      }).length;
      expect(validatedOutliers >= 2 && validatedOutliers <= 4).to.equal(true);
    });

    it('should find a model close to the ground truth', () => {
      expect(solution.model.m >= 0.8 && solution.model.m <= 1.2).to.equal(true);
    });

  });
});

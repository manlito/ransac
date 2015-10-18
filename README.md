# RANSAC

Implementation of random sample consensus (RANSAC), which can be used to fit a model for your data

## Install

On Node.JS:

```sh
$ npm install --save ransac
```

On the browser:

```sh
$ bower install --save ransac
```
## Usage

Create two objects, one for the problem definition and another for options. For instance, take the 2D line fitting problem:

```javascript
var problem = {
    // Your model, is how you compute your parameters or
    // variable you want to find. Here there are m and b
    model: function(sample) {
        var p1 = sample[0];
        var p2 = sample[1];
        // You should validate p2.x != p1.x
        var m = (p2.y - p1.y) / (p2.x - p1.x);
        var b = p1.y - m * p1.x;
        return {
            m: m,
            b: b
        }
    },
    // Given model values, return a number indicate if you
    // accept the point as inlier
    fit: function(model, point) {
        var y_estimated = model.m * point.x + model.b;
        var error = point.y - y_estimated;
        return Math.abs(error);
    },

    data: data
};

var options = {
    sampleSize: 2,      // We only need 2 points to compute m and b
    threshold: 2.5,     // Used to determine if error is good enough
    maxIterations: 30,  // Number of times RANSAC will try a model
    inliersRatio: 0.7,  // To accept a model, atl least 70% of points must fit
    improveModelWithConcensusSet: false // If model function supports more than sampleSize points, set this true to improve accepted models
};

```

The format for data is an Array of what you prefer. We will rely on your fit function, which should be able to read such format. So, in the sample, format is:

```javascript
// THIS IS FOR THE 2D LINE EXAMPLE!!!! The format depends on your problem
var data = [{
    x: 0,
    y: 0.2
}, {
	x: 2,
	y: 1.9
}, {
	x: 2.1,
	y: 1.85
}];
```

Then, create your object and estime a model:


```javascript
// This is only required in Node. In Browser we use window.Ransac
var Ransac = require('ransac');

var ransacProblem = new Ransac(problem);
var solution = ransacProblem.estimate(options);
```

Solution will include the following:
```javascript
{
    inliers: inliers,
    outliers: outliers,
    model: bestModelFound,
    error: accumulatedError,
    status: 'Success'
};
```

Inliers and outliers are both arrays, with the elements classified accordingly.

The best model found is also dependent on your format (problem `model` function). Error, at this moment we use sum of squared differences, for each of your data points, where each data point uses your `fit` function.

When no model is found, status may contain 'Failed' string.

## License

MIT © [Manlio Barajas](https://www.linkedin.com/in/manlito)

[![Travis build status](http://img.shields.io/travis/manlito/ransac.svg?style=flat)](https://travis-ci.org/manlito/ransac)
[![Code Climate](https://codeclimate.com/github/manlito/ransac/badges/gpa.svg)](https://codeclimate.com/github/manlito/ransac)
[![Test Coverage](https://codeclimate.com/github/manlito/ransac/badges/coverage.svg)](https://codeclimate.com/github/manlito/ransac)
[![Dependency Status](https://david-dm.org/manlito/ransac.svg)](https://david-dm.org/manlito/ransac)
[![devDependency Status](https://david-dm.org/manlito/ransac/dev-status.svg)](https://david-dm.org/manlito/ransac#info=devDependencies)

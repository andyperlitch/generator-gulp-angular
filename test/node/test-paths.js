'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var paths = require('../../app/src/paths.js');

describe('gulp-angular generator paths script', function () {

  before(function() {
    paths(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  it('should log error if a path is not relative', function() {
    generator.options = {
      'app-path': '/absolute//path',
      'dist-path': 'relative\\path',
      'e2e-path': '/absolute/path',
      'tmp-path': 'relative/path'
    };
    sinon.spy(generator.env, 'error');
    generator.checkPaths();
    generator.env.error.should.have.been.callCount(2);
  });

  it('should store paths in the props', function() {
    generator.options = {
      'app-path': 'app-path',
      'dist-path': 'dist-path',
      'e2e-path': 'e2e-path',
      'tmp-path': 'tmp-path'
    };
    generator.storePaths();
    generator.props.paths.src.should.be.equal('app-path');
    generator.props.paths.dist.should.be.equal('dist-path');
    generator.props.paths.e2e.should.be.equal('e2e-path');
    generator.props.paths.tmp.should.be.equal('tmp-path');
  });

  it('should compute paths', function() {
    generator.props = { paths: { src: 'test/path' } };
    generator.computePaths();
    generator.computedPaths.appToBower.should.be.equal('../..');
  });

});

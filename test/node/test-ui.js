'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var ui = require('../../app/src/ui.js');

describe('gulp-angular generator ui script', function () {

  before(function() {
    ui(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  it('should change bootstrap module depending of the css preprocessor', function() {
    generator.props = {
      ui: {
        name: 'name-to-change',
        key: 'bootstrap-sass-official'
      },
      cssPreprocessor: { extension: 'scss' }
    };
    generator.handleBootstrapVersion();
    generator.props.ui.name.should.be.equal('name-to-change');
    generator.props.cssPreprocessor.extension = 'less';
    generator.handleBootstrapVersion();
    generator.props.ui.name.should.be.equal('bootstrap');
  });

  it('should set a flag when vendor styles can be preprocessed', function() {
    generator.props = {
      ui: { key: 'bootstrap' },
      cssPreprocessor: { extension: 'scss' }
    };
    generator.vendorStyles();
    generator.isVendorStylesPreprocessed.should.be.true;
    generator.props.cssPreprocessor.extension = 'less';

    generator.vendorStyles();
    generator.isVendorStylesPreprocessed.should.be.true;
    generator.props.ui.key = 'foundation';

    generator.vendorStyles();
    generator.isVendorStylesPreprocessed.should.be.false;
  });

  it('should add right files depending choices', function() {
    generator.props = {
      router: { module: null },
      ui: { key: 'none' },
      cssPreprocessor: { extension: 'scss' }
    };
    generator.isVendorStylesPreprocessed = true;
    generator.files = [];
    generator.uiFiles();
    generator.files[0].src.should.be.equal('src/components/navbar/__none-navbar.html');
    generator.files[1].src.should.be.equal('src/app/__none-index.scss');
    generator.files.length.should.be.equal(2);

    generator.props.router.module = 'ngRoute';
    generator.props.ui.key = 'bootstrap';
    generator.files = [];
    generator.uiFiles();
    generator.files.length.should.be.equal(4);
  });

  it('should add right files depending choices', function() {
    
  });

});

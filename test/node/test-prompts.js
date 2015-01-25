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

var prompts = require('../../app/src/prompts.js');
var promptsJson = require('../../app/prompts.json');
var mockPrompts = require('../../app/src/mock-prompts.js');

describe('gulp-angular generator prompts script', function () {

  before(function() {
    prompts(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  it('should ignore default if option not set', function() {
    sinon.spy(generator, 'log');
    generator.defaultOption();
    generator.props.should.be.deep.equal({});
    generator.log.should.have.not.been.called;
  });

  it('should use default props if option is set', function() {
    sinon.spy(generator, 'log');
    generator.options['default'] = true;
    generator.defaultOption();
    generator.props.should.be.deep.equal(mockPrompts.defaults);
    var logLines = 3 + _.flatten(_.values(generator.props)).length;
    generator.log.should.have.been.callCount(logLines);
  });

  it('should ignore .yo-rc if not found', function() {
    sinon.stub(generator.config, 'get').returns(null);
    sinon.spy(generator, 'prompt');
    generator.checkYoRc();
    generator.prompt.should.have.not.been.called;
  });

  it('should ask to use .yo-rc if found and do nothing if refused', function() {
    sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
    sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: false });
    generator.checkYoRc();
    generator.prompt.should.have.been.called;
    generator.props.should.be.deep.equal({});
  });

  it('should ask to use .yo-rc if found and use them if accepted', function() {
    sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
    sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: true });
    generator.checkYoRc();
    generator.prompt.should.have.been.called;
    generator.props.should.be.deep.equal(mockPrompts.defaults);
  });

  it('should prepare when functions and ask all questions', function() {
    sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'none' } });
    generator.askQuestions();
    _.findWhere(promptsJson, {name: 'bootstrapComponents'}).when.should.be.a('function');
    _.findWhere(promptsJson, {name: 'foundationComponents'}).when.should.be.a('function');
    generator.prompt.should.have.been.called;
    generator.props.bootstrapComponents.should.be.an('object');
    generator.props.foundationComponents.should.be.an('object');
  });

  it('should set advanced flags event if non advanced mode', function() {
    generator.askAdvancedQuestions();
    generator.includeModernizr.should.be.false;
    generator.imageMin.should.be.false;
    generator.qrCode.should.be.false;
  });

  it('should ask advanced questions when advanced mode', function() {
    generator.options.advanced = true;
    sinon.stub(generator, 'prompt').callsArgWith(1, {
      advancedFeatures: ['modernizr', 'imagemin', 'qrcode']
    });
    generator.askAdvancedQuestions();
    generator.includeModernizr.should.be.true;
    generator.imageMin.should.be.true;
    generator.qrCode.should.be.true;
  });

});

var htmlparserToVdom = require('../../lib/htmlparser-to-vdom');
var parseHTML = require('../../lib/parse-html');
var convertHTML = require('../../lib/html-to-vdom');

var VNode = require('vtree/vnode');

describe('htmlparser-to-vdom', function () {

    describe('when converting a tag', function () {

        it('parses a plain div correctly', function () {

            var html = '<div></div>';

            return convertHTML(html).then(function (converted) {
                converted.tagName.should.equal('div');
            })
        });

        it('parses a div with an ID correctly', function () {

            var html = '<div id="test"></div>';

            return convertHTML(html).then(function (converted) {
                converted.properties.id.should.equal('test');

            })
        });

        it('parses a div with classes correctly', function () {

            var html = '<div class="foo bar"></div>';

            return convertHTML(html).then(function (converted) {
                converted.properties.className.should.equal('foo bar')
            })
        });

        it('parses an input with tabIndex correctly', function () {

            var html = '<input tabIndex="1"></input>';

            return convertHTML(html).then(function (converted) {
                converted.properties.tabIndex.should.equal("1");
            })
        });
    });

    describe('when converting a tag with data attributes', function () {
        it('converts a single data attribute correctly', function () {

            var html = '<div data-test="foobar"></div>';

            return convertHTML(html).then(function (converted) {

                should.exist(converted.properties.dataset.test);
                converted.properties.dataset.test.should.eql('foobar');

                should.exist(converted.properties['data-test']);
                converted.properties['data-test'].should.eql('foobar');
            });
        });

         it('converts multiple data attributes correctly', function () {

            var html = '<div data-test="foobar" data-foobar="test"></div>';

            return convertHTML(html).then(function (converted) {

                should.exist(converted.properties.dataset.test);
                converted.properties.dataset.test.should.eql('foobar');

                should.exist(converted.properties['data-test']);
                converted.properties['data-test'].should.eql('foobar');

                should.exist(converted.properties.dataset.foobar);
                converted.properties.dataset.foobar.should.eql('test');

                should.exist(converted.properties['data-foobar']);
                converted.properties['data-foobar'].should.eql('test');
            });
        });
    });

    describe('when converting a tag containing text', function () {
        it('converts to a tag with a child VText node correctly', function () {
            var html = '<div>Test</div>';
            return convertHTML(html).then(function(converted) {

                should.exist(converted.children);
                converted.children.length.should.eql(1);
                converted.children[0].text.should.eql('Test');
            });
        });
    });

    describe('when converting a tag containing a child tag', function () {
        it('converts to a tag with a child node correctly', function () {
            var html = '<div class="parent"><span class="child"></span></div>';
            return convertHTML(html).then(function(converted) {

                converted.tagName.should.eql('div');
                converted.properties.className.should.eql('parent');

                should.exist(converted.children);
                converted.children.length.should.eql(1);
                converted.children[0].tagName.should.eql('span');
                converted.children[0].properties.className.should.eql('child');
            });
        });
    });

    describe('when converting a tag containing a child tag with text', function () {
        it('converts to a tag with a child node correctly', function () {
            var html = '<div class="parent"><span class="child">Test</span></div>';
            return convertHTML(html).then(function(converted) {

                converted.tagName.should.eql('div');
                converted.properties.className.should.eql('parent');

                should.exist(converted.children);
                converted.children.length.should.eql(1);
                converted.children[0].tagName.should.eql('span');
                converted.children[0].properties.className.should.eql('child');

                converted.children[0].children[0].text.should.eql('Test');
            });
        });
    });

});
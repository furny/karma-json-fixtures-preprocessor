module.exports = (function () {
    'use strict';

    var util = require('util');

    function getTemplate(varName) {
        varName = varName ? varName : '__fixtures__';

        return 'window.' + varName + ' = window.' + varName + ' || {};\n' +
            'window.' + varName + '[\'%s\'] = %s;\n';
    }

    function createJsonFixturesPreprocessor(basePath, config) {
        config = typeof config === 'object' ? config : {};

        var stripPrefix = new RegExp('^' + (config.stripPrefix || '')),
            prependPrefix = config.prependPrefix || '';

        var transformPath = config.transformPath || function(filepath) {
                return filepath.replace(/\.json$/, '.js');
            };

        return function (content, file, done) {
            var fixtureName = file.originalPath
                .replace(basePath + '/', '')
                .replace(/\.json$/, '');

            // Set the template
            var template = getTemplate(config.variableName);

            // Update the fixture name
            fixtureName = prependPrefix + fixtureName.replace(stripPrefix, '');

            // transform file path
            file.path = transformPath(file.path);

            done(util.format(template, fixtureName, content));
        };
    }

    createJsonFixturesPreprocessor.$inject = ['config.basePath', 'config.jsonFixturesPreprocessor'];

    return createJsonFixturesPreprocessor;
})();

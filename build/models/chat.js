'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bookshelf = require('../bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _bookshelf2.default.Model.extend({
    tableName: 'chats',
    hasTimestamps: true,
    messages: function messages() {
        return this.hasMany(_message2.default);
    }
});
//# sourceMappingURL=chat.js.map
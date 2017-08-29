'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bookshelf = require('../bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

var _chat2 = require('./chat');

var _chat3 = _interopRequireDefault(_chat2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bookshelf2.default.plugin('pagination');

exports.default = _bookshelf2.default.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    chat: function chat() {
        return this.belongsTo(_chat3.default);
    }
});
//# sourceMappingURL=message.js.map
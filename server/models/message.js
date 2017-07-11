import bookshelf from '../bookshelf';
import chat from './chat';

export default bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    chat: function() {
        return this.belongsTo(chat);
    },
})
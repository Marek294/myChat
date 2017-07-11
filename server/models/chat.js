import bookshelf from '../bookshelf';
import message from './message';

export default bookshelf.Model.extend({
    tableName: 'chats',
    hasTimestamps: true,
    messages: function() {
        return this.hasMany(message);
    }
})
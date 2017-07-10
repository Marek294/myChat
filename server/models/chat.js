import bookshelf from '../bookshelf';

export default bookshelf.Model.extend({
    tableName: 'chats',
    hasTimestamps: true
})
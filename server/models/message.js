import bookshelf from '../bookshelf';

export default bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true
})
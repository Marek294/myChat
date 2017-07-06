import bookshelf from '../bookshelf';

export default bookshelf.Model.extend({
    tableName: 'friends',
    hasTimestamps: true
})
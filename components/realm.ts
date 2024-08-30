import Realm from 'realm';

const ItemSchema = {
  name: 'Item',
  properties: {
    id: 'int',
    name: 'string',
  },
  primaryKey: 'id',
};

const realm = new Realm({ schema: [ItemSchema] });

export default realm;
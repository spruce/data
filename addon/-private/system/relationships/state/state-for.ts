import Store from '../../store';

type TmodelName = string;
type TclientId = string;
type TpropertyName = string;

interface IRelationshipStateCache {
  [modelName: string]: ITypeDict;
}
interface ITypeDict {
  [clientId: string]: IResourceDict;
}

interface IResourceDict {
  [propertyName: string]: RelationshipState;
}

const STORE_MAP = new WeakMap<Store, IRelationshipStateCache>();

/**
 * @method relationshipStateFor
 *
 * @param {Store} store - an instance of an `ember-data` store service
 * @param {string} modelName - the associated modelName
 * @param {string} clientId - the associated clientId
 * @param {string} propertyName - the property of the relationship on the Model
 *
 * @returns {RelationshipState} - a state bucket for the associated relationship
 */
export default function relationshipStateFor(
  store: Store,
  modelName: TmodelName,
  clientId: TclientId,
  propertyName: TpropertyName
): RelationshipState {
  let storeMap = STORE_MAP.get(store);

  if (storeMap === undefined) {
    storeMap = Object.create(null);
    STORE_MAP.set(store, storeMap);
  }

  let typeDict: ITypeDict = (storeMap[modelName] = storeMap[modelName] || Object.create(null));
  let resourceDict: IResourceDict = (typeDict[clientId] =
    typeDict[clientId] || Object.create(null));

  return (resourceDict[propertyName] =
    resourceDict[propertyName] ||
    new RelationshipState({
      store,
      modelName,
      clientId,
      propertyName,
    }));
}

export class RelationshipState {
  private store: Store;
  modelName: TmodelName;
  clientId: TclientId;
  propertyName: TpropertyName;

  constructor(props) {
    Object.assign(this, props);
  }
}

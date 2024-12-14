import { OrbisDB } from '@useorbis/db-sdk';
import { ModelDefinition } from '@ceramicnetwork/stream-model';

const createModel = async (modelDefinition: ModelDefinition, db: OrbisDB) =>
    await db.ceramic.createModel(modelDefinition);
  
export default createModel;
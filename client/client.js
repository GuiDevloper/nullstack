import { generateContext } from './context';
import Scope from './scope';

const client = new Scope();

client.generateContext = generateContext;

export default client;
import { connectContext } from 'react-connect-context';

import { Consumer } from './boardEditorContext';

export default (WrappedComponent) => {
  return connectContext(Consumer)(WrappedComponent);
};
import { connectContext } from 'react-connect-context';

import { Consumer } from './timelineEditorContext';

export default (WrappedComponent) => {
  return connectContext(Consumer)(WrappedComponent);
};
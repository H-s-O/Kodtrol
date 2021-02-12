import { validateAll } from './validatorHelpers';

export default ({ triggers }) => validateAll({
  triggers: triggers.every(({ name, layer, hotkey }) => !!name && !!layer && !!hotkey),
});

import { type Editor } from 'slate';
import { withInlineMath } from './withInlineMath';

export const withAllPlugins = (editor: Editor): Editor => {
  [withInlineMath].forEach((plugin) => {
    if (typeof plugin === 'function') plugin(editor);
  });

  return editor;
};

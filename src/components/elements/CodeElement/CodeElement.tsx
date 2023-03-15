import { Transforms } from 'slate';
import { ReactEditor, useSlate, type RenderElementProps } from 'slate-react';
import { LanguageSelect } from '../../inputs/LanguageSelect';

import './style.css';

export const CodeElement = ({
  attributes,
  element,
  children
}: RenderElementProps): React.ReactElement => {
  const editor = useSlate();

  const setLanguage = (language: string): void => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language }, { at: path });
  };

  return (
    <div {...attributes} className="code-block" spellCheck={false}>
      <LanguageSelect
        value={element.language}
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
      />
      {children}
    </div>
  );
};

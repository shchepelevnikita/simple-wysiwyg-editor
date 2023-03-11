import { useSlate } from 'slate-react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { Button } from '../Button/Button';
import { Icon } from '../../icons/Icon/Icon';
import { isBlockActive } from '../../../utils/utils';
import { type Align, type BlockButtonProps } from '../../../types/types';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES: Align[] = ['left', 'center', 'right', 'justify'];

const toggleBlock = (editor: Editor, format: string): void => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format as Align) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format as Align),
    split: true
  });

  let newProperties: Partial<SlateElement>;

  if (TEXT_ALIGN_TYPES.includes(format as Align)) {
    newProperties = {
      align: isActive ? undefined : (format as Align)
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    };
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({ format, icon }: BlockButtonProps): React.ReactElement => {
  const editor = useSlate();

  return (
    <Button
      className="button mark-button"
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format as Align) ? 'align' : 'type'
      )}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}>
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default BlockButton;

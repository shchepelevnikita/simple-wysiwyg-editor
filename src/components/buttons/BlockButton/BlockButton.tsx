import { useSlate } from 'slate-react';
import { Button } from '../Button/Button';
import { Icon } from '../../icons/Icon/Icon';
import { isBlockActive } from '../../../utils/utils';
import { type Align, type BlockButtonProps } from '../../../types/types';
import { TEXT_ALIGN_TYPES } from '../../../config/const';

const BlockButton = ({ format, icon, onClick }: BlockButtonProps): React.ReactElement => {
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
        onClick(editor, format);
      }}>
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default BlockButton;

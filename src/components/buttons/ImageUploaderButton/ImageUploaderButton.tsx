import { type SyntheticEvent, useRef } from 'react';
import { useSlate } from 'slate-react';
import { ImageUploader } from '../../../services/ImageUploader';
import { type ImageButtonProps } from '../../../types/types';
import { insertImage, isBlockActive } from '../../../utils/utils';
import { Icon } from '../../icons/Icon/Icon';

export const ImageUploaderButton = ({ icon }: ImageButtonProps): React.ReactElement => {
  const editor = useSlate();
  const imageInput: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
  const isButtonEnabled = isBlockActive(editor, 'paragraph');

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files == null) return;

    const file = event.target.files[0];
    ImageUploader.getBase64FromFile(file).then(
      (base64: unknown) => {
        insertImage(editor, base64);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onImageButtonMouseDown = (event: SyntheticEvent): void => {
    if (!isButtonEnabled) return;
    if (imageInput.current == null) return;

    event.preventDefault();
    imageInput.current.value = '';
    imageInput.current.click();
  };

  return (
    <div
      onMouseDown={onImageButtonMouseDown}
      className="button mark-button"
      style={getButtonStyle(isButtonEnabled)}
    >
      <Icon>{icon}</Icon>
      <input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        ref={imageInput}
        onChange={uploadImage}
        style={{ display: 'none' }}
      />
    </div>
  );
};

const getButtonStyle = (isButtonEnabled: boolean) => ({
  cursor: isButtonEnabled ? 'pointer' : 'arrow',
  padding: '0 10px'
});

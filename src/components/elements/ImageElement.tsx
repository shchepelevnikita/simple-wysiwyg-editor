import React, { useState, useRef } from 'react';
import {
  useSelected,
  useFocused,
  ReactEditor,
  useSlate,
  type RenderElementProps
} from 'slate-react';
import { type Path, Transforms } from 'slate';
import { Resizable, type NumberSize } from 're-resizable';
import { type Direction } from 're-resizable/lib/resizer';
import { type Align } from '../../types/types';

export const ImageElement = ({
  attributes,
  element,
  children
}: RenderElementProps): React.ReactElement => {
  const selected = useSelected();
  const focused = useFocused();

  const editor = useSlate();

  const [width, setWidth] = useState<number>((element.width as number) || 200);
  const [height, setHeight] = useState<number>((element.height as number) || 200);
  const [theta, setTheta] = useState(Math.PI / 4); // 45 degrees or aspect ratio = 1

  const imgRef: React.MutableRefObject<HTMLImageElement | null> = useRef(null);

  const onResizeStart = (): void => {
    ReactEditor.focus(editor);
    Transforms.select(editor, getElementPath());
  };

  const onResizeStop = (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    elementRef: HTMLElement,
    d: NumberSize
  ): void => {
    updateElementDimensions(d.width, d.height);
    setWidth(width + d.width);
    setHeight(height + d.height);
  };

  const updateElementDimensions = (difWidth: number, difHeight: number): void => {
    Transforms.setNodes(
      editor,
      { width: width + difWidth, height: difHeight + height },
      { at: getElementPath() }
    );
  };

  const getElementPath = (): Path => {
    return ReactEditor.findPath(editor, element);
  };

  const setBestImageDimensions = (): void => {
    if (imgRef.current == null) return;

    const refWidth = (element.width || imgRef.current.naturalWidth) as number;
    const refHeight = (element.height || imgRef.current.naturalHeight) as number;
    const refTheta = Math.atan(refHeight / refWidth);

    const desirableWidth = minDiagonal * Math.cos(refTheta);
    const desirableHeight = minDiagonal * Math.sin(refTheta);
    const refDiagonal = Math.sqrt(refWidth ** 2 + refHeight ** 2);

    setWidth(isRefDiagonalSmallerThanMinimum(refDiagonal) ? desirableWidth : refWidth);
    setHeight(isRefDiagonalSmallerThanMinimum(refDiagonal) ? desirableHeight : refHeight);
    setTheta(refTheta);
  };

  return (
    <div {...attributes}>
      <div contentEditable={false} style={getResizableStyle(element.align)}>
        <Resizable
          size={{ width, height }}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          lockAspectRatio={true}
          minWidth={minDiagonal * Math.cos(theta)}
          minHeight={minDiagonal * Math.sin(theta)}
          maxWidth={maxDiagonal * Math.cos(theta)}
          maxHeight={maxDiagonal * Math.sin(theta)}>
          <img
            ref={imgRef}
            src={element.base64 as string}
            alt="mio editor custom"
            style={getImgStyle(selected, focused)}
            onLoad={setBestImageDimensions}
          />
        </Resizable>
      </div>
      {children}
    </div>
  );
};

const minDiagonal = 100;
const maxDiagonal = 700;

const isRefDiagonalSmallerThanMinimum = (refDiagonal: number): boolean => refDiagonal < minDiagonal;

const getResizableStyle = (align: Align | undefined): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: align
});

const getImgStyle = (selected: boolean, focused: boolean): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  height: '100%',

  boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`
});

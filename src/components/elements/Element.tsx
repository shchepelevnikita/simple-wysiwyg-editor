import { BlockMath } from 'react-katex';
import { type RenderElementProps } from 'slate-react';
import { ImageElement } from './ImageElement';

export const Element = ({
  attributes,
  children,
  element
}: RenderElementProps): React.ReactElement => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'image':
      return (
        <ImageElement attributes={attributes} element={element}>
          {children}
        </ImageElement>
      );
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'block-math':
      return <BlockMath {...attributes}>{children}</BlockMath>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

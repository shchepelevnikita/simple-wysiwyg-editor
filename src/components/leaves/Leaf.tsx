import { type RenderLeafProps } from 'slate-react';

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps): React.ReactElement => {
  if (leaf.bold ?? true) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code ?? true) {
    children = <code>{children}</code>;
  }

  if (leaf.italic ?? true) {
    children = <em>{children}</em>;
  }

  if (leaf.underline ?? true) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

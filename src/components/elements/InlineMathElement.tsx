import React from 'react';
import { useSelected, useFocused, type RenderElementProps } from 'slate-react';
import { MathJax } from 'better-react-mathjax';

export const InlineMathElement = ({
  attributes,
  element,
  children
}: RenderElementProps): React.ReactElement => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <span {...attributes} style={_getStyle(selected, focused)} contentEditable={false}>
      <MathJax inline>{element.content}</MathJax>
      {children}
    </span>
  );
};

const _getStyle = (selected: boolean, focused: boolean): React.CSSProperties => ({
  boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`
});

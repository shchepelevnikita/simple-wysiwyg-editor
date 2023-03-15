import { useState, useEffect } from 'react';
import { type Path, Transforms } from 'slate';
import {
  ReactEditor,
  useSelected,
  useFocused,
  useSlate,
  type RenderElementProps
} from 'slate-react';
import { MathJax } from 'better-react-mathjax';
import { type MathViewProps } from '../../types/types';

export const MathElement = ({
  attributes,
  element,
  children
}: RenderElementProps): React.ReactElement => {
  const [mathString, setMathString] = useState('');

  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();

  useEffect(() => {
    setMathString((element.children[0].text as string) || '');
  }, [element.children]);

  function onMathClick(): void {
    ReactEditor.focus(editor);
    Transforms.select(editor, getElementPath());
  }

  function getElementPath(): Path {
    return ReactEditor.findPath(editor, element);
  }

  return (
    <div {...attributes} style={{ position: 'relative' }}>
      <div
        style={getMathViewStyle(selected, focused)}
        contentEditable={false}
        onClick={onMathClick}>
        <MathView mathString={mathString} />
      </div>
      <div style={getMathEditorStyle(selected, focused)}>{children}</div>
    </div>
  );
};

const MathView = ({ mathString }: MathViewProps): React.ReactElement => {
  const content = mathString === '' ? 'color(grey)(text(Type an equation below))' : mathString;

  return (
    <div>
      <MathJax>{content}</MathJax>
    </div>
  );
};

const getMathViewStyle = (selected: boolean, focused: boolean): React.CSSProperties => {
  const defaultStyle: React.CSSProperties = {
    inlineSize: 'fit-content',
    margin: 'auto',
    padding: '5px',
    userSelect: 'none'
  };

  if (!selected || !focused) return defaultStyle;
  return {
    boxShadow: '0 0 0 2px #03396c',
    ...defaultStyle
  };
};

const getMathEditorStyle = (selected: boolean, focused: boolean): React.CSSProperties => {
  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translate(-50%, 120%)',
    zIndex: 100,
    userSelect: 'none'
  };

  if (!selected || !focused) {
    return {
      opacity: 0,
      ...defaultStyle
    };
  }

  return {
    background: 'white',
    border: '#03396c solid 2px',
    fontSize: '0.8em',
    padding: '3px',
    minWidth: '20px',
    ...defaultStyle
  };
};

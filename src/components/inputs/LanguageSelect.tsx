import './style.css';

export const LanguageSelect = (props: JSX.IntrinsicElements['select']): React.ReactElement => {
  return (
    <select contentEditable={false} className="language-select" {...props}>
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
};

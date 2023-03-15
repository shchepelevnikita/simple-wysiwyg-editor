import { toCodeLines } from '../utils/utils';

export const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: "Here's one containing a single paragraph block with some text in it:" }]
  },
  {
    type: 'code-block',
    language: 'jsx',
    children: toCodeLines(`// Add the initial value.
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }]
  }
]
const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <Slate editor={editor} value={initialValue}>
      <Editable />
    </Slate>
  )
}`)
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'If you are using TypeScript, you will also need to extend the Editor with ReactEditor and add annotations as per the documentation on TypeScript. The example below also includes the custom types required for the rest of this example.'
      }
    ]
  },
  {
    type: 'code-block',
    language: 'typescript',
    children: toCodeLines(`// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}`)
  },
  {
    type: 'paragraph',
    children: [{ text: 'There you have it!' }]
  }
];

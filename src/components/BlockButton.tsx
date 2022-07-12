import {useSlate} from "slate-react";
import {Editor, Transforms, Element as SlateElement} from "slate";
import {Button} from "./Button";
import {Icon} from "./Icon";

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isBlockActive = (editor: Editor, format: any, blockType = 'type') => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                // @ts-ignore
                n[blockType] === format,
        })
    )

    return !!match
}

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format as string) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format as string)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties: Partial<SlateElement>
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            // @ts-ignore
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            // @ts-ignore
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        // @ts-ignore
        Transforms.wrapNodes(editor, block)
    }
}

// @ts-ignore
const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            )}
            onMouseDown={(event: { preventDefault: () => void; }) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

export default BlockButton;

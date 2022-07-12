import {useSlate} from "slate-react";
import {isMarkActive, toggleMark} from "./ContentEditor";
import {Button} from "./Button";
import {Icon} from "./Icon";

// @ts-ignore
const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event: { preventDefault: () => void; }) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

export default MarkButton;

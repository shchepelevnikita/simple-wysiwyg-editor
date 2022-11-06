import {useSlate} from "slate-react";
import {isMarkActive, toggleMark} from "../ContentEditor";
import {Button} from "../Button/Button";
import {Icon} from "../Icon/Icon";
import {MarkButtonProps} from "../../types/types";

const MarkButton = ({ format, icon }: MarkButtonProps) => {
    const editor = useSlate();
    return (
        <Button className="button mark-button"
                active={isMarkActive(editor, format)}
                onClick={(event) => {
                    event.preventDefault();
                    toggleMark(editor, format);
                }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

export default MarkButton;

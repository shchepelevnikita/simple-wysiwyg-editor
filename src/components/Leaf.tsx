import { InlineMath } from 'react-katex';

// @ts-ignore
// TODO: write interface, do something with if clauses
export const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.inlineMath) {
        children = <InlineMath>\int_0^\infty x^2 dx</InlineMath>
    }

    return <span {...attributes}>{children}</span>
};

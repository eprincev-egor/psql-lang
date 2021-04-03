import { parseUnicode } from "./parseUnicode";

export function escapeUnicodes(content: string, escape: string): string {
    for (let i = 0, n = content.length; i < n; i++) {
        const symbol = content[i];
        let length;

        if ( symbol === escape ) {
            let expr;
            if ( content[i + 1] === "+" ) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                length = 8;
                expr = content.slice(i + 2, i + length);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                length = 5;
                expr = content.slice(i + 1, i + length);
            }

            expr = parseUnicode(expr);
            n -= (length - 1);
            content = content.slice(0, i) + expr + content.slice(i + length);
        }
    }

    return content;
}
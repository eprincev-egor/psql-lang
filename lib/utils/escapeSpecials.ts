import { parseUnicode } from "./parseUnicode";

const specials: {
    [special: string]: string;
} = {
    n: "\n",
    r: "\r",
    f: "\f",
    b: "\b",
    t: "\t"
};

export function escapeSpecials(string: string): string {
    return string
        .replace(/\\U(\d{8})/g, (string_, unicode) => {
            return parseUnicode(unicode);
        })
        .replace(/\\u([\da-f]{4})/g, (string_, unicode) => {
            return parseUnicode(unicode);
        })
        .replace(/\\x([\da-f]{1,2})/g, (string_, unicode: string) => {
            return parseUnicode(`00${unicode}`);
        })
        .replace(/\\([0-7]{1,3})/g, (string_, octUnicode: string) => {
            const dec = Number.parseInt( octUnicode, 8 );
            const unicode = dec.toString(16);
            return parseUnicode(unicode);
        })
        .replace(/\\(.)/g, (string_, special: string) => {
            const escaped = specials[special];
            if ( escaped ) {
                return escaped;
            }

            return special;
        })
        .replace(/''/g, "'")
    ;
}
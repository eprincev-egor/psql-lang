export function parseUnicode(unicode: string): string {

    // unicode can be valid js code
    if ( !/^[\da-f]+$/i.test(unicode) || /^0+$/.test(unicode) ) {
        throw new Error("invalid input unicode: " + unicode);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const char = eval("'\\u{" + unicode + "}'") as string;
    return char;
}
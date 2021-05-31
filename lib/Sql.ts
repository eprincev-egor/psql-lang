import { AbstractLang } from "abstract-lang";
import { LineComment } from "./base/LineComment";
import { MultilineComment } from "./base/MultilineComment";

export class Sql extends AbstractLang {
    static Comments = [LineComment, MultilineComment];
}
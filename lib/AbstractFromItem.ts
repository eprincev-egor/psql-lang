import { AbstractNode } from "abstract-lang";
import { Join } from "./Join";
import { Name } from "./Name";

export interface FromItemRow {
    joins?: Join[];
    as?: Name;
}

export abstract class AbstractFromItem<TRow extends FromItemRow>
    extends AbstractNode<TRow> {}
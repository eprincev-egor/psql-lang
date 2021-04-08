import { SubExpression } from "./SubExpression";
import { Expression } from "./Expression";

// fix infinity recursion
export const cycle: Partial<{
    SubExpression: typeof SubExpression;
    Expression: typeof Expression;
}> = {};
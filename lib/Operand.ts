import { BooleanLiteral } from "./BooleanLiteral";
import { ByteStringLiteral } from "./ByteStringLiteral";
import { ColumnReference } from "./ColumnReference";
import { IntervalLiteral } from "./IntervalLiteral";
import { NullLiteral } from "./NullLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { StringLiteral } from "./StringLiteral";
import { Variable } from "./Variable";
import { BinaryOperator } from "./BinaryOperator";
import { PostUnaryOperator } from "./PostUnaryOperator";
import { PreUnaryOperator } from "./PreUnaryOperator";
import { SubExpression } from "./SubExpression";
import { Expression } from "./Expression";
import { InOperator } from "./InOperator";
import { NotInOperator } from "./NotInOperator";
import { ArrayLiteral } from "./ArrayLiteral";
import { CaseWhen } from "./CaseWhen";

export type Operand = (
    NumberLiteral |
    StringLiteral |
    Variable |
    ColumnReference |
    NullLiteral |
    BooleanLiteral |
    ByteStringLiteral |
    IntervalLiteral |
    BinaryOperator |
    PostUnaryOperator |
    PreUnaryOperator |
    SubExpression |
    InOperator |
    NotInOperator |
    ArrayLiteral |
    CaseWhen
);

// fix infinity recursion
export const cycle: Partial<{
    NumberLiteral: typeof NumberLiteral;
    StringLiteral: typeof StringLiteral;
    Variable: typeof Variable;
    ColumnReference: typeof ColumnReference;
    NullLiteral: typeof NullLiteral;
    BooleanLiteral: typeof BooleanLiteral;
    ByteStringLiteral: typeof ByteStringLiteral;
    IntervalLiteral: typeof IntervalLiteral;
    BinaryOperator: typeof BinaryOperator;
    PostUnaryOperator: typeof PostUnaryOperator;
    PreUnaryOperator: typeof PreUnaryOperator;
    SubExpression: typeof SubExpression;
    Expression: typeof Expression;
    InOperator: typeof InOperator;
    NotInOperator: typeof NotInOperator;
    ArrayLiteral: typeof ArrayLiteral;
    CaseWhen: typeof CaseWhen;
}> = {};
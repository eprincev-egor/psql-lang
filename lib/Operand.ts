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
import { InOperator } from "./InOperator";
import { NotInOperator } from "./NotInOperator";
import { ArrayLiteral } from "./ArrayLiteral";
import { CaseWhen } from "./CaseWhen";
import { FunctionCall } from "./FunctionCall";
import { EqualAnyArray } from "./EqualAnyArray";
import { EqualSomeArray } from "./EqualSomeArray";
import { SubQuery } from "./SubQuery";
import { MakeInterval } from "./MakeInterval";

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
    CaseWhen |
    EqualAnyArray |
    EqualSomeArray |
    FunctionCall |
    SubQuery |
    MakeInterval
);

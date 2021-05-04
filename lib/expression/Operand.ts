import { BooleanLiteral } from "./literal/BooleanLiteral";
import { ByteStringLiteral } from "./literal/ByteStringLiteral";
import { ColumnReference } from "./operand/ColumnReference";
import { IntervalLiteral } from "./literal/IntervalLiteral";
import { NullLiteral } from "./literal/NullLiteral";
import { NumberLiteral } from "./literal/NumberLiteral";
import { StringLiteral } from "./literal/StringLiteral";
import { Variable } from "./operand/Variable";
import { BinaryOperator } from "./operator/BinaryOperator";
import { PostUnaryOperator } from "./operator/PostUnaryOperator";
import { PreUnaryOperator } from "./operator/PreUnaryOperator";
import { SubExpression } from "./operand/SubExpression";
import { InOperator } from "./operator/InOperator";
import { ArrayLiteral } from "./literal/ArrayLiteral";
import { CaseWhen } from "./operand/CaseWhen";
import { FunctionCall } from "./operand/FunctionCall";
import { EqualAnyArray } from "./operator/EqualAnyArray";
import { EqualSomeArray } from "./operator/EqualSomeArray";
import { SubQuery } from "./operand/SubQuery";
import { MakeInterval } from "./likeAreFunction/MakeInterval";
import { Extract } from "./likeAreFunction/Extract";
import { SubString } from "./likeAreFunction/SubString";
import { Position } from "./likeAreFunction/Position";
import { Overlay } from "./likeAreFunction/Overlay";
import { Cast } from "./likeAreFunction/Cast";
import { Exists } from "./likeAreFunction/Exists";
import { Between } from "./operator/Between";
import { Collate } from "./operator/Collate";

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
    ArrayLiteral |
    CaseWhen |
    EqualAnyArray |
    EqualSomeArray |
    FunctionCall |
    SubQuery |
    MakeInterval |
    Extract |
    SubString |
    Position |
    Overlay |
    Cast |
    Exists |
    Between |
    Collate
);

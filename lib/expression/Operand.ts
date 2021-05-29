import { BooleanLiteral } from "./literal/BooleanLiteral";
import { ByteStringLiteral } from "./literal/ByteStringLiteral";
import { ColumnReference } from "./ColumnReference";
import { IntervalLiteral } from "./literal/IntervalLiteral";
import { NullLiteral } from "./literal/NullLiteral";
import { NumberLiteral } from "./literal/NumberLiteral";
import { StringLiteral } from "./literal/StringLiteral";
import { Variable } from "./Variable";
import { BinaryOperator } from "./operator/BinaryOperator";
import { PostUnaryOperator } from "./operator/PostUnaryOperator";
import { PreUnaryOperator } from "./operator/PreUnaryOperator";
import { SubExpression } from "./SubExpression";
import { In } from "./operator/custom/In";
import { NotIn } from "./operator/custom/NotIn";
import { ArrayLiteral } from "./literal/ArrayLiteral";
import { CaseWhen } from "./CaseWhen";
import { FunctionCall } from "./FunctionCall";
import { EqualAnyArray } from "./operator/custom/EqualAnyArray";
import { EqualSomeArray } from "./operator/custom/EqualSomeArray";
import { SubQuery } from "./SubQuery";
import { MakeInterval } from "./likeAreFunction/MakeInterval";
import { Extract } from "./likeAreFunction/Extract";
import { SubString } from "./likeAreFunction/SubString";
import { Position } from "./likeAreFunction/Position";
import { Overlay } from "./likeAreFunction/Overlay";
import { Cast } from "./likeAreFunction/Cast";
import { Exists } from "./likeAreFunction/Exists";
import { Between } from "./operator/custom/Between";
import { Collate } from "./Collate";
import { SquareBrackets } from "./operator/custom/SquareBrackets";
import { Trim } from "./likeAreFunction/Trim";
import { CurrentDate } from "./literal/CurrentDate";
import { TimestampLiteral } from "./literal/TimestampLiteral";

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
    In |
    NotIn |
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
    Collate |
    SquareBrackets |
    Trim |
    CurrentDate |
    TimestampLiteral
);

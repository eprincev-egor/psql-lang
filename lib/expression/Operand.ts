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
import { EqualAny } from "./operator/custom/equalSome/EqualAny";
import { EqualSome } from "./operator/custom/equalSome/EqualSome";
import { EqualAll } from "./operator/custom/equalSome/EqualAll";
import { NotEqualAny } from "./operator/custom/equalSome/NotEqualAny";
import { NotEqualSome } from "./operator/custom/equalSome/NotEqualSome";
import { NotEqualAll } from "./operator/custom/equalSome/NotEqualAll";
import { SubQuery } from "./SubQuery";
import { MakeInterval } from "./likeAreFunction/MakeInterval";
import { Extract } from "./likeAreFunction/Extract";
import { SubString } from "./likeAreFunction/SubString";
import { Position } from "./likeAreFunction/Position";
import { Overlay } from "./likeAreFunction/Overlay";
import { Cast } from "./likeAreFunction/Cast";
import { Exists } from "./likeAreFunction/Exists";
import { Between } from "./operator/custom/Between";
import { Collate } from "./operator/custom/Collate";
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
    EqualAny |
    EqualSome |
    EqualAll |
    NotEqualAny |
    NotEqualSome |
    NotEqualAll |
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

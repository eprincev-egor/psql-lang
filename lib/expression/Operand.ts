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
import { AtTimeZone } from "./operator/custom/AtTimeZone";
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
import { CastAs } from "./likeAreFunction/CastAs";
import { CastTo } from "./operator/custom/CastTo";
import { Exists } from "./likeAreFunction/Exists";
import { ArrayQuery } from "./likeAreFunction/ArrayQuery";
import { Between } from "./operator/custom/Between";
import { NotBetween } from "./operator/custom/NotBetween";
import { Collate } from "./operator/custom/Collate";
import { SquareBrackets } from "./operator/custom/SquareBrackets";
import { Trim } from "./likeAreFunction/Trim";
import { CurrentDate } from "./literal/CurrentDate";
import { Timestamp } from "./Timestamp";
import { JsTemplateValue } from "./JsTemplateValue";

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
    CastTo |
    CastAs |
    Exists |
    ArrayQuery |
    Between |
    NotBetween |
    Collate |
    SquareBrackets |
    Trim |
    CurrentDate |
    Timestamp |
    AtTimeZone |
    JsTemplateValue
);

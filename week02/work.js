/** 
 * 第一题:写一个正则表达式 匹配所有 Number 直接量
 * */ 
/** Number 表达式
StringNumericLiteral :::
  StrWhiteSpaceopt
  StrWhiteSpaceopt StrNumericLiteral StrWhiteSpaceopt
StrWhiteSpace :::
	StrWhiteSpaceChar StrWhiteSpaceopt
StrWhiteSpaceChar :::
  WhiteSpace
  LineTerminator
StrNumericLiteral :::
  StrDecimalLiteral
  BinaryIntegerLiteral
  OctalIntegerLiteral
  HexIntegerLiteral
StrDecimalLiteral :::
  StrUnsignedDecimalLiteral
  + StrUnsignedDecimalLiteral
  - StrUnsignedDecimalLiteral
StrUnsignedDecimalLiteral :::
	Infinity
	DecimalDigits . DecimalDigitsopt ExponentPartopt
  . DecimalDigits ExponentPartopt
  DecimalDigits ExponentPartopt
DecimalDigits ::
  DecimalDigit
  DecimalDigits DecimalDigit
DecimalDigit :: one of
	0 1 2 3 4 5 6 7 8 9
ExponentPart ::
	ExponentIndicator SignedInteger
ExponentIndicator :: one of
	e E
SignedInteger ::
  DecimalDigits
  + DecimalDigits
  - DecimalDigits
HexIntegerLiteral ::
  0x HexDigits
  0X HexDigits
HexDigit :: one of
	0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F
*/ 

/^-?\d+$|^(-?\d+)(\.\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/g;

/** 
 * 第二题:写一个 UTF-8 Encoding 的函数
 * */ 

function encodeUtf8(text) {
    const code = encodeURIComponent(text);
    const bytes = [];
    for (var i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            const hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
}

function decodeUtf8(bytes) {
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
    }
    return decodeURIComponent(encoded);
}

/** 
 * 第三题:写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
 * */ 
/** 字符串表达式
StringLiteral ::
" DoubleStringCharactersopt "
' SingleStringCharactersopt '
DoubleStringCharacters ::
DoubleStringCharacter DoubleStringCharactersopt
SingleStringCharacters ::
SingleStringCharacter SingleStringCharactersopt
DoubleStringCharacter ::
SourceCharacter but not one of " or \ or LineTerminator
<LS>
<PS>
\ EscapeSequence
LineContinuation
SingleStringCharacter ::
SourceCharacter but not one of ' or \ or LineTerminator
<LS>
<PS>
\ EscapeSequence
LineContinuation
LineContinuation ::
\ LineTerminatorSequence
EscapeSequence ::
CharacterEscapeSequence
0 [lookahead ∉ DecimalDigit]
HexEscapeSequence
UnicodeEscapeSequence
A conforming implementation, when processing strict mode code, must not extend the syntax of EscapeSequence to
include LegacyOctalEscapeSequence as described in B.1.2.
CharacterEscapeSequence ::
SingleEscapeCharacter
NonEscapeCharacter
SingleEscapeCharacter :: one of
' " \ b f n r t v
NonEscapeCharacter ::
Syntax
170 © Ecma International 2019
170
SourceCharacter but not one of EscapeCharacter or LineTerminator
EscapeCharacter ::
SingleEscapeCharacter
DecimalDigit
x
u
HexEscapeSequence ::
x HexDigit HexDigit
UnicodeEscapeSequence ::
u Hex4Digits
u{ CodePoint }
Hex4Digits ::
HexDigit HexDigit HexDigit HexDigit
*/
/[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|(['"])(?:(?!\1).)*?\1/g
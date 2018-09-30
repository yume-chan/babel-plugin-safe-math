module.exports = function(babel) {
    /**
     * @type {import('babel-types')}
     */
    const t = babel.types;

    /**
     * @type {import("babel-traverse").Visitor}
     */
    const visitor = {
        /**
         * @param {import("babel-traverse").NodePath<import("babel-types").Program>} path
         */
        Program(path) {
            path.node.body.unshift(
                t.functionDeclaration(
                    t.identifier("safeMath"),
                    [
                        t.identifier("value"),
                        t.identifier("disallowZero"),
                        t.identifier("message")
                    ],
                    t.blockStatement([
                        t.ifStatement(
                            t.logicalExpression("||",
                                t.logicalExpression("||",
                                    t.binaryExpression("!==",
                                        t.unaryExpression("typeof",
                                            t.identifier("value")),
                                        t.stringLiteral("number")),
                                    t.callExpression(
                                        t.memberExpression(
                                            t.identifier("Number"),
                                            t.identifier("isNaN")),
                                        [t.identifier("value")])),
                                t.logicalExpression("&&",
                                    t.identifier("disallowZero"),
                                    t.binaryExpression("===",
                                        t.identifier("value"),
                                        t.numericLiteral(0)))),
                            t.throwStatement(
                                t.newExpression(
                                    t.identifier("TypeError"),
                                    [
                                        t.binaryExpression("+",
                                            t.binaryExpression("+",
                                                t.identifier("message"),
                                                t.stringLiteral(": ")
                                            ),
                                            t.callExpression(
                                                t.memberExpression(
                                                    t.identifier("JSON"),
                                                    t.identifier("stringify")
                                                ),
                                                [
                                                    t.identifier("value")
                                                ]))]))),
                        t.returnStatement(t.identifier("value"))])));
        },
        /**
         * @param {import("babel-traverse").NodePath<import("babel-types").BinaryExpression>} path
         */
        BinaryExpression(path) {
            if (path.node.operator === "/") {
                /**
                 * @type {import('babel-types').Expression}
                 */
                let left = path.node.left;
                if (!t.isCallExpression(left) || !t.isIdentifier(left.callee) || left.callee.name !== "safeMath") {
                    left = t.callExpression(t.identifier("safeMath"), [path.get("left").node, t.booleanLiteral(false), t.stringLiteral("the dividend is invalid")]);
                }

                /**
                 * @type {import('babel-types').Expression}
                 */
                let right = path.node.right;
                if (!t.isCallExpression(right) || !t.isIdentifier(right.callee) || right.callee.name !== "safeMath") {
                    right = t.callExpression(t.identifier("safeMath"), [path.get("right").node, t.booleanLiteral(true), t.stringLiteral("the divider is invalid")]);
                }

                if (left !== path.node.left || right !== path.node.right) {
                    path.replaceWith(t.binaryExpression("/", left, right));
                }
            }
        }
    };

    return {
        name: "safe-math",
        visitor,
    };
}

/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 *
 */

import match from './match';
import recast from 'recast';
import resolveToModule from './resolveToModule';

const {
  types: { namedTypes: types },
} = recast;

/**
 * Returns true if the expression is a function call of the form
 * `connect(ReactComponent)`.
 */
export default function isReduxConnectCall(path: NodePath): boolean {
  if (types.ExpressionStatement.check(path.node)) {
    path = path.get('expression');
  }

  if (!match(path.node, { type: 'CallExpression' })) {
    return false;
  }

  if (!match(path.node, { callee: { property: { name: 'connect' } } })) {
    return false;
  }

  const module = resolveToModule(path);
  return Boolean(module && module === 'react-redux');
}
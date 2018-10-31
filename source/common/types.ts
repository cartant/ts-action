/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

export interface Action<T extends string> {
    type: T;
}

export type FunctionWithParametersType<P extends any[], R = void> = (...args: P) => R;
export type ParametersType<T> = T extends  (...args: infer U) => any ? U: never;

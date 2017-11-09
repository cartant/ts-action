/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

export interface Ctor<T> { new(...args: any[]): T; }
export interface PropsCtor<T> { new(props: T): T; }

/*tslint:disable-next-line:typedef*/
export function action<T extends string, B, C extends Ctor<{}>>(options: { base: B, BaseCtor: C, readonly type: T }) {
    const { BaseCtor, type } = options;
    class _Action extends BaseCtor {
        static readonly action: { type: T } & B = undefined!;
        static readonly type: T = type;
        readonly type: T = type;
        constructor(...args: any[]) {
            super(...args);
            // https://github.com/reactjs/redux/blob/v3.7.2/src/createStore.js#L150-L155
            // isPlainObject checks if value is a plain object, that is, an object created by the Object constructor or one with a [[Prototype]] of null.
            Object.setPrototypeOf(this, null);
        }
    }
    return _Action;
}

/*tslint:disable-next-line:typedef*/
export function base<B>(BaseCtor: Ctor<B>) {
    const base: B = undefined!;
    return { base, BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function empty() {
    const base: {} = undefined!;
    const BaseCtor = class _EmptyBase { constructor() {} };
    return { base, BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function payload<P>() {
    const base: { payload: P } = undefined!;
    const BaseCtor = class _PayloadBase { constructor(public payload: P) {} };
    return { base, BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function props<P extends object>() {
    const base: P = undefined!;
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as PropsCtor<P>;
    return { base, BaseCtor };
}

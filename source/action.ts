/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

export interface Ctor<T> { new(...args: any[]): T; }
export interface Ctor0<T> { new(): T; }
export interface Ctor1<P1, T> { new(p1: P1): T; }
export interface Ctor2<P1, P2, T> { new(p1: P1, p2: P2): T; }
export interface Ctor3<P1, P2, P3, T> { new(p1: P1, p2: P2, p3: P3): T; }
export interface Ctor4<P1, P2, P3, P4, T> { new(p1: P1, p2: P2, p3: P3, p4: P4): T; }
export interface Ctor5<P1, P2, P3, P4, P5, T> { new(p1: P1, p2: P2, p3: P3, p4: P4, p5: P5): T; }
export interface Ctor6<P1, P2, P3, P4, P5, P6, T> { new(p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6): T; }

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
export function base<B>(BaseCtor: Ctor0<B>): { base: B, BaseCtor: Ctor0<B> };
export function base<P1, B>(BaseCtor: Ctor1<P1, B>): { base: B, BaseCtor: Ctor1<P1, B> };
export function base<P1, P2, B>(BaseCtor: Ctor2<P1, P2, B>): { base: B, BaseCtor: Ctor2<P1, P2, B> };
export function base<P1, P2, P3, B>(BaseCtor: Ctor3<P1, P2, P3, B>): { base: B, BaseCtor: Ctor3<P1, P2, P3, B> };
export function base<P1, P2, P3, P4, B>(BaseCtor: Ctor4<P1, P2, P3, P4, B>): { base: B, BaseCtor: Ctor4<P1, P2, P3, P4, B> };
export function base<P1, P2, P3, P4, P5, B>(BaseCtor: Ctor5<P1, P2, P3, P4, P5, B>): { base: B, BaseCtor: Ctor5<P1, P2, P3, P4, P5, B> };
export function base<P1, P2, P3, P4, P5, P6, B>(BaseCtor: Ctor6<P1, P2, P3, P4, P5, P6, B>): { base: B, BaseCtor: Ctor6<P1, P2, P3, P4, P5, P6, B> };
export function base<B>(BaseCtor: Ctor<B>): { base: B, BaseCtor: Ctor<B> };
export function base<B>(BaseCtor: Ctor<B>): { base: B, BaseCtor: Ctor<B> } {
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
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as {  new(props: P): P; };
    return { base, BaseCtor };
}

/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

export interface Ctor<T> { new(...args: any[]): T; }

/*tslint:disable-next-line:typedef*/
export function action<T extends string, C extends Ctor<{}>, B>(options: { base: B, BaseCtor: C, readonly type: T }) {
    const { BaseCtor, type } = options;
    class _Action extends BaseCtor {
        static readonly action: _Action & B = undefined!;
        static readonly type: T = type;
        readonly type: T = type;
        constructor(...args: any[]) { super(...args); }
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
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as Ctor<P>;
    return { base, BaseCtor };
}

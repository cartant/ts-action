/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

// https://github.com/reactjs/redux/blob/v3.7.2/src/createStore.js#L150-L155
const literalPrototype = Object.getPrototypeOf({});

export interface Ctor<T> { new (...args: any[]): T; }
export type ActionCtor<T, C> = { readonly type: T; new (...args: any[]): { readonly type: T; }; } & C;

export function action<T extends string>(t: T): ActionCtor<T, { new (): {}; }>;
export function action<T extends string, C extends Ctor<{}>>(t: T, options: { BaseCtor: C }): ActionCtor<T, C>;
export function action<T extends string, C extends Ctor<{}>>(t: T, options?: { BaseCtor: C }): ActionCtor<T, { new (): {}; } | C> {
    const BaseCtor = options ? options.BaseCtor : empty().BaseCtor;
    return class extends BaseCtor {
        static readonly type: T = t;
        readonly type: T = t;
        constructor(...args: any[]) {
            super(...args);
            Object.setPrototypeOf(this, literalPrototype);
        }
    };
}

/*tslint:disable-next-line:typedef*/
export function base<C extends Ctor<{}>>(BaseCtor: C) {
    return { BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function empty() {
    const BaseCtor = class _EmptyBase { constructor() {} };
    return { BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function payload<P>() {
    const BaseCtor = class _PayloadBase { constructor(public payload: P) {} };
    return { BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function props<P extends object>() {
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as { new (props: P): P; };
    return { BaseCtor };
}

export function union<T1>(t1: Ctor<T1>): T1;
export function union<T1, T2>(t1: Ctor<T1>, t2: Ctor<T2>): T1 | T2;
export function union<T1, T2, T3>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>): T1 | T2 | T3;
export function union<T1, T2, T3, T4>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>): T1 | T2 | T3 | T4;
export function union<T1, T2, T3, T4, T5>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>): T1 | T2 | T3 | T4 | T5;
export function union<T1, T2, T3, T4, T5, T6>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>): T1 | T2 | T3 | T4 | T5| T6;
export function union<T1, T2, T3, T4, T5, T6, T7>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>, t7: Ctor<T7>): T1 | T2 | T3 | T4 | T5| T6 | T7;
export function union<T1, T2, T3, T4, T5, T6, T7, T8>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>, t7: Ctor<T7>, t8: Ctor<T8>): T1 | T2 | T3 | T4 | T5| T6 | T7 | T8;
export function union<T1, T2, T3, T4, T5, T6, T7, T8, T9>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>, t7: Ctor<T7>, t8: Ctor<T8>, t9: Ctor<T9>): T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9;
export function union<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>, t7: Ctor<T7>, t8: Ctor<T8>, t9: Ctor<T9>, t10: Ctor<T10>): T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10;
export function union<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(t1: Ctor<T1>, t2: Ctor<T2>, t3: Ctor<T3>, t4: Ctor<T4>, t5: Ctor<T5>, t6: Ctor<T6>, t7: Ctor<T7>, t8: Ctor<T8>, t9: Ctor<T9>, t10: Ctor<T10>, t11: Ctor<T11>): T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10 | T11;
export function union(...args: any[]): any {
    return undefined;
}

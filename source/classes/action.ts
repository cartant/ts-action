/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

// https://github.com/cartant/ts-action/issues/15
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setprototypeof#Polyfill
const getPrototypeOf = Object.getPrototypeOf || function (obj: unknown): unknown {
    return (obj as { __proto__: unknown }).__proto__;
};
const setPrototypeOf = Object.setPrototypeOf || function (obj: unknown, proto: unknown): unknown {
    (obj as { __proto__: unknown }).__proto__ = proto;
    return obj;
};

// https://github.com/reactjs/redux/blob/v3.7.2/src/createStore.js#L150-L155
const literalPrototype = getPrototypeOf({});

/* tslint:disable:no-any*/
export interface Ctor<T> { new (...args: any[]): T; }
export type ActionCtor<T, B, C> = { readonly type: T; new (...args: any[]): { readonly type: T; }; } & C;
/* tslint:enable:no-any*/

export function action<T extends string>(t: T): ActionCtor<T, {}, { new (): {}; }>;
export function action<T extends string, B extends {}, C extends Ctor<{}>>(t: T, config: { _base: Ctor<B>, _ctor: C }): ActionCtor<T, B, C>;
export function action<T extends string, B extends {}, C extends Ctor<{}>>(t: T, config?: { _base: Ctor<B>, _ctor: C }): ActionCtor<T, {} | B, { new (): {}; } | C> {
    const BaseCtor: Ctor<{}> = config ? config._ctor : empty()._ctor;
    return class extends BaseCtor {
        static readonly type: T = t;
        readonly type: T = t;
        constructor(...args: unknown[]) {
            super(...args);
            setPrototypeOf(this, literalPrototype);
        }
    };
}

/*tslint:disable-next-line:typedef*/
export function base<C extends Ctor<{}>>(BaseCtor: C) {
    return { _base: BaseCtor, _ctor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function empty() {
    const BaseCtor = class _EmptyBase { constructor() {} };
    return { _base: BaseCtor, _ctor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function payload<P>() {
    const BaseCtor = class _PayloadBase { constructor(public payload: P) {} };
    return { _base: BaseCtor, _ctor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function props<P extends object>() {
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as { new (props: P): P; };
    return { _base: BaseCtor, _ctor: BaseCtor };
}

export function union<C extends { [key: string]: ActionCtor<string, {}, Ctor<{}>> }>(ctors: C): InstanceType<C[keyof C]> {
    return undefined!;
}

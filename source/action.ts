/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

// https://github.com/reactjs/redux/blob/v3.7.2/src/createStore.js#L150-L155
const literalPrototype = Object.getPrototypeOf({});

export interface Ctor<T> { new (...args: any[]): T; }
export type ActionCtor<T, B, C> = { readonly action: B & { readonly type: T }; readonly type: T; new (...args: any[]): { readonly type: T; }; } & C;

export function action<T extends string>(t: T): ActionCtor<T, {}, { new (): {}; }>;
export function action<T extends string, B extends {}, C extends Ctor<{}>>(t: T, options: { _forBase: Ctor<B>, _forCtor: C }): ActionCtor<T, B, C>;
export function action<T extends string, B extends {}, C extends Ctor<{}>>(t: T, options?: { _forBase: Ctor<B>, _forCtor: C }): ActionCtor<T, {} | B, { new (): {}; } | C> {
    const BaseCtor = options ? options._forCtor : empty()._forCtor;
    return class extends BaseCtor {
        static readonly action: B & { readonly type: T } = undefined!;
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
    return { _forBase: BaseCtor, _forCtor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function empty() {
    const BaseCtor = class _EmptyBase { constructor() {} };
    return { _forBase: BaseCtor, _forCtor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function payload<P>() {
    const BaseCtor = class _PayloadBase { constructor(public payload: P) {} };
    return { _forBase: BaseCtor, _forCtor: BaseCtor };
}

/*tslint:disable-next-line:typedef*/
export function props<P extends object>() {
    const BaseCtor = class _PropsBase { constructor(props: P) { Object.assign(this, props); } } as { new (props: P): P; };
    return { _forBase: BaseCtor, _forCtor: BaseCtor };
}

export function union<T extends { [key: string]: ActionCtor<string, {}, Ctor<{}>> }>(t: T): T[keyof T]["action"] {
    return undefined!;
}

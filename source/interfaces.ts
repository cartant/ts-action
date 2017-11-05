/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

export interface ActionType<T extends string> {
    type: T;
}

export interface Action<T extends string> extends ActionType<T> {}

export interface ActionWithPayload<T extends string, P> extends ActionType<T> {
    payload: P;
}

export interface AnyAction extends ActionType<string> {}

export interface AnyActionConstructor extends ActionType<string> {
    new (...args: any[]): AnyAction;
}

export interface ActionConstructor<T extends string> extends ActionType<T> {
    new (): Action<T>;
}

export interface ActionWithPayloadConstructor<T extends string, P> extends ActionType<T> {
    new (payload?: P): ActionWithPayload<T, P>;
}

export interface ActionWithPropsConstructor<T extends string, P extends object> extends ActionType<T> {
    new (props?: P): Action<T> & P;
}

export interface ActionWithParamsConstructor<T extends string, P extends object, V> extends ActionType<T> {
    new (value: V): Action<T> & P;
}

export interface ActionCreator<T extends string> extends ActionConstructor<T> {
    action: Action<T>;
    create(): Action<T>;
}

export interface ActionWithPayloadCreator<T extends string, P> extends ActionWithPayloadConstructor<T, P> {
    action: ActionWithPayload<T, P>;
    create(payload: P): ActionWithPayload<T, P>;
    new (payload: P): ActionWithPayload<T, P>;
}

export interface ActionWithDefaultPayloadCreator<T extends string, P> extends ActionWithPayloadConstructor<T, P> {
    action: ActionWithPayload<T, P>;
    create(payload?: P): ActionWithPayload<T, P>;
}

export interface ActionWithPropsCreator<T extends string, P extends object> extends ActionWithPropsConstructor<T, P> {
    action: Action<T> & P;
    create(props: P): Action<T> & P;
    new (props: P): Action<T> & P;
}

export interface ActionWithDefaultPropsCreator<T extends string, P extends object> extends ActionWithPropsConstructor<T, P> {
    action: Action<T> & P;
    create(props?: P): Action<T> & P;
}

export interface ActionWithParamsCreator<T extends string, P extends object, V> extends ActionWithParamsConstructor<T, P, V> {
    action: Action<T> & P;
    create(value: V): Action<T> & P;
}

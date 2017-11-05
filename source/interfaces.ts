/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

export interface ActionWithType<T extends string> {
    type: T;
}

export interface ActionWithPayload<T extends string, P> extends ActionWithType<T> {
    payload: P;
}

export type Action<T extends string = string> = ActionWithType<T>;

export interface ActionConstructor<T extends string = string> {
    type: T;
    new (...args: any[]): { type: T };
}

export interface ActionWithTypeConstructor<T extends string> {
    type: T;
    new (): ActionWithType<T>;
}

export interface ActionWithPayloadConstructor<T extends string, P> {
    type: T;
    new (payload: P): ActionWithPayload<T, P>;
}

export interface ActionWithDefaultPayloadConstructor<T extends string, P> {
    type: T;
    new (payload?: P): ActionWithPayload<T, P>;
}

export interface ActionWithPropsConstructor<T extends string, P extends object> {
    type: T;
    new (props: P): ActionWithType<T> & P;
}

export interface ActionWithDefaultPropsConstructor<T extends string, P extends object> {
    type: T;
    new (props?: P): ActionWithType<T> & P;
}

export interface ActionCreator<T extends string = string> extends ActionConstructor<T> {
    action: ActionWithType<T>;
    create(...args: any[]): ActionWithType<T>;
}

export interface ActionWithTypeCreator<T extends string> extends ActionWithTypeConstructor<T> {
    action: ActionWithType<T>;
    create(): ActionWithType<T>;
}

export interface ActionWithPayloadCreator<T extends string, P> extends ActionWithPayloadConstructor<T, P> {
    action: ActionWithPayload<T, P>;
    create(payload: P): ActionWithPayload<T, P>;
}

export interface ActionWithDefaultPayloadCreator<T extends string, P> extends ActionWithDefaultPayloadConstructor<T, P> {
    action: ActionWithPayload<T, P>;
    create(payload?: P): ActionWithPayload<T, P>;
}

export interface ActionWithPropsCreator<T extends string, P extends object> extends ActionWithPropsConstructor<T, P> {
    action: ActionWithType<T> & P;
    create(props: P): ActionWithType<T> & P;
}

export interface ActionWithDefaultPropsCreator<T extends string, P extends object> extends ActionWithDefaultPropsConstructor<T, P> {
    action: ActionWithType<T> & P;
    create(props?: P): ActionWithType<T> & P;
}

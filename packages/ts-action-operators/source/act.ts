/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:rxjs-no-unsafe-scope*/

import { Action } from "ts-action";
import {
  defer,
  merge,
  Notification,
  Observable,
  OperatorFunction,
  Subject
} from "rxjs";
import {
  concatMap,
  dematerialize,
  filter,
  finalize,
  map,
  materialize
} from "rxjs/operators";

export function act<
  InputAction extends Action,
  OutputAction extends Action,
  ErrorAction extends Action = never,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>({
  complete,
  error,
  operator = concatMap,
  project,
  unsubscribe
}: {
  complete?: (count: number, action: InputAction) => CompleteAction;
  error: (error: any, action: InputAction) => ErrorAction;
  operator?: <I, O>(
    project: (input: I, index: number) => Observable<O>
  ) => OperatorFunction<I, O>;
  project: (action: InputAction, index: number) => Observable<OutputAction>;
  unsubscribe?: (count: number, action: InputAction) => UnsubscribeAction;
}): (
  source: Observable<InputAction>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
> {
  type ResultAction =
    | OutputAction
    | ErrorAction
    | CompleteAction
    | UnsubscribeAction;
  return source =>
    defer(
      (): Observable<ResultAction> => {
        const subject = new Subject<UnsubscribeAction>();
        return merge(
          source.pipe(
            operator((action, index) =>
              defer(() => {
                let completed = false;
                let errored = false;
                let projectedCount = 0;
                return project(action, index).pipe(
                  materialize(),
                  map(
                    (notification): Notification<ResultAction> | undefined => {
                      switch (notification.kind) {
                        case "E":
                          errored = true;
                          return new Notification(
                            "N",
                            error(notification.error, action)
                          );
                        case "C":
                          completed = true;
                          return complete
                            ? new Notification(
                                "N",
                                complete(projectedCount, action)
                              )
                            : undefined;
                        default:
                          ++projectedCount;
                          return notification;
                      }
                    }
                  ),
                  filter(isDefined),
                  dematerialize(),
                  finalize(() => {
                    if (!completed && !errored && unsubscribe) {
                      subject.next(unsubscribe(projectedCount, action));
                    }
                  })
                );
              })
            )
          ),
          subject
        );
      }
    );
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

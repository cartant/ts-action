/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action } from "ts-action";
import {
  defer,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  Subscription
} from "rxjs";
import { concatMap } from "rxjs/operators";

export function act<
  Value,
  EffectAction extends Action,
  CompleteAction extends Action,
  ErrorAction extends Action,
  NextAction extends Action,
  UnsubscribeAction extends Action
>({
  complete,
  error,
  next,
  operator = concatMap,
  project,
  unsubscribe
}: {
  complete?: (nexts: number, action: EffectAction) => CompleteAction;
  error: (error: any, action: EffectAction) => ErrorAction;
  next?: (value: Value, index: number, action: EffectAction) => NextAction;
  operator?: <A, R>(
    project: (action: A) => Observable<R>
  ) => OperatorFunction<A, R>;
  project: (action: EffectAction) => Observable<Value>;
  unsubscribe?: (nexts: number, action: EffectAction) => UnsubscribeAction;
}): (
  source: Observable<EffectAction>
) => Observable<CompleteAction | ErrorAction | NextAction | UnsubscribeAction> {
  return source =>
    defer(
      (): Observable<
        CompleteAction | ErrorAction | NextAction | UnsubscribeAction
      > => {
        const subject = new Subject<UnsubscribeAction>();
        return merge(
          source.pipe(
            operator(
              action =>
                new Observable(subscriber => {
                  let completed = false;
                  let errored = false;
                  let nexts = 0;
                  const subscription = new Subscription();
                  subscription.add(() => {
                    if (!completed && !errored && !nexts && unsubscribe) {
                      subject.next(unsubscribe(nexts, action));
                    }
                  });
                  subscription.add(
                    project(action).subscribe({
                      complete() {
                        completed = true;
                        if (complete) {
                          subscriber.next(complete(nexts, action));
                        }
                        subscriber.complete();
                      },
                      error(e: any) {
                        errored = true;
                        subscriber.next(error(e, action));
                        subscriber.complete();
                      },
                      next(value: Value) {
                        const index = nexts++;
                        if (next) {
                          subscriber.next(next(value, index, action));
                        }
                      }
                    })
                  );
                  return subscription;
                })
            )
          ),
          subject
        );
      }
    );
}

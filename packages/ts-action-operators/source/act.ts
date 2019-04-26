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
  complete?: (nexts: number) => CompleteAction;
  error?: (error: any) => ErrorAction;
  next?: (value: Value, index: number) => NextAction;
  operator?: <A, R>(
    project: (action: A) => Observable<R>
  ) => OperatorFunction<A, R>;
  project: (action: EffectAction) => Observable<Value>;
  unsubscribe?: (nexts: number) => UnsubscribeAction;
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
                      subject.next(unsubscribe(nexts));
                    }
                  });
                  subscription.add(
                    project(action).subscribe({
                      complete() {
                        completed = true;
                        if (complete) {
                          subscriber.next(complete(nexts));
                        }
                        subscriber.complete();
                      },
                      error(e: any) {
                        errored = true;
                        if (error) {
                          subscriber.next(error(e));
                          subscriber.complete();
                        } else {
                          subscriber.error(e);
                        }
                      },
                      next(value: Value) {
                        const index = nexts++;
                        if (next) {
                          subscriber.next(next(value, index));
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

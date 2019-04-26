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

enum UnspecifiedBrand {}
type UnspecifiedAction = {
  type: "";
  unspecified: UnspecifiedBrand;
};
type SpecifiedAction<A extends Action> = Exclude<A, UnspecifiedAction>;

export function act<
  EffectAction extends Action,
  NextAction extends Action = UnspecifiedAction,
  ErrorAction extends Action = UnspecifiedAction,
  CompleteAction extends Action = UnspecifiedAction,
  UnsubscribeAction extends Action = UnspecifiedAction
>({
  complete,
  error,
  operator = concatMap,
  project,
  unsubscribe
}: {
  complete?: (nexts: number, action: EffectAction) => CompleteAction;
  error: (error: any, action: EffectAction) => ErrorAction;
  operator?: <A, R>(
    project: (action: A, index: number) => Observable<R>
  ) => OperatorFunction<A, R>;
  project: (action: EffectAction, index: number) => Observable<NextAction>;
  unsubscribe?: (nexts: number, action: EffectAction) => UnsubscribeAction;
}): (
  source: Observable<EffectAction>
) => Observable<
  SpecifiedAction<NextAction | ErrorAction | CompleteAction | UnsubscribeAction>
> {
  return source =>
    defer(
      (): Observable<Action> => {
        const subject = new Subject<UnsubscribeAction>();
        return merge(
          source.pipe(
            operator(
              (action, index) =>
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
                    project(action, index).subscribe({
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
                      next(nextAction: NextAction) {
                        ++nexts;
                        subscriber.next(nextAction);
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
    ) as Observable<
      SpecifiedAction<
        NextAction | ErrorAction | CompleteAction | UnsubscribeAction
      >
    >;
}

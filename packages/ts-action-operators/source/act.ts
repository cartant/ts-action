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
  ProjectAction extends Action = UnspecifiedAction,
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
  complete?: (count: number, action: EffectAction) => CompleteAction;
  error: (error: any, action: EffectAction) => ErrorAction;
  operator?: <A, R>(
    project: (action: A, index: number) => Observable<R>
  ) => OperatorFunction<A, R>;
  project: (action: EffectAction, index: number) => Observable<ProjectAction>;
  unsubscribe?: (count: number, action: EffectAction) => UnsubscribeAction;
}): (
  source: Observable<EffectAction>
) => Observable<
  SpecifiedAction<ProjectAction | ErrorAction | CompleteAction | UnsubscribeAction>
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
                  let projected = 0;
                  const subscription = new Subscription();
                  subscription.add(() => {
                    if (!completed && !errored && !projected && unsubscribe) {
                      subject.next(unsubscribe(projected, action));
                    }
                  });
                  subscription.add(
                    project(action, index).subscribe({
                      complete() {
                        completed = true;
                        if (complete) {
                          subscriber.next(complete(projected, action));
                        }
                        subscriber.complete();
                      },
                      error(e: any) {
                        errored = true;
                        subscriber.next(error(e, action));
                        subscriber.complete();
                      },
                      next(projectAction: ProjectAction) {
                        ++projected;
                        subscriber.next(projectAction);
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
        ProjectAction | ErrorAction | CompleteAction | UnsubscribeAction
      >
    >;
}

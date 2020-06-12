/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export function toPayload<A extends { payload: {} }>(): (
  source: Observable<A>
) => Observable<A["payload"]> {
  return map((action) => action.payload);
}

/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, base, empty, payload, props, union } from "../dist/action";

describe.skip("issues", function (): void {

    describe("issue-14", () => {

        it("union", () => {
            /*tslint:disable*/
            interface Worker {
                id: string;
                name: string;
                skills?: string[];
            }

            const WorkerLoad = action('[Worker] LOAD', payload<string>());
            const WorkerLoadSuccess = action('[Worker] LOAD SUCCESS', payload<Worker>());

            const WorkerSearch = action('[Worker] SEARCH', payload<string>());
            const WorkerSearchSuccess = action('[Worker] SEARCH SUCCESS', payload<Worker[]>());

            const WorkerActions = union({
                WorkerLoad,
                WorkerLoadSuccess,
                WorkerSearch,
                WorkerSearchSuccess,
            });
            /*tslint:enable*/
        });
    });
});
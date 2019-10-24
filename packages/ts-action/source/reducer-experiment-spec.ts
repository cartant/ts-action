/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { stripIndent } from "common-tags";
import { expectSnippet, timeout } from "./snippet-spec";

describe("reducer-experiment", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  // https://github.com/microsoft/TypeScript/issues/30824

  it("should infer a union from literals", () => {
    expectSnippet(stripIndent`
      type Action = { type: string };
      type Brand = { __brand: string };
      type ActionFromBrand<B extends Brand> = B extends Action ? B : never;

      declare function on<B extends Brand>(
        ...args: (B | ((action: ActionFromBrand<B>) => void))[]
      ): (action: ActionFromBrand<B>) => void;

      const listener = on(
        { __brand: "a" as const, type: "a" as const },
        { __brand: "b" as const, type: "b" as const },
        action => {}
      );
    `).toInfer(
      "listener",
      `(action: { __brand: "a"; type: "a"; } | { __brand: "b"; type: "b"; }) => void`
    );
  });

  it("should fail to infer a union from variables", () => {
    expectSnippet(stripIndent`
      type Action = { type: string };
      type Brand = { __brand: string };
      type ActionFromBrand<B extends Brand> = B extends Action ? B : never;

      declare function on<B extends Brand>(
        ...args: (B | ((action: ActionFromBrand<B>) => void))[]
      ): (action: ActionFromBrand<B>) => void;

      const a = { type: "a" } as ({ type: "a" } & { __brand: "a" });
      const b = { type: "b" } as ({ type: "b" } & { __brand: "b" });
      const listener = on(a, b, action => {});
    `).toInfer(
      "listener",
      `(action: { type: "a"; } & { __brand: "a"; }) => void`
    );
  });

  it("should infer using a spread tuple", () => {
    expectSnippet(stripIndent`
      type Action = { type: string };
      type Brand = { __brand: string };
      type ActionFromBrand<B extends Brand> = B extends Action ? B : never;

      declare function on<B extends Brand>(
        ...args: (B | ((action: ActionFromBrand<B>) => void))[]
      ): (action: ActionFromBrand<B>) => void;

      const args = [
        { __brand: "a" as const, type: "a" as const },
        { __brand: "b" as const, type: "b" as const }
      ];
      const listener = on(
        ...args,
        action => {}
      );
    `).toInfer(
      "listener",
      `(action: { __brand: "a"; type: "a"; } | { __brand: "b"; type: "b"; }) => void`
    );
  });

  it("should infer using a spread tuple of functions", () => {
    expectSnippet(stripIndent`
      type Action = { type: string };
      type Creator = () => { type: string };
      type Brand = { __brand: string };
      type ActionFromBrand<B extends Brand> = B extends () => infer U ? U : never;

      declare function on<B extends Brand>(
        ...args: (B | ((action: ActionFromBrand<B>) => void))[]
      ): (action: ActionFromBrand<B>) => void;

      const args = [
        (() => ({ type: "a" })) as (() => { type: "a" }) & { __brand: "a" },
        (() => ({ type: "b" })) as (() => { type: "b" }) & { __brand: "b" }
      ];
      const listener = on(
        ...args,
        action => {}
      );
    `).toInfer("listener", `(action: { type: "a"; } | { type: "b"; }) => void`);
  });
});

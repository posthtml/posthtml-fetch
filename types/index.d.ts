import type { $Fetch } from "ofetch";
import type ExpressionsConfig from "./expressions";

export type PostHTMLFetchConfig = {
  /**
  String representing the attribute name containing the URL to fetch.

  @default 'url'
  */
  attribute?: string;
  /**
  `posthtml-expressions` is used to evaluate expressions.

  You may pass options directly to it, inside the `expressions` object.

  @default {}
  */
  expressions?: ExpressionsConfig;
  /**
  `posthtml-fetch` uses `ofetch` to fetch data.

  You may pass options directly to it, inside the `ofetch` object.

  @default {}
  */
  ofetch?: $Fetch;
  /**
  Set this to `true` if you need to preserve the `tag`, i.e. `<fetch>` around the response body.

  @default false
  */
  preserveTag?: boolean;
  /**
  Supported tag names.

  Only tags from this array will be processed by the plugin.

  @default ['fetch', 'remote']
  */
  tags: string[];
};

import module namespace m='http://www.tei-c.org/pm/models/rqzh-norm/web' at '/db/apps/zszh/transform/rqzh-norm-web.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "styles": ["transform/rqzh-norm.css"],
    "collection": "/db/apps/zszh/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
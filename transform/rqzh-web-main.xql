import module namespace m='http://www.tei-c.org/pm/models/rqzh/web' at '/db/apps/zszh/transform/rqzh-web.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "styles": ["transform/rqzh.css"],
    "collection": "/db/apps/zszh/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
import module namespace m='http://www.tei-c.org/pm/models/rqzh/fo' at '/db/apps/zszh/transform/rqzh-print.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "styles": ["transform/zszh.css"],
    "collection": "/db/apps/zszh/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
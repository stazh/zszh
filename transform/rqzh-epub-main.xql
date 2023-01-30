import module namespace m='http://www.tei-c.org/pm/models/rqzh/epub' at '/db/apps/rqzh2/transform/rqzh-epub.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "styles": ["transform/rqzh.css"],
    "collection": "/db/apps/rqzh2/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
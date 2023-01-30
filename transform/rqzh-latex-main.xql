import module namespace m='http://www.tei-c.org/pm/models/rqzh/latex' at '/db/apps/rqzh2/transform/rqzh-latex.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "class": "article",
    "section-numbers": false(),
    "font-size": "12pt",
    "styles": ["transform/rqzh.css"],
    "collection": "/db/apps/rqzh2/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
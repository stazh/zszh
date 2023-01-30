import module namespace m='http://www.tei-c.org/pm/models/rqzh-norm/latex' at '/db/apps/rqzh2/transform/rqzh-norm-latex.xql';

declare variable $xml external;

declare variable $parameters external;

let $options := map {
    "class": "article",
    "section-numbers": false(),
    "font-size": "12pt",
    "styles": ["transform/rqzh-norm.css"],
    "collection": "/db/apps/rqzh2/transform",
    "parameters": if (exists($parameters)) then $parameters else map {}
}
return m:transform($options, $xml)
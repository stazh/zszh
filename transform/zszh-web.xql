(:~

    Transformation module generated from TEI ODD extensions for processing models.
    ODD: /db/apps/zszh/resources/odd/zszh.odd
 :)
xquery version "3.1";

module namespace model="http://www.tei-c.org/pm/models/rqzh/web";

declare default element namespace "http://www.tei-c.org/ns/1.0";

declare namespace xhtml='http://www.w3.org/1999/xhtml';

declare namespace xi='http://www.w3.org/2001/XInclude';

declare namespace pb='http://teipublisher.com/1.0';

declare namespace nontei='http://ssrq-sds-fds.ch/ns/nonTEI';

import module namespace css="http://www.tei-c.org/tei-simple/xquery/css";

import module namespace html="http://www.tei-c.org/tei-simple/xquery/functions";

import module namespace ext-html="http://www.tei-c.org/tei-simple/xquery/functions/ssrq-web" at "xmldb:exist:///db/apps/zszh/modules/ext-html.xql";

import module namespace ec="http://www.tei-c.org/tei-simple/xquery/functions/ssrq-common" at "xmldb:exist:///db/apps/zszh/modules/ext-common.xql";

(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><div class="context register">
  <h3 class="place {$config?apply-children($config, $node, $params?emptyPlace)}"><pb-i18n key="register.place"/></h3>
  <ul class="places">
    {$config?apply-children($config, $node, $params?places)}
  </ul>
  <h3 class="person {$config?apply-children($config, $node, $params?emptyPerson)}"><pb-i18n key="register.person"/></h3>
  <ul class="persons">
    {$config?apply-children($config, $node, $params?persons)}
  </ul>
  <h3 class="organization {$config?apply-children($config, $node, $params?emptyOrg)}"><pb-i18n key="register.organisation"/></h3>
  <ul class="organizations">
    {$config?apply-children($config, $node, $params?organizations)}
  </ul>
  <h3 class="term {$config?apply-children($config, $node, $params?emptyTerm)}"><pb-i18n key="register.keywords"/></h3>
  <ul class="keywords">
    {$config?apply-children($config, $node, $params?taxonomies)}
  </ul>
</div></t>/*
};
(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader2($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><div>
                    <pb-link id="prev" path="{$config?apply-children($config, $node, $params?target)}" emit="transcription" class="part-nav">
                        <iron-icon icon="icons:chevron-left"/>
                        <pb-i18n class="sr-only" key="navigation.prev"/>
                    </pb-link>
                    <pb-popover for="prev" theme="light-border">
                        <pb-i18n class="tooltip" key="navigation.prev"/>
                    </pb-popover>
                </div></t>/*
};
(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader3($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><div>
                                <pb-link id="next" path="{$config?apply-children($config, $node, $params?target)}" emit="transcription" class="part-nav">
                                    <pb-i18n class="sr-only" key="navigation.next"/>
                                    <iron-icon icon="icons:chevron-right"/>
                                </pb-link>
                                <pb-popover for="next" theme="light-border">
                                    <pb-i18n class="tooltip" key="navigation.next"/>
                                </pb-popover>
                            </div></t>/*
};
(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader7($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-collapse class="metadata" expand-icon="icons:chevron-right" collapse-icon="icons:expand-more">
                                    <div slot="collapse-trigger">
                                        <h4 class="block-title accordion">
                                            <pb-i18n key="meta.regest"/>
                                        </h4>
                                    </div>
                                    <div id="regest" slot="collapse-content">{$config?apply-children($config, $node, $params?content)}</div>
                                </pb-collapse></t>/*
};
(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader8($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-collapse class="metadata" expand-icon="icons:chevron-right" collapse-icon="icons:expand-more">
                                    <div slot="collapse-trigger">
                                        <h4 class="block-title accordion">
                                            <pb-i18n key="meta.metadata"/>
                                        </h4>
                                    </div>
                                    <div id="sourceDesc" slot="collapse-content">{$config?apply-children($config, $node, $params?content)}</div>
                                </pb-collapse></t>/*
};
(: generated template function for element spec: teiHeader :)
declare %private function model:template-teiHeader9($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-collapse class="metadata" expand-icon="icons:chevron-right" collapse-icon="icons:expand-more">
                                    <div slot="collapse-trigger">
                                        <h4 class="block-title accordion">
                                            <pb-i18n key="meta.addFill"/>
                                        </h4>
                                    </div>
                                    <div id="additional" slot="collapse-content">{$config?apply-children($config, $node, $params?content)}</div>
                                </pb-collapse></t>/*
};
(: generated template function for element spec: pb :)
declare %private function model:template-pb3($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><a href="#">
                                <pb-facs-link facs="{$config?apply-children($config, $node, $params?facs)}" emit="transcription" trigger="click">
                                    <pb-popover>
                                        {$config?apply-children($config, $node, $params?content)}
                                        <template slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</template>
                                    </pb-popover>
                                </pb-facs-link>
                                </a></t>/*
};
(: generated template function for element spec: pb :)
declare %private function model:template-pb4($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><a href="#">
                                <pb-facs-link facs="{$config?apply-children($config, $node, $params?facs)}" emit="transcription" trigger="click">
                                    <pb-popover>
                                        {$config?apply-children($config, $node, $params?content)}
                                        <template slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</template>
                                    </pb-popover>
                                </pb-facs-link>
                                </a></t>/*
};
(: generated template function for element spec: pb :)
declare %private function model:template-pb5($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><a href="#">
                                <pb-facs-link facs="{$config?apply-children($config, $node, $params?facs)}" emit="transcription" trigger="click">
                                    <pb-popover>
                                        {$config?apply-children($config, $node, $params?content)}
                                        <template slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</template>
                                    </pb-popover>
                                </pb-facs-link>
                                </a></t>/*
};
(: generated template function for element spec: back :)
declare %private function model:template-back($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-collapse id="" class="comment" expand-icon="icons:chevron-right" collapse-icon="icons:expand-more">
                                <div slot="collapse-trigger">
                                    <h4 class="block-title accordion">
                                        <pb-i18n key="meta.comment"/>
                                    </h4>
                                </div>
                                <div id="comment" slot="collapse-content">
                                    <ol>{$config?apply-children($config, $node, $params?content)}</ol>
                                </div>
                            </pb-collapse></t>/*
};
(: generated template function for element spec: fileDesc :)
declare %private function model:template-fileDesc9($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><h3>{$config?apply-children($config, $node, $params?fileDescTitle)} <span class="count">{$config?apply-children($config, $node, $params?count)}</span></h3><p>
                                <pb-i18n key="by">von</pb-i18n>
                                {$config?apply-children($config, $node, $params?fileDescPerson)}
</p></t>/*
};
(: generated template function for element spec: fileDesc :)
declare %private function model:template-fileDesc10($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><h3>{$config?apply-children($config, $node, $params?stmtTitle)}</h3><h4>{$config?apply-children($config, $node, $params?fileDescTitle)}</h4></t>/*
};
(: generated template function for element spec: fileDesc :)
declare %private function model:template-fileDesc11($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><span id="info">
                                {$config?apply-children($config, $node, $params?idno-format)}
                                <iron-icon icon="icons:info"/>
                            </span><pb-popover placement="bottom" for="info">
                                    <p>
                                        {$config?apply-children($config, $node, $params?stmtTitle)}, {$config?apply-children($config, $node, $params?fileDescTitle)},
                                        <pb-i18n key="by">von</pb-i18n>
                                        {$config?apply-children($config, $node, $params?fileDescPerson)}
                                    </p>
                                    <p>
                                        <pb-i18n key="zitation">Zitation:</pb-i18n>
                                        <a href="{$config?apply-children($config, $node, $params?link)}">{$config?apply-children($config, $node, $params?idno-format)}</a>
                                    </p>
                                    <p>
                                        <pb-i18n key="lizenz">Lizenz:</pb-i18n>
                                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.de" target="_blank">CC BY-NC-SA</a>
                                    </p>

                            </pb-popover><span id="credits" style="display: none">{$config?apply-children($config, $node, $params?credits)}</span></t>/*
};
(: generated template function for element spec: bibl :)
declare %private function model:template-bibl($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li>
                                <a href="{$config?apply-children($config, $node, $params?url)}" target="_blank">{$config?apply-children($config, $node, $params?text)}</a>
                            </li></t>/*
};
(: generated template function for element spec: term :)
declare %private function model:template-term($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?content)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?label)} {$config?apply-children($config, $node, $params?value)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: persName :)
declare %private function model:template-persName3($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?default)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: orgName :)
declare %private function model:template-orgName($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?default)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: placeName :)
declare %private function model:template-placeName($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?default)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: origPlace :)
declare %private function model:template-origPlace3($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?content)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?label)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: person :)
declare %private function model:template-person($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
        <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
        <div>{$config?apply-children($config, $node, $params?value)}</div>
        </li></t>/*
};
(: generated template function for element spec: place :)
declare %private function model:template-place($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
};
(: generated template function for element spec: org :)
declare %private function model:template-org($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
};
(: generated template function for element spec: category :)
declare %private function model:template-category($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
};
(:~

    Main entry point for the transformation.
    
 :)
declare function model:transform($options as map(*), $input as node()*) {
        
    let $config :=
        map:merge(($options,
            map {
                "output": ["web"],
                "odd": "/db/apps/zszh/resources/odd/zszh.odd",
                "apply": model:apply#2,
                "apply-children": model:apply-children#3
            }
        ))
    
    return (
        html:prepare($config, $input),
     ec:prepare($config, $input),
    
        let $output := model:apply($config, $input)
        return
            ext-html:finish($config, html:finish($config, $output))
    )
};

declare function model:apply($config as map(*), $input as node()*) {
        let $parameters := 
        if (exists($config?parameters)) then $config?parameters else map {}
        let $mode := 
        if (exists($config?mode)) then $config?mode else ()
        let $trackIds := 
        $parameters?track-ids
        let $get := 
        model:source($parameters, ?)
    return
    $input !         (
            let $node := 
                .
            return
                            typeswitch(.)
                    case element(castItem) return
                        (: Insert item, rendered as described in parent list rendition. :)
                        html:listItem($config, ., ("tei-castItem", css:map-rend-to-class(.)), ., ())
                    case element(item) return
                        html:listItem($config, ., ("tei-item", css:map-rend-to-class(.)), ., ())
                    case element(figure) return
                        html:inline($config, ., ("tei-figure", css:map-rend-to-class(.)), ec:translate(@type, 0, 'uppercase'))
                    case element(teiHeader) return
                        if ($parameters?header='context') then
                            let $params := 
                                map {
                                    "persons": let $register := doc("/db/apps/zszh-data/person/person.xml") let $entries:=     for $p in root(.)//persName[@ref]   group by $k := $p/@ref     return     id($p[1]/@ref , $register)  return  for $p in $entries   order by $p/persName[@type="full_sorted"] ascending   return    $p,
                                    "places": let $register := doc("/db/apps/zszh-data/place/place.xml") let $entries:=     for $p in root(.)//text//(placeName[@ref]|origPlace[@ref])          group by $k := $p/@ref   return     id($p[1]/@ref,$register)   return  for $p in $entries   order by $p/@n ascending   return    $p,
                                    "organizations":  let $register := doc("/db/apps/zszh-data/organization/organization.xml")  let $entries:=      for $p in root(.)//text//orgName[@ref]             group by $k := $p/@ref    return          id($p[1]/@ref, $register)      return   for $p in $entries          order by $p/orgName ascending             return                 $p                    ,
                                    "taxonomies": let $register := doc("/db/apps/zszh-data/taxonomy/taxonomy.xml") let $entries:=     for $p in root(.)//keywords//term[starts-with(@ref, "key")]         group by $k := $p/@ref             return                 id($p[1]/@ref, $register)  return  for $p in $entries      order by $p/desc ascending          return                 $p,
                                    "emptyPlace": if(root(.)//text//(placeName[@ref]|origPlace[@ref])) then () else ("hidden") ,
                                    "emptyPerson": if(root(.)//persName[@ref]) then () else ("hidden") ,
                                    "emptyOrg": if(root(.)//text//orgName[@ref]) then () else ("hidden") ,
                                    "emptyTerm": if(root(.)//keywords//term[starts-with(@ref, "key")]) then () else ("hidden") ,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-teiHeader($config, ., $params)
                            return
                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader1", css:map-rend-to-class(.)), $content)
                        else
                            if ($parameters?mode='footer-prev') then
                                let $params := 
                                    map {
                                        "target":              let $idno := .//seriesStmt/idno                 let $col := substring-after(util:collection-name($idno), "/db/apps/zszh-data/")                                          let $temp  := replace($idno, "^(.+?)_(\d{3}.*?)(?:_\d{1,2})?$", "$1 $2")                 let $parts := tokenize($temp)                 let $start := $parts[1]                                          let $id :=                      if (matches($parts[2], "^\d{8}")) then                         replace($parts[2], "_", "-")                     else if (matches($parts[2], "^\d{4}_\d{3}")) then                         number(substring-before($parts[2], "_")) || "-" || number(substring-after($parts[2], "_"))                                                  else if (count($parts) eq 1)                                                      then ()                                                  else                                                          number($parts[2])                 let $next := xs:string($id - 1)                 let $len := string-length($next)                 let $next-id :=                      if ($len > 2) then                          $next                      else                          substring("000", 1, 3 - $len) || $next                                          let $idn := $start || "_" || $next-id                 let $match := for $m in collection("/db/apps/zszh-data")//idno[starts-with(., $idn)] order by $m return $m                                          let $link :=                      if (count($match)) then                          $col || "/" || substring-before(util:document-name(head($match)), '.xml')                     else ()                                           return replace($link, '^(.*)_1$', '$1'),
                                        "content": .
                                    }

                                                                let $content := 
                                    model:template-teiHeader2($config, ., $params)
                                return
                                                                html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader2", "footer", "button-prev", css:map-rend-to-class(.)), $content)
                            else
                                if ($parameters?mode='footer-next') then
                                    let $params := 
                                        map {
                                            "target": let $idno := .//seriesStmt/idno                          let $col := substring-after(util:collection-name($idno), "/db/apps/zszh-data/")                          let $temp  := replace($idno, "^(.+?)_(\d{3}.*?)(?:_\d{1,2})?$", "$1 $2")                          let $parts := tokenize($temp)                          let $start := $parts[1]                          let $id    :=                             if (matches($parts[2], "^\d{8}")) then                                 replace($parts[2], "_", "-")                             else if (matches($parts[2], "^\d{4}_\d{3}")) then                                 number(substring-before($parts[2], "_")) || "-" || number(substring-after($parts[2], "_"))                             else if (count($parts) eq 1)                             then ()                             else                                 number($parts[2])                          let $next := xs:string($id + 1)                         let $len := string-length($next)                         let $next-id := if ($len > 2) then $next else substring("000", 1, 3 - $len) || $next                         let $idn := $start || "_" || $next-id                         let $match := for $m in collection("/db/apps/zszh-data")//idno[starts-with(., $idn)] order by $m return $m                         let $link := if (count($match)) then $col || "/" || substring-before(util:document-name(head($match)), '.xml') else ()                          return replace($link, '^(.*)_1$', '$1'),
                                            "content": .
                                        }

                                                                        let $content := 
                                        model:template-teiHeader3($config, ., $params)
                                    return
                                                                        html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader3", "footer", "button-next", css:map-rend-to-class(.)), $content)
                                else
                                    if ($parameters?view='metadata') then
                                        (
                                            if (not(ends-with(util:document-name(.//sourceDesc), 'Introduction.xml'))) then
                                                html:block($config, ., ("tei-teiHeader4", css:map-rend-to-class(.)), fileDesc)
                                            else
                                                (),
                                            html:block($config, ., ("tei-teiHeader5", css:map-rend-to-class(.)), .//msDesc/head),
                                            ext-html:output-date($config, ., ("tei-teiHeader6", css:map-rend-to-class(.)), .//msDesc),
                                            if (exists(.//msContents/summary/node())) then
                                                let $params := 
                                                    map {
                                                        "content": .//msContents/summary
                                                    }

                                                                                                let $content := 
                                                    model:template-teiHeader7($config, ., $params)
                                                return
                                                                                                html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader7", css:map-rend-to-class(.)), $content)
                                            else
                                                (),
                                            if (root($parameters?root)/TEI[not(@type) or @type != 'introduction']) then
                                                let $params := 
                                                    map {
                                                        "content": .//msDesc
                                                    }

                                                                                                let $content := 
                                                    model:template-teiHeader8($config, ., $params)
                                                return
                                                                                                html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader8", css:map-rend-to-class(.)), $content)
                                            else
                                                ()
                                           (: if (root($parameters?root)/TEI[not(@type) or @type != 'introduction'] and ec:existsAdditionalSource(.//fileDesc/seriesStmt/idno/text())) then
                                                let $params := 
                                                    map {
                                                        "content": ec:additionalSource(.//fileDesc/seriesStmt/idno/text())
                                                    }

                                                                                                let $content := 
                                                    model:template-teiHeader9($config, ., $params)
                                                return
                                                                                                html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader9", css:map-rend-to-class(.)), $content)
                                            else
                                                ():)
                                        )

                                    else
                                        if ($parameters?header='short') then
                                            html:block($config, ., ("tei-teiHeader11", css:map-rend-to-class(.)), .)
                                        else
                                            $config?apply($config, ./node())
                    case element(supplied) return
                        if (parent::choice) then
                            html:inline($config, ., ("tei-supplied1", css:map-rend-to-class(.)), .)
                        else
                            if (@source and @reason) then
                                ext-html:alternote($config, ., ("tei-supplied2", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:translate(@reason, 0, 'uppercase'), ', ', ec:label('supplied-after', false()), ' ', @source), map {})
                            else
                                if (@source) then
                                    ext-html:alternote($config, ., ("tei-supplied3", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:label('supplied-after'), ' ', @source), map {})
                                else
                                    if (@reason) then
                                        ext-html:alternote($config, ., ("tei-supplied4", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:translate(@reason, 0, 'uppercase'), ', ', ec:label('supplied', false())), map {})
                                    else
                                        if (@resp) then
                                            ext-html:alternote($config, ., ("tei-supplied5", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', ec:label('supplied'), map {})
                                        else
                                            html:inline($config, ., ("tei-supplied6", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'))
                    case element(milestone) return
                        html:inline($config, ., ("tei-milestone", css:map-rend-to-class(.)), .)
                    case element(ptr) return
                        if (parent::notatedMusic) then
                            html:webcomponent($config, ., ("tei-ptr", css:map-rend-to-class(.)), ., 'pb-mei', map {"url": @target})
                        else
                            $config?apply($config, ./node())
                    case element(label) return
                        if (@type='keyword') then
                            ext-html:alternote($config, ., ("tei-label1", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:label('marginal-note'), ' ', ec:translate(@place, 0, 'lowercase'), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()), map {})
                        else
                            html:paragraph($config, ., ("tei-label2", css:map-rend-to-class(.)), .)
                    case element(signed) return
                        html:block($config, ., ("tei-signed", css:map-rend-to-class(.)), ('[', ec:label('signed'), ec:punct(':', false()), '] ', .))
                    case element(pb) return
                        if (following-sibling::node()[1][self::lb]) then
                            (: If followed by an lb, process the lb first, then the pb :)
                            ext-html:copy($config, ., ("tei-pb1", css:map-rend-to-class(.)), (following-sibling::lb[1], $node))
                        else
                            if (ancestor::body and not(preceding::pb[ancestor::body])) then
                                (: Hide the first pagebreak in a document (beware: independent of position!) :)
                                html:webcomponent($config, ., ("tei-pb2", css:map-rend-to-class(.)), ., 'pb-facs-link', map {"facs": normalize-space(@facs)})
                            else
                                if (not(@n)) then
                                    (: Show tooltip on pagebreaks that don't contain attributes :)
                                    let $params := 
                                        map {
                                            "content": '|',
                                            "alternate": ec:label('pb'),
                                            "facs": normalize-space(@facs)
                                        }

                                                                        let $content := 
                                        model:template-pb3($config, ., $params)
                                    return
                                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-pb3", "pb-empty", css:map-rend-to-class(.)), $content)
                                else
                                    if (@n and matches(@n, '[vr]$')) then
                                        (: Show pagebreak with a label, if pb contains a @n attribute and its value contains a number+string combination :)
                                        let $params := 
                                            map {
                                                "content": '[fol. ' || @n || ']',
                                                "alternate": ec:label('pb'),
                                                "facs": normalize-space(@facs)
                                            }

                                                                                let $content := 
                                            model:template-pb4($config, ., $params)
                                        return
                                                                                html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-pb4", "pb-foliation", css:map-rend-to-class(.)), $content)
                                    else
                                        if (@n) then
                                            (: Show pagebreak with a label, if pb contains a @n attribute and its value only contains a number :)
                                            let $params := 
                                                map {
                                                    "content": ('[', ec:label('page-abbr', false()), ' ', @n, '] '),
                                                    "facs": normalize-space(@facs),
                                                    "alternate": ec:label('pb')
                                                }

                                                                                        let $content := 
                                                model:template-pb5($config, ., $params)
                                            return
                                                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-pb5", "pb-pagination", css:map-rend-to-class(.)), $content)
                                        else
                                            $config?apply($config, ./node())
                    case element(pc) return
                        html:inline($config, ., ("tei-pc", css:map-rend-to-class(.)), .)
                    case element(anchor) return
                        if (exists(root($parameters?root)//*[@spanTo = '#' || $node/@xml:id])) then
                            ext-html:notespan-end($config, ., ("tei-anchor1", css:map-rend-to-class(.)), root($parameters?root)//*[@spanTo = '#' || $node/@xml:id])
                        else
                            html:anchor($config, ., ("tei-anchor2", css:map-rend-to-class(.)), ., @xml:id)
                    case element(TEI) return
                        if ($parameters?header='context') then
                            html:pass-through($config, ., ("tei-TEI1", css:map-rend-to-class(.)), teiHeader)
                        else
                            if ($parameters?view='metadata') then
                                (
                                    html:block($config, ., ("tei-TEI2", "document-heading", css:map-rend-to-class(.)), teiHeader),
                                    html:block($config, ., ("tei-TEI3", css:map-rend-to-class(.)), text//back)
                                )

                            else
                                html:document($config, ., ("tei-TEI4", css:map-rend-to-class(.)), .)
                    case element(formula) return
                        if (@rendition='simple:display') then
                            html:block($config, ., ("tei-formula1", css:map-rend-to-class(.)), .)
                        else
                            if (@rend='display') then
                                html:webcomponent($config, ., ("tei-formula4", css:map-rend-to-class(.)), ., 'pb-formula', map {"display": true()})
                            else
                                html:webcomponent($config, ., ("tei-formula5", css:map-rend-to-class(.)), ., 'pb-formula', map {})
                    case element(choice) return
                        if (sic and corr) then
                            ext-html:alternote($config, ., ("tei-choice1", "text-critical", css:map-rend-to-class(.)), sic, (), 'text-critical', corr, map {"prefix": (ec:label('corrected'), ec:colon())})
                        else
                            if (abbr and expan) then
                                html:alternate($config, ., ("tei-choice2", "text-critical", css:map-rend-to-class(.)), ., abbr[1], expan[1], map {"prefix": (ec:label('abbr-expanded'), ec:colon())})
                            else
                                if (orig and reg) then
                                    html:alternate($config, ., ("tei-choice3", "text-critical", css:map-rend-to-class(.)), ., orig[1], reg[1], map {})
                                else
                                    $config?apply($config, ./node())
                    case element(hi) return
                        if (@rend='sup') then
                            html:inline($config, ., ("tei-hi1", css:map-rend-to-class(.)), .)
                        else
                            if (@rend!='sup' and @hand) then
                                ext-html:alternote($config, ., ("tei-hi2", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:translate(@rend), ' ', ec:translate(@hand, 0, 'lowercase')), map {})
                            else
                                if (@rend!='sup') then
                                    html:alternate($config, ., ("tei-hi3", "text-critical", css:map-rend-to-class(.)), ., ., ec:translate(@rend), map {"type": 'text-critical'})
                                else
                                    $config?apply($config, ./node())
                    case element(code) return
                        html:inline($config, ., ("tei-code", css:map-rend-to-class(.)), .)
                    case element(note) return
                        if (@place) then
                            ext-html:note($config, ., ("tei-note1", css:map-rend-to-class(.)), ., @place, @n, (), map {})
                        else
                            ext-html:note($config, ., ("tei-note2", css:map-rend-to-class(.)), ., (), (), 'note', map {})
                    case element(dateline) return
                        html:block($config, ., ("tei-dateline", css:map-rend-to-class(.)), .)
                    (: back contains the commentary, which normally should appear as a numbered list :)
                    case element(back) return
                        if ($parameters?view='metadata' and exists(./div/p/node())) then
                            let $params := 
                                map {
                                    "content": div
                                }

                                                        let $content := 
                                model:template-back($config, ., $params)
                            return
                                                        html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-back1", css:map-rend-to-class(.)), $content)
                        else
                            if (div/@n) then
                                html:list($config, ., ("tei-back2", css:map-rend-to-class(.)), ., 'ordered')
                            else
                                html:block($config, ., ("tei-back3", css:map-rend-to-class(.)), .)
                    case element(del) return
                        if (ancestor::back//orig) then
                            html:omit($config, ., ("tei-del1", css:map-rend-to-class(.)), .)
                        else
                            if (add/@type='catchword') then
                                ext-html:note($config, ., ("tei-del2", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:label('del-add'), ' ', string-join((ec:translate(add/@place, 0, 'lowercase'), ', ', ec:translate(add/@type, 0, 'lowercase')), ''), ec:colon())})
                            else
                                if (@hand='later hand' and not(parent::subst)) then
                                    (: Show text of del with popup and footnote :)
                                    ext-html:alternote($config, ., ("tei-del3", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (if (@rend) then (ec:translate(@rend, 0, 'uppercase')) else (ec:label('del')), ' ', ec:translate(@hand, 0, 'lowercase')), map {})
                                else
                                    if (add) then
                                        ext-html:note($config, ., ("tei-del4", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:label('del-add'), ' ', string-join((ec:translate(add/@place, 0, 'lowercase'), ec:translate(add/@hand, 0, 'lowercase'), ec:translate(add/@rend, 0, 'lowercase'), ec:translate(add/@type, 0, 'lowercase')), ' '), ec:colon())})
                                    else
                                        if (parent::subst) then
                                            html:inline($config, ., ("tei-del5", css:map-rend-to-class(.)), .)
                                        else
                                            if (gap) then
                                                ext-html:alternote($config, ., ("tei-del6", css:map-rend-to-class(.)), '', (), 'text-critical', (ec:label('del-gap'), ' (', gap/@quantity, ' ', ec:translate(gap/@unit, gap/@quantity, ()), ')'), map {})
                                            else
                                                if (unclear and @rend) then
                                                    ext-html:note($config, ., ("tei-del7", css:map-rend-to-class(.)), ., "footnote", (), 'text-critical', map {"prefix": (ec:translate(@rend),', ', ec:label('unclear-rdg', false()), ec:colon())})
                                                else
                                                    if (unclear) then
                                                        ext-html:note($config, ., ("tei-del8", css:map-rend-to-class(.)), ., "footnote", (), 'text-critical', map {"prefix": (ec:label('del'), ', ', ec:label('unclear-rdg', false()), ec:colon())})
                                                    else
                                                        if (@rend) then
                                                            (: Show footnote only :)
                                                            ext-html:note($config, ., ("tei-del9", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:translate(@rend, 0, 'uppercase'), if (@hand) then (' ', ec:translate(@hand, 0, 'lowercase')) else (), ec:colon())})
                                                        else
                                                            if (@hand) then
                                                                (: Show footnote only :)
                                                                ext-html:note($config, ., ("tei-del10", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:label('del'), ' ', ec:translate(@hand, 0, 'uppercase'), ec:colon())})
                                                            else
                                                                (: Show footnote only :)
                                                                ext-html:note($config, ., ("tei-del11", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:label('del'), ec:colon())})
                    case element(trailer) return
                        html:block($config, ., ("tei-trailer", css:map-rend-to-class(.)), .)
                    case element(titlePart) return
                        html:block($config, ., css:get-rendition(., ("tei-titlePart", css:map-rend-to-class(.))), .)
                    case element(ab) return
                        if (@place) then
                            html:block($config, ., ("tei-ab1", "ab", css:map-rend-to-class(.)), ('[', string-join((ec:translate(@type, 0, 'lowercase'),ec:translate(@place, 0, 'lowercase'),ec:translate(@hand, 0, 'lowercase')), ' '), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else (), ec:punct(':', false()), '] ', .))
                        else
                            html:paragraph($config, ., ("tei-ab2", css:map-rend-to-class(.)), .)
                    case element(revisionDesc) return
                        html:omit($config, ., ("tei-revisionDesc", css:map-rend-to-class(.)), .)
                    case element(am) return
                        html:inline($config, ., ("tei-am", css:map-rend-to-class(.)), .)
                    case element(subst) return
                        if (ancestor::teiHeader) then
                            html:inline($config, ., ("tei-subst1", css:map-rend-to-class(.)), add)
                        else
                            if (del/gap and add) then
                                ext-html:alternote($config, ., ("tei-subst2", css:map-rend-to-class(.)), add, (), 'text-critical', (ec:label('corr'), ' ', ec:translate(add/@place, 0, 'lowercase'), ', ', ec:label('subst-del-gap', false())), map {})
                            else
                                if (add[@hand='later hand'] and del[@hand='later hand']) then
                                    ext-html:alternote($config, ., ("tei-subst3", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del, map {"prefix": (ec:label('corr', true()), ' ', ec:translate(add/@hand, 0, 'lowercase'), ' ', ec:translate(add/@place, 0, 'lowercase'), ', ', ec:label('replace', false()), ec:colon())})
                                else
                                    if (add/@hand) then
                                        ext-html:alternote($config, ., ("tei-subst4", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del, map {"prefix": (ec:label('corr', true()), ' ', ec:translate(add/@hand, 0, 'lowercase'), ' ', ec:translate(add/@place, 0, 'lowercase'), ', ', ec:label('replace', false()), ec:colon())})
                                    else
                                        if (add) then
                                            ext-html:alternote($config, ., ("tei-subst5", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del, map {"prefix": (ec:label('corr', true()), ' ', ec:translate(add/@place, 0, 'lowercase'), ', ', ec:label('replace', false()), ec:colon())})
                                        else
                                            html:inline($config, ., ("tei-subst6", css:map-rend-to-class(.)), .)
                    case element(roleDesc) return
                        html:block($config, ., ("tei-roleDesc", css:map-rend-to-class(.)), .)
                    case element(orig) return
                        html:inline($config, ., ("tei-orig", css:map-rend-to-class(.)), ('«', ., '»'))
                    case element(opener) return
                        html:block($config, ., ("tei-opener", css:map-rend-to-class(.)), .)
                    case element(speaker) return
                        html:block($config, ., ("tei-speaker", css:map-rend-to-class(.)), .)
                    case element(imprimatur) return
                        html:block($config, ., ("tei-imprimatur", css:map-rend-to-class(.)), .)
                    case element(publisher) return
                        if (ancestor::teiHeader) then
                            (: Omit if located in teiHeader. :)
                            html:omit($config, ., ("tei-publisher", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(figDesc) return
                        html:inline($config, ., ("tei-figDesc", css:map-rend-to-class(.)), .)
                    case element(rs) return
                        html:inline($config, ., ("tei-rs", css:map-rend-to-class(.)), .)
                    case element(foreign) return
                        if ((session:get-attribute('ssrq.lang'), 'de')[1]='fr') then
                            html:alternate($config, ., ("tei-foreign1", css:map-rend-to-class(.)), ., ., (ec:label('lang-switch'), ec:colon(), ' ', ec:label(@xml:lang, false())), map {})
                        else
                            html:alternate($config, ., ("tei-foreign2", css:map-rend-to-class(.)), ., ., (ec:label('lang-switch'), ec:colon(), ' ', ec:label(@xml:lang, false())), map {})
                    case element(fileDesc) return
                        if ($parameters?header='short' and ancestor::TEI[@type='introduction']) then
                            (
                                html:block($config, ., ("tei-fileDesc1", "header-short", css:map-rend-to-class(.)), ec:format-id(seriesStmt/idno)),
                                ext-html:link($config, ., ("tei-fileDesc2", "header-short", "title", css:map-rend-to-class(.)),                              let $subtype := ancestor::TEI/@subtype                              return switch ($subtype)                                 case 'a' return 'Reihenvorwort'                                 case 'b' return 'Vorwort'                                 case 'c' return 'Einleitung'                                 case 'd' return 'Quellenverzeichnis'                                 default return 'Introduction'                                 , $parameters?doc, ())
                            )

                        else
                            if ($parameters?header='short') then
                                (
                                    html:block($config, ., ("tei-fileDesc3", "header-short", css:map-rend-to-class(.)), ec:format-id(seriesStmt/idno)),
                                    ext-html:link($config, ., ("tei-fileDesc4", "header-short", css:map-rend-to-class(.)), sourceDesc/msDesc/head, $parameters?doc, ()),
                                    html:block($config, ., ("tei-fileDesc5", "header-short", css:map-rend-to-class(.)), if (exists(sourceDesc/msDesc/msContents/msItem/filiation[@type='original'][origDate])) then                                      ec:print-date(sourceDesc/msDesc/msContents/msItem/filiation[@type='original']/origDate)                                     else if (exists(sourceDesc/msDesc/history/origin/origDate)) then                                     ec:print-date(sourceDesc/msDesc/history/origin/origDate)                                    else                                       ()),
                                    html:block($config, ., ("tei-fileDesc6", "header-short", css:map-rend-to-class(.)), editionStmt),
                                    html:block($config, ., ("tei-fileDesc7", "header-short", css:map-rend-to-class(.)), publicationStmt),
                                    html:block($config, ., ("tei-fileDesc8", "header-short", css:map-rend-to-class(.)), titleStmt)
                                )

                            else
                                if ($parameters?view='volumes') then
                                    let $params := 
                                        map {
                                            "stmtTitle": seriesStmt/title,
                                            "fileDescTitle": ec:short-title(titleStmt/title),
                                            "fileDescPerson": ec:persName-list(titleStmt/respStmt[1]/persName),
                                            "count": $parameters?count,
                                            "content": .
                                        }

                                                                        let $content := 
                                        model:template-fileDesc9($config, ., $params)
                                    return
                                                                        html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc9", css:map-rend-to-class(.)), $content)
                                else
                                    if ($parameters?view='metadata' and ends-with(util:document-name($get(.)), 'Einleitung.xml')) then
                                        (: Render page titles for TEI type "Introduction" :)
                                        let $params := 
                                            map {
                                                "stmtTitle": seriesStmt/title,
                                                "fileDescTitle": titleStmt/title,
                                                "content": .
                                            }

                                                                                let $content := 
                                            model:template-fileDesc10($config, ., $params)
                                        return
                                                                                html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc10", css:map-rend-to-class(.)), $content)
                                    else
                                        if ($parameters?view='metadata') then
                                            (: Render popover containing tei metadata :)
                                            let $params := 
                                                map {
                                                    "idno-canton": ec:get-canton(seriesStmt/idno),
                                                    "idno-format": ec:format-id(seriesStmt/idno),
                                                    "stmtTitle": seriesStmt/title,
                                                    "fileDescTitle": titleStmt/title,
                                                    "fileDescPerson": ec:persName-list(titleStmt/respStmt[1]/persName),
                                                    "credits": ./publicationStmt/availability/p[@xml:id='facs']/text(),
                                                    "link": 'https://rechtsquellen.sources-online.org/' || substring-after(util:collection-name(.), '/db/apps/zszh-data/') || '/' || replace(seriesStmt/idno, '^(.*)_1$', '$1'),
                                                    "content": .
                                                }

                                                                                        let $content := 
                                                model:template-fileDesc11($config, ., $params)
                                            return
                                                                                        html:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc11", css:map-rend-to-class(.)), $content)
                                        else
                                            $config?apply($config, ./node())
                    case element(notatedMusic) return
                        html:figure($config, ., ("tei-notatedMusic", css:map-rend-to-class(.)), ptr, label)
                    case element(seg) return
                        html:inline($config, ., ("tei-seg", css:map-rend-to-class(.)), .)
                    case element(profileDesc) return
                        html:omit($config, ., ("tei-profileDesc", css:map-rend-to-class(.)), .)
                    case element(email) return
                        html:inline($config, ., ("tei-email", css:map-rend-to-class(.)), .)
                    case element(text) return
                        html:body($config, ., ("tei-text", css:map-rend-to-class(.)), .)
                    case element(floatingText) return
                        html:block($config, ., ("tei-floatingText", css:map-rend-to-class(.)), .)
                    case element(sp) return
                        html:block($config, ., ("tei-sp", css:map-rend-to-class(.)), .)
                    case element(abbr) return
                        if (parent::choice) then
                            html:inline($config, ., ("tei-abbr1", css:map-rend-to-class(.)), .)
                        else
                            if (unclear) then
                                html:alternate($config, ., ("tei-abbr2", css:map-rend-to-class(.)), ., ., (ec:label('abbr-unclear'), ec:colon(), ec:abbr(.)), map {})
                            else
                                html:alternate($config, ., ("tei-abbr3", css:map-rend-to-class(.)), ., ., (ec:label('abbr'), ec:colon(), ec:abbr(.)), map {})
                    case element(table) return
                        html:table($config, ., ("tei-table", css:map-rend-to-class(.)), .)
                    case element(cb) return
                        html:break($config, ., ("tei-cb", css:map-rend-to-class(.)), ., 'column', @n)
                    case element(group) return
                        html:block($config, ., ("tei-group", css:map-rend-to-class(.)), .)
                    case element(licence) return
                        if (@target) then
                            ext-html:link($config, ., ("tei-licence1", "licence", css:map-rend-to-class(.)), 'Licence', (), ())
                        else
                            html:omit($config, ., ("tei-licence2", css:map-rend-to-class(.)), .)
                    case element(editor) return
                        if (ancestor::teiHeader) then
                            html:omit($config, ., ("tei-editor1", css:map-rend-to-class(.)), .)
                        else
                            html:inline($config, ., ("tei-editor2", css:map-rend-to-class(.)), .)
                    case element(c) return
                        html:inline($config, ., ("tei-c", css:map-rend-to-class(.)), .)
                    case element(listBibl) return
                        if (not($parameters?mode = 'filiation')) then
                            (
                                (: Titel des Bibliographieabschnitts :)
                                html:heading($config, ., ("tei-listBibl1", css:map-rend-to-class(.)), head/node(), 5),
                                (: Liste der Bibliographieeinträge :)
                                html:list($config, ., ("tei-listBibl2", css:map-rend-to-class(.)), bibl, ())
                            )

                        else
                            html:omit($config, ., ("tei-listBibl3", css:map-rend-to-class(.)), .)
                    case element(address) return
                        html:block($config, ., ("tei-address", css:map-rend-to-class(.)), .)
                    case element(g) return
                        if (not(text())) then
                            html:glyph($config, ., ("tei-g1", css:map-rend-to-class(.)), .)
                        else
                            html:inline($config, ., ("tei-g2", css:map-rend-to-class(.)), .)
                    case element(author) return
                        (: Ausgabe des Schreibers im Header :)
                        html:listItem($config, ., ("tei-author", css:map-rend-to-class(.)), (ec:label('scriptor'), ec:colon(), .), ())
                    case element(castList) return
                        if (child::*) then
                            html:list($config, ., css:get-rendition(., ("tei-castList", css:map-rend-to-class(.))), castItem, ())
                        else
                            $config?apply($config, ./node())
                    case element(l) return
                        html:block($config, ., css:get-rendition(., ("tei-l", css:map-rend-to-class(.))), .)
                    case element(closer) return
                        html:block($config, ., ("tei-closer", css:map-rend-to-class(.)), .)
                    case element(rhyme) return
                        html:inline($config, ., ("tei-rhyme", css:map-rend-to-class(.)), .)
                    case element(list) return
                        if (@rendition) then
                            html:list($config, ., css:get-rendition(., ("tei-list1", css:map-rend-to-class(.))), item, ())
                        else
                            if (not(@rendition)) then
                                html:list($config, ., ("tei-list2", css:map-rend-to-class(.)), item, ())
                            else
                                $config?apply($config, ./node())
                    case element(p) return
                        html:paragraph($config, ., css:get-rendition(., ("tei-p", css:map-rend-to-class(.))), .)
                    case element(measure) return
                        if (ancestor::measureGrp and (session:get-attribute('ssrq.lang'), 'de')[1]!='de') then
                            (: Display summarized measures for a measure group in a tooltip (non German) :)
                            html:alternate($config, ., ("tei-measure1", "text-critical", css:map-rend-to-class(.)), ., ., let $measures := ancestor::measureGrp//measure  return (  ec:translate($measures[1]/@type, 0, 'uppercase'), ec:colon(),           for $measure in $measures     return     (' ', $measure/@quantity, ' ', ec:translate($measure/@unit, $measure/@quantity, 'lowercase'), ' ', ec:translate($measure/@commodity, 0, 'lowercase'), ' ', ec:translate($measure/@origin, 0, 'lowercase')) ), map {})
                        else
                            if (ancestor::measureGrp and (session:get-attribute('ssrq.lang'), 'de')[1]='de') then
                                (: Display summarized measures for a measure group in a tooltip (German) :)
                                html:alternate($config, ., ("tei-measure2", "text-critical", css:map-rend-to-class(.)), ., ., let $measures := ancestor::measureGrp//measure  return (  ec:translate($measures[1]/@type, 0, 'uppercase'), ec:colon(),           for $measure in $measures     return     (' ', $measure/@quantity, ' ', ec:translate($measure/@origin, 0, 'lowercase'), ' ', ec:translate($measure/@unit, $measure/@quantity, 'lowercase'), ' ', ec:translate($measure/@commodity, 0, 'lowercase')) ), map {})
                            else
                                if ((session:get-attribute('ssrq.lang'), 'de')[1]='de') then
                                    (: Display measurement with given parameters in tooltip and highlight text with color :)
                                    html:alternate($config, ., ("tei-measure3", "text-critical", css:map-rend-to-class(.)), ., ., (ec:translate(@type, 0, 'uppercase'), ec:colon(), @quantity, ' ', ec:translate(@origin, 0, 'lowercase'), ' ', ec:translate(@unit, @quantity, 'lowercase'), ' ', ec:translate(@commodity, 0, 'lowercase')), map {})
                                else
                                    if ((session:get-attribute('ssrq.lang'), 'de')[1]!='de') then
                                        (: Display measurement with given parameters in tooltip and highlight text with color :)
                                        html:alternate($config, ., ("tei-measure4", "text-critical", css:map-rend-to-class(.)), ., ., (ec:translate(@type, 0, 'uppercase'), ec:colon(), @quantity, ' ', ec:translate(@unit, @quantity, 'lowercase'), ' ', ec:translate(@commodity, 0, 'lowercase'), ' ', ec:translate(@origin, 0, 'lowercase')), map {})
                                    else
                                        $config?apply($config, ./node())
                    case element(q) return
                        html:inline($config, ., ("tei-q", css:map-rend-to-class(.)), ('«', ., '»'))
                    case element(actor) return
                        html:inline($config, ., ("tei-actor", css:map-rend-to-class(.)), .)
                    case element(epigraph) return
                        html:block($config, ., ("tei-epigraph", css:map-rend-to-class(.)), .)
                    case element(s) return
                        html:inline($config, ., ("tei-s", css:map-rend-to-class(.)), .)
                    case element(docTitle) return
                        html:block($config, ., css:get-rendition(., ("tei-docTitle", css:map-rend-to-class(.))), .)
                    case element(lb) return
                        if (ancestor::back//orig) then
                            html:omit($config, ., ("tei-lb1", css:map-rend-to-class(.)), .)
                        else
                            if (preceding-sibling::node()[1][self::pb]) then
                                html:omit($config, ., ("tei-lb2", css:map-rend-to-class(.)), .)
                            else
                                if (. is ancestor::div/node()[1]) then
                                    html:omit($config, ., ("tei-lb3", css:map-rend-to-class(.)), .)
                                else
                                    if (. is ancestor::p/node()[1]) then
                                        html:omit($config, ., ("tei-lb4", css:map-rend-to-class(.)), .)
                                    else
                                        if (@break='no') then
                                            (
                                                html:inline($config, ., ("tei-lb5", css:map-rend-to-class(.)), .),
                                                html:break($config, ., ("tei-lb6", css:map-rend-to-class(.)), ., 'page', @n)
                                            )

                                        else
                                            html:break($config, ., ("tei-lb7", css:map-rend-to-class(.)), ., 'line', @n)
                    case element(w) return
                        html:inline($config, ., ("tei-w", css:map-rend-to-class(.)), .)
                    case element(stage) return
                        html:block($config, ., ("tei-stage", css:map-rend-to-class(.)), .)
                    case element(titlePage) return
                        html:block($config, ., css:get-rendition(., ("tei-titlePage", css:map-rend-to-class(.))), .)
                    case element(name) return
                        html:inline($config, ., ("tei-name", css:map-rend-to-class(.)), .)
                    case element(front) return
                        html:block($config, ., ("tei-front", css:map-rend-to-class(.)), .)
                    case element(lg) return
                        html:block($config, ., ("tei-lg", css:map-rend-to-class(.)), .)
                    case element(publicationStmt) return
                        html:block($config, ., ("tei-publicationStmt1", css:map-rend-to-class(.)), availability/licence)
                    case element(biblScope) return
                        html:inline($config, ., ("tei-biblScope", css:map-rend-to-class(.)), .)
                    case element(desc) return
                        html:inline($config, ., ("tei-desc", css:map-rend-to-class(.)), .)
                    case element(role) return
                        html:block($config, ., ("tei-role", css:map-rend-to-class(.)), .)
                    case element(docEdition) return
                        html:inline($config, ., ("tei-docEdition", css:map-rend-to-class(.)), .)
                    case element(num) return
                        (: Display number in tooltip and highlight text with color :)
                        html:alternate($config, ., ("tei-num", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('amount'), ec:colon(), @value), map {})
                    case element(docImprint) return
                        html:listItem($config, ., ("tei-docImprint", css:map-rend-to-class(.)), (ec:label('imprint'), ec:colon(), translate((translate((pubPlace/text() || " " || publisher/text() ),")","")),"(","")), ())
                    case element(postscript) return
                        html:block($config, ., ("tei-postscript", css:map-rend-to-class(.)), .)
                    case element(edition) return
                        if (ancestor::teiHeader) then
                            html:block($config, ., ("tei-edition", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(cell) return
                        (: Insert table cell. :)
                        html:cell($config, ., ("tei-cell", css:map-rend-to-class(.)), ., ())
                    case element(relatedItem) return
                        html:inline($config, ., ("tei-relatedItem", css:map-rend-to-class(.)), .)
                    case element(div) return
                        if (parent::back and @n) then
                            (: output as list item if in commentary :)
                            html:listItem($config, ., ("tei-div1", css:map-rend-to-class(.)), ., ())
                        else
                            if (parent::body or parent::front or parent::back) then
                                html:section($config, ., ("tei-div2", css:map-rend-to-class(.)), .)
                            else
                                html:block($config, ., ("tei-div3", css:map-rend-to-class(.)), .)
                    case element(graphic) return
                        html:graphic($config, ., ("tei-graphic", css:map-rend-to-class(.)), ., @url, @width, @height, @scale, desc)
                    case element(reg) return
                        html:inline($config, ., ("tei-reg", css:map-rend-to-class(.)), .)
                    case element(ref) return
                        if (parent::bibl) then
                            ext-html:link($config, ., ("tei-ref1", "ref-link", css:map-rend-to-class(.)), ., ec:ref-link(@target, util:collection-name(.)), ())
                        else
                            if (ancestor::div/@type='collection') then
                                (: Link in Klammerdokument :)
                                ext-html:link($config, ., ("tei-ref2", css:map-rend-to-class(.)), (doc(util:collection-name(.) || '/' || . || '.xml')//sourceDesc/msDesc/head/text(), ' (', ec:format-id(.), ')'), string() || '.xml', ())
                            else
                                if (not(@target) and matches(., '^(?:SSRQ|SDS|FDS)_')) then
                                    (: Link auf ein anderes Dokument innerhalb Portal :)
                                    ext-html:link($config, ., ("tei-ref3", css:map-rend-to-class(.)), ., string() || ".xml", ())
                                else
                                    if (not(@target)) then
                                        (: Link ohne Verweisadresse :)
                                        html:inline($config, ., ("tei-ref4", css:map-rend-to-class(.)), .)
                                    else
                                        if (not(text())) then
                                            ext-html:link($config, ., ("tei-ref5", css:map-rend-to-class(.)), @target, @target, ())
                                        else
                                            ext-html:link($config, ., ("tei-ref6", css:map-rend-to-class(.)), ., @target, '_new')
                    case element(pubPlace) return
                        if (ancestor::teiHeader) then
                            (: Omit if located in teiHeader. :)
                            html:omit($config, ., ("tei-pubPlace", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(add) return
                        if (ancestor::back//orig) then
                            html:inline($config, ., ("tei-add1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::subst) then
                                html:inline($config, ., ("tei-add2", css:map-rend-to-class(.)), .)
                            else
                                if (parent::del) then
                                    html:inline($config, ., ("tei-add3", css:map-rend-to-class(.)), .)
                                else
                                    if (@hand!='other hand') then
                                        (: Show footnote only :)
                                        ext-html:note($config, ., ("tei-add4", css:map-rend-to-class(.)), ., (), (), 'text-critical', map {"prefix": (ec:span((ec:label('add'), ' ', string-join((ec:translate(@place, 0, 'lowercase'), ec:translate(@hand, 0, 'lowercase'), ec:translate(@rend, 0, 'lowercase'), ec:translate(@type, 0, 'lowercase')), ' '), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else (), ec:colon())))})
                                    else
                                        if (@type='catchword') then
                                            (: Show text of add with popup and footnote :)
                                            ext-html:alternote($config, ., ("tei-add6", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:span((ec:label('add'), ' ', string-join((ec:translate(@place, 0, 'lowercase'), ', ', ec:translate(@type, 0, 'lowercase')))))), map {})
                                        else
                                            (: Show text of add with popup and footnote :)
                                            ext-html:alternote($config, ., ("tei-add5", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:span((ec:label('add'), ' ', string-join((ec:translate(@place, 0, 'lowercase'), ec:translate(@hand, 0, 'lowercase'), ec:translate(@rend, 0, 'lowercase'), ec:translate(@type, 0, 'lowercase')), ' '))), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()), map {})
                    case element(docDate) return
                        html:inline($config, ., ("tei-docDate", css:map-rend-to-class(.)), .)
                    case element(head) return
                        if (@resp) then
                            html:omit($config, ., ("tei-head1", css:map-rend-to-class(.)), .)
                        else
                            if (@type='title') then
                                html:heading($config, ., ("tei-head2", css:map-rend-to-class(.)), ., 1)
                            else
                                if (@type='subtitle') then
                                    html:heading($config, ., ("tei-head3", css:map-rend-to-class(.)), ., 2)
                                else
                                    if ($parameters?header='short') then
                                        html:heading($config, ., ("tei-head5", css:map-rend-to-class(.)), replace(string-join(.//text() except .//ref//text()), '^(.*?)[^\w]*$', '$1'), ())
                                    else
                                        if (parent::figure) then
                                            html:block($config, ., ("tei-head6", css:map-rend-to-class(.)), .)
                                        else
                                            if (parent::table) then
                                                (: head inside table should be output as caption element :)
                                                ext-html:caption($config, ., ("tei-head7", css:map-rend-to-class(.)), .)
                                            else
                                                if (parent::lg) then
                                                    html:block($config, ., ("tei-head8", css:map-rend-to-class(.)), .)
                                                else
                                                    if (parent::list) then
                                                        html:block($config, ., ("tei-head9", css:map-rend-to-class(.)), .)
                                                    else
                                                        if (ancestor::app) then
                                                            (: Heading in app (don't format) :)
                                                            html:inline($config, ., ("tei-head10", css:map-rend-to-class(.)), .)
                                                        else
                                                            html:heading($config, ., css:get-rendition(., ("tei-head4", css:map-rend-to-class(.))), ., 2)
                    case element(ex) return
                        html:inline($config, ., ("tei-ex", css:map-rend-to-class(.)), .)
                    case element(castGroup) return
                        if (child::*) then
                            (: Insert list. :)
                            html:list($config, ., ("tei-castGroup", css:map-rend-to-class(.)), castItem|castGroup, ())
                        else
                            $config?apply($config, ./node())
                    case element(time) return
                        if (@period) then
                            (: Display time with given parameter in tooltip and highlight text with color :)
                            html:alternate($config, ., ("tei-time1", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:translate(@period, 0, ())), map {})
                        else
                            if (@when) then
                                (: Display time with given parameter in tooltip and highlight text with color :)
                                html:alternate($config, ., ("tei-time2", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('time'), ec:colon(), format-time(@when, '[H]:[m]')), map {})
                            else
                                if (@dur) then
                                    (: Display time in tooltip and highlight text with color :)
                                    html:alternate($config, ., ("tei-time3", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:format-duration(@dur)), map {})
                                else
                                    (: Display time in tooltip and highlight text with color :)
                                    html:alternate($config, ., ("tei-time4", "text-critical", css:map-rend-to-class(.)), ., ., ec:label('time'), map {})
                    case element(bibl) return
                        if (@type='url') then
                            let $params := 
                                map {
                                    "url": ref/@target,
                                    "text": .,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-bibl($config, ., $params)
                            return
                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-bibl1", "bibl-link", css:map-rend-to-class(.)), $content)
                        else
                            if (ancestor::teiHeader) then
                                html:listItem($config, ., ("tei-bibl2", css:map-rend-to-class(.)), ., ())
                            else
                                html:inline($config, ., ("tei-bibl3", css:map-rend-to-class(.)), .)
                    case element(salute) return
                        if (parent::closer) then
                            html:inline($config, ., ("tei-salute1", css:map-rend-to-class(.)), .)
                        else
                            html:block($config, ., ("tei-salute2", css:map-rend-to-class(.)), .)
                    case element(unclear) return
                        if (ancestor::back//orig) then
                            html:inline($config, ., ("tei-unclear1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::del or parent::abbr or parent::corr or parent::lem or parent::rdg) then
                                html:inline($config, ., ("tei-unclear2", css:map-rend-to-class(.)), .)
                            else
                                ext-html:alternote($config, ., ("tei-unclear3", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', ec:label('unclear-rdg'), map {})
                    case element(argument) return
                        html:block($config, ., ("tei-argument", css:map-rend-to-class(.)), .)
                    case element(date) return
                        if (@when and @type) then
                            html:alternate($config, ., ("tei-date1", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ec:colon(), ec:format-date(@when), ' (', ec:translate(@type, 0, ()), ')'), map {})
                        else
                            if (@when and @calendar) then
                                html:alternate($config, ., ("tei-date2", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ec:colon(), ec:format-date(@when), ' (', ec:translate(@calendar, 0, ()), ')'), map {})
                            else
                                if (@when) then
                                    html:alternate($config, ., ("tei-date3", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ec:colon(), ec:format-date(@when)), map {})
                                else
                                    if (@from and @to) then
                                        html:alternate($config, ., ("tei-date4", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ec:colon(), ec:format-date(@from), ' – ', ec:format-date(@to)), map {})
                                    else
                                        if (@period) then
                                            html:alternate($config, ., ("tei-date5", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:translate(@period, 0, ())), map {})
                                        else
                                            if (@dur[ends-with(., 'W')]) then
                                                (: Alternate (popover) for week duration labels in custom format e.g. 'R/P1W'. :)
                                                html:alternate($config, ., ("tei-date6", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('repeated-duration'), ec:colon(),ec:format-week-duration(substring-after(@dur, 'R/'))), map {})
                                            else
                                                if (@dur[starts-with(., 'R/P')]) then
                                                    html:alternate($config, ., ("tei-date7", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('repeated-duration'), ec:colon(), ec:format-duration(substring-after(@dur, 'R/'))), map {})
                                                else
                                                    if (@dur) then
                                                        html:alternate($config, ., ("tei-date8", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:format-duration(@dur)), map {})
                                                    else
                                                        if (@type) then
                                                            html:alternate($config, ., ("tei-date9", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ' ', ec:translate(@type, 0, ())), map {})
                                                        else
                                                            if (text()) then
                                                                html:inline($config, ., ("tei-date10", "text-critical", css:map-rend-to-class(.)), .)
                                                            else
                                                                $config?apply($config, ./node())
                    case element(title) return
                        if ($parameters?header='short') then
                            html:heading($config, ., ("tei-title1", css:map-rend-to-class(.)), ., 5)
                        else
                            if (parent::titleStmt/parent::fileDesc) then
                                (
                                    if (preceding-sibling::title) then
                                        html:text($config, ., ("tei-title2", css:map-rend-to-class(.)), ' — ')
                                    else
                                        (),
                                    html:inline($config, ., ("tei-title3", css:map-rend-to-class(.)), .)
                                )

                            else
                                if (not(@level) and parent::bibl) then
                                    html:inline($config, ., ("tei-title4", css:map-rend-to-class(.)), .)
                                else
                                    if (@level='m' or not(@level)) then
                                        (
                                            html:inline($config, ., ("tei-title5", css:map-rend-to-class(.)), .),
                                            if (ancestor::biblFull) then
                                                html:text($config, ., ("tei-title6", css:map-rend-to-class(.)), ', ')
                                            else
                                                ()
                                        )

                                    else
                                        if (@level='s' or @level='j') then
                                            (
                                                html:inline($config, ., ("tei-title7", css:map-rend-to-class(.)), .),
                                                if (following-sibling::* and     (  ancestor::biblFull)) then
                                                    html:text($config, ., ("tei-title8", css:map-rend-to-class(.)), ', ')
                                                else
                                                    ()
                                            )

                                        else
                                            if (@level='u' or @level='a') then
                                                (
                                                    html:inline($config, ., ("tei-title9", css:map-rend-to-class(.)), .),
                                                    if (following-sibling::* and     (    ancestor::biblFull)) then
                                                        html:text($config, ., ("tei-title10", css:map-rend-to-class(.)), '. ')
                                                    else
                                                        ()
                                                )

                                            else
                                                html:inline($config, ., ("tei-title11", css:map-rend-to-class(.)), .)
                    case element(corr) return
                        if (parent::choice) then
                            html:inline($config, ., ("tei-corr1", css:map-rend-to-class(.)), .)
                        else
                            html:alternate($config, ., ("tei-corr2", css:map-rend-to-class(.)), ., ., ec:label('corr'), map {})
                    case element(cit) return
                        if (child::quote and child::bibl) then
                            (: Insert citation :)
                            html:cit($config, ., ("tei-cit", css:map-rend-to-class(.)), ., ())
                        else
                            $config?apply($config, ./node())
                    case element(titleStmt) return
                        if ($parameters?header='short') then
                            (
                                html:block($config, ., ("tei-titleStmt2", css:map-rend-to-class(.)), subsequence(title, 2)),
                                html:block($config, ., ("tei-titleStmt3", css:map-rend-to-class(.)), author)
                            )

                        else
                            html:block($config, ., ("tei-titleStmt4", css:map-rend-to-class(.)), .)
                    case element(sic) return
                        if (parent::choice and count(parent::*/*) gt 1) then
                            html:inline($config, ., ("tei-sic1", css:map-rend-to-class(.)), .)
                        else
                            html:alternate($config, ., ("tei-sic2", "text-critical", css:map-rend-to-class(.)), ., ., ec:label('sic'), map {"type": 'text-critical'})
                    case element(expan) return
                        html:inline($config, ., ("tei-expan", css:map-rend-to-class(.)), .)
                    case element(body) return
                        (
                            html:index($config, ., ("tei-body1", css:map-rend-to-class(.)), 'toc', .),
                            html:block($config, ., ("tei-body2", "body", css:map-rend-to-class(.)), .)
                        )

                    case element(spGrp) return
                        html:block($config, ., ("tei-spGrp", css:map-rend-to-class(.)), .)
                    case element(fw) return
                        if (ancestor::p or ancestor::ab) then
                            html:inline($config, ., ("tei-fw1", css:map-rend-to-class(.)), .)
                        else
                            html:block($config, ., ("tei-fw2", css:map-rend-to-class(.)), .)
                    case element(encodingDesc) return
                        html:omit($config, ., ("tei-encodingDesc", css:map-rend-to-class(.)), .)
                    case element(addrLine) return
                        html:block($config, ., ("tei-addrLine", css:map-rend-to-class(.)), .)
                    case element(gap) return
                        if (@reason='irrelevant') then
                            html:alternate($config, ., ("tei-gap1", "text-critical", css:map-rend-to-class(.)), ., text{'[...]'}, ec:label('irrelevant'), map {"type": 'text-critical'})
                        else
                            if (@reason='illegible') then
                                ext-html:alternote($config, ., ("tei-gap2", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('unreadable'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'), map {})
                            else
                                if (@reason='missing') then
                                    ext-html:alternote($config, ., ("tei-gap3", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('missing'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'), map {})
                                else
                                    if (@source) then
                                        ext-html:alternote($config, ., ("tei-gap4", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('compare'), ' ', @source), map {})
                                    else
                                        if (desc) then
                                            html:inline($config, ., ("tei-gap5", css:map-rend-to-class(.)), .)
                                        else
                                            if (@extent) then
                                                html:inline($config, ., ("tei-gap6", "text-critical", css:map-rend-to-class(.)), @extent)
                                            else
                                                html:inline($config, ., ("tei-gap7", "text-critical", css:map-rend-to-class(.)), .)
                    case element(quote) return
                        (: Quotes in commentary :)
                        html:inline($config, ., ("tei-quote", css:map-rend-to-class(.)), ('«', ., '»'))
                    case element(row) return
                        if (@role='label') then
                            html:row($config, ., ("tei-row1", css:map-rend-to-class(.)), .)
                        else
                            (: Insert table row. :)
                            html:row($config, ., ("tei-row2", css:map-rend-to-class(.)), .)
                    case element(docAuthor) return
                        html:inline($config, ., ("tei-docAuthor", css:map-rend-to-class(.)), .)
                    case element(byline) return
                        html:block($config, ., ("tei-byline", css:map-rend-to-class(.)), .)
                    case element(summary) return
                        html:block($config, ., ("tei-summary", css:map-rend-to-class(.)), .)
                    case element(origDate) return
                        if ($parameters?header='short') then
                            (: Called to output the sigle of a document :)
                            html:inline($config, ., ("tei-origDate1", css:map-rend-to-class(.)), ec:print-date(.))
                        else
                            if (parent::origin and text()) then
                                (: Ausgabe in "Stückbeschreibung" :)
                                html:listItem($config, ., ("tei-origDate2", css:map-rend-to-class(.)), (ec:label('origDate'), ec:colon(), ec:print-date(.), ' (', ., ')'), ())
                            else
                                if (parent::origin) then
                                    (: Ausgabe in "Stückbeschreibung" :)
                                    html:listItem($config, ., ("tei-origDate3", css:map-rend-to-class(.)), (ec:label('origDate'), ec:colon(), ec:print-date(.)), ())
                                else
                                    if (@calendar and @from and @to and ancestor::body and not(ancestor::note)) then
                                        html:alternate($config, ., ("tei-origDate4", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@from), ' – ', ec:format-date(@to), ' (', ec:translate(@calendar, 0, ()), ')'), map {})
                                    else
                                        if (@calendar) then
                                            html:alternate($config, ., ("tei-origDate5", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@when), ' (', ec:translate(@calendar, 0, ()), ')'), map {})
                                        else
                                            if (@from and @to and ancestor::body and not(ancestor::note)) then
                                                html:alternate($config, ., ("tei-origDate6", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@from), ' – ', ec:format-date(@to)), map {})
                                            else
                                                html:alternate($config, ., ("tei-origDate7", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@when)), map {})
                    case element(addSpan) return
                        if (parent::subst) then
                            html:inline($config, ., ("tei-addSpan1", css:map-rend-to-class(.)), .)
                        else
                            (: with @hand: just show footnote :)
                            ext-html:note($config, ., ("tei-addSpan2", css:map-rend-to-class(.)), (ec:label('add'), ' ', string-join((ec:translate(@place, 0, ()), ec:translate(@hand, 0, 'lowercase'), ec:translate(@rend, 0, 'lowercase')), ' '), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()), "footnote", (), 'text-critical-start', map {})
                    case element(delSpan) return
                        if (not(@rend)) then
                            ext-html:note($config, ., ("tei-delSpan1", css:map-rend-to-class(.)), ec:label('del'), (), (), 'text-critical-start', map {})
                        else
                            ext-html:note($config, ., ("tei-delSpan2", css:map-rend-to-class(.)), (ec:translate(@rend, 0, 'uppercase'), if (@hand) then (' ', ec:translate(@hand, 0, 'lowercase')) else ()), (), (), 'text-critical-start', map {})
                    case element(damage) return
                        if (gap) then
                            ext-html:alternote($config, ., ("tei-damage1", "text-critical", css:map-rend-to-class(.)), '[...]', (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ' (', gap/@quantity, ' ', ec:translate(gap/@unit, gap/@quantity, ()), ')'), map {"place": "footnote"})
                        else
                            if (unclear) then
                                ext-html:alternote($config, ., ("tei-damage2", "text-critical", css:map-rend-to-class(.)), unclear/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('unclear-rdg', false())), map {"place": "footnote"})
                            else
                                if (supplied/@source) then
                                    ext-html:alternote($config, ., ("tei-damage3", "text-critical", css:map-rend-to-class(.)), supplied/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('supplied-after', false()), ' ', supplied/@source), map {"place": "footnote"})
                                else
                                    if (supplied) then
                                        ext-html:alternote($config, ., ("tei-damage4", "text-critical", css:map-rend-to-class(.)), supplied/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('supplied', false())), map {"place": "footnote"})
                                    else
                                        if (add) then
                                            ext-html:alternote($config, ., ("tei-damage5", "text-critical", css:map-rend-to-class(.)), add/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:span((ec:label('add'), ' ', string-join((ec:translate(add/@place, 0, 'lowercase'), ec:translate(add/@hand, 0, 'lowercase'), ec:translate(add/@rend, 0, 'lowercase'), ec:translate(add/@type, 0, 'lowercase')), ' ')))), map {"place": "footnote"})
                                        else
                                            if (@agent) then
                                                ext-html:alternote($config, ., ("tei-damage6", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ())), map {"place": "footnote"})
                                            else
                                                $config?apply($config, ./node())
                    case element(damageSpan) return
                        if (@agent) then
                            ext-html:note($config, ., ("tei-damageSpan1", css:map-rend-to-class(.)), (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ())), "footnote", (), 'text-critical-start', map {})
                        else
                            html:omit($config, ., ("tei-damageSpan2", css:map-rend-to-class(.)), .)
                    case element(app) return
                        if (empty(rdg/node())) then
                            (: app with empty reading :)
                            ext-html:alternote($config, ., ("tei-app1", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', (ec:label('omitted-in'), ' ', rdg/@wit), map {})
                        else
                            if (empty(lem/node())) then
                                (: app with empty lemma :)
                                ext-html:alternote($config, ., ("tei-app2", "text-critical", css:map-rend-to-class(.)), '', (), 'text-critical', rdg, map {"prefix": (ec:label('alt-rdg-in'), ' ', rdg/@wit, ec:colon())})
                            else
                                if (lem/unclear) then
                                    ext-html:alternote($config, ., ("tei-app3", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg, map {"prefix": (ec:label('unclear-rdg'), ', ', ec:label('alt-rdg-in', false()), ' ', rdg/@wit, ec:colon())})
                                else
                                    if (rdg/unclear) then
                                        ext-html:alternote($config, ., ("tei-app4", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg, map {"prefix": (ec:label('alt-rdg-in'), ' ', rdg/@wit, ', ', ec:label('unclear-rdg', false()), ec:colon())})
                                    else
                                        if (rdg[2]) then
                                            ext-html:alternote($config, ., ("tei-app5", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', (ec:label('alt-rdg-in'), ' ', rdg[1]/@wit, ec:colon(), rdg[1], '. ', ec:label('alt-rdg-in'), ' ', rdg[2]/@wit, ec:colon(), rdg[2]), map {})
                                        else
                                            ext-html:alternote($config, ., ("tei-app6", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg, map {"prefix": (ec:label('alt-rdg-in'), ' ', rdg/@wit, ec:colon())})
                    case element(lem) return
                        html:inline($config, ., ("tei-lem", css:map-rend-to-class(.)), .)
                    case element(rdg) return
                        if (../gap) then
                            (: app with gap and reading :)
                            html:inline($config, ., ("tei-rdg", css:map-rend-to-class(.)), (ec:label('unreadable'), ', ', ec:label('supplied-after', false()), ' ', @wit))
                        else
                            $config?apply($config, ./node())
                    case element(handShift) return
                        ext-html:note($config, ., ("tei-handShift", css:map-rend-to-class(.)), (ec:label('handswitch'), if (@scribe) then (ec:colon(), ec:scribe(@scribe)) else ()), 'footnote', (), 'text-critical', map {})
                    case element(space) return
                        ext-html:alternote($config, ., ("tei-space", "text-critical", css:map-rend-to-class(.)), text{'...'}, (), 'text-critical', (ec:label('gap-in-orig'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'), map {})
                    case element(term) return
                        if (@ref) then
                            (: Semantic highlighting of keywords and lemmata with dark-red text color :)
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @ref,
                                    "label": ec:label('term'),
                                    "value": let $id := replace(@ref, ' ', '-') let $target:= id($id, doc("/db/apps/zszh-data/taxonomy/taxonomy.xml")) let $letter := substring($id, 1, 1) => upper-case() return     if ($target) then ( <a href="https://www.ssrq-sds-fds.ch/lemma-db-edit/views/view-keyword.xq?id={$id}" target="_blank">{$target/desc/string()}</a>, if ($target/gloss) then( <span> ({$target/gloss/string()} )</span>) else () ) else (<a href="https://www.ssrq-sds-fds.ch/persons-db-edit/?query={$id}" target="_blank">{$id}</a>)
                                }

                                                        let $content := 
                                model:template-term($config, ., $params)
                            return
                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-term", "semantic", "term", css:map-rend-to-class(.)), $content)
                        else
                            $config?apply($config, ./node())
                    case element(persName) return
                        if (parent::respStmt and ../preceding-sibling::respStmt) then
                            html:inline($config, ., ("tei-persName1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::respStmt) then
                                html:inline($config, ., ("tei-persName2", css:map-rend-to-class(.)), .)
                            else
                                if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/person/person.xml"))) then
                                    let $params := 
                                        map {
                                            "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/person/person.xml")),
                                            "default": .,
                                            "ref": @ref,
                                            "content": .
                                        }

                                                                        let $content := 
                                        model:template-persName3($config, ., $params)
                                    return
                                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-persName3", "semantic", "person", css:map-rend-to-class(.)), $content)
                                else
                                    if (@ref) then
                                        ext-html:link($config, ., ("tei-persName4", "semantic", "person", css:map-rend-to-class(.)), ., (), ())
                                    else
                                        $config?apply($config, ./node())
                    (: Semantic highlighting of organization names with tooltip and blue text color :)
                    case element(orgName) return
                        if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/organization/organization.xml"))) then
                            let $params := 
                                map {
                                    "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/organization/organization.xml")),
                                    "default": .,
                                    "ref": @ref,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-orgName($config, ., $params)
                            return
                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-orgName1", "semantic", "person", css:map-rend-to-class(.)), $content)
                        else
                            if (@ref) then
                                ext-html:link($config, ., ("tei-orgName2", "semantic", "organization", css:map-rend-to-class(.)), ., (), ())
                            else
                                $config?apply($config, ./node())
                    case element(placeName) return
                        if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/place/place.xml"))) then
                            let $params := 
                                map {
                                    "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/zszh-data/place/place.xml")),
                                    "default": .,
                                    "ref": @ref,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-placeName($config, ., $params)
                            return
                                                        html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-placeName1", "semantic", "place", css:map-rend-to-class(.)), $content)
                        else
                            if (@ref) then
                                ext-html:link($config, ., ("tei-placeName2", "semantic", "place", css:map-rend-to-class(.)), ., (), ())
                            else
                                $config?apply($config, ./node())
                    case element(origPlace) return
                        if (parent::origin and node()) then
                            html:listItem($config, ., ("tei-origPlace1", css:map-rend-to-class(.)), (ec:label('origPlace'), ec:colon(), .), ())
                        else
                            if (parent::origin) then
                                (: Leeres Element im header :)
                                html:omit($config, ., ("tei-origPlace2", css:map-rend-to-class(.)), .)
                            else
                                (: More than one model without predicate found for ident origPlace. Choosing first one. :)
                                (: Semantic highlighting of origPlace names with tooltip and green text color :)
                                let $params := 
                                    map {
                                        "content": .,
                                        "label": ec:label('origPlace'),
                                        "ref": @ref
                                    }

                                                                let $content := 
                                    model:template-origPlace3($config, ., $params)
                                return
                                                                html:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-origPlace3", "semantic", "place", css:map-rend-to-class(.)), $content)
                    (: Stückbeschreibung ausgeben :)
                    case element(msDesc) return
                        html:list($config, ., ("tei-msDesc", css:map-rend-to-class(.)), (msIdentifier,history/origin/origDate,msContents/msItem/filiation[@type='current'], physDesc/objectDesc/supportDesc/condition, physDesc/objectDesc/supportDesc, physDesc, msContents/msItem/textLang, msContents/msItem/docImprint, msContents/msItem/author[@role="scribe"], additional), ())
                    case element(msIdentifier) return
                        (
                            html:listItem($config, ., ("tei-msIdentifier1", css:map-rend-to-class(.)), idno, ()),
                            if (exists(altIdentifier)) then
                                html:listItem($config, ., ("tei-msIdentifier2", css:map-rend-to-class(.)), altIdentifier/idno, ())
                            else
                                ()
                        )

                    case element(msItem) return
                        html:listItem($config, ., ("tei-msItem", css:map-rend-to-class(.)), filiation[@type='current'], ())
                    case element(idno) return
                        if (parent::altIdentifier) then
                            html:inline($config, ., ("tei-idno1", css:map-rend-to-class(.)), (ec:label('signatureAlt'), ec:colon(), .))
                        else
                            if (@source) then
                                ext-html:link($config, ., ("tei-idno2", css:map-rend-to-class(.)), (ec:label('signature'), ec:colon(), .), @source, '_new')
                            else
                                html:inline($config, ., ("tei-idno3", css:map-rend-to-class(.)), (ec:label('signature'), ec:colon(), .))
                    case element(filiation) return
                        if (text() and origDate) then
                            html:inline($config, ., ("tei-filiation1", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), normalize-space(text()[1]), ', ', ec:print-date(origDate)))
                        else
                            if (text() and $parameters?view='metadata') then
                                html:listItem($config, ., ("tei-filiation2", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), text()[1]), ())
                            else
                                if (text()) then
                                    html:inline($config, ., ("tei-filiation3", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), text()[1]))
                                else
                                    html:omit($config, ., ("tei-filiation4", css:map-rend-to-class(.)), .)
                    case element(condition) return
                        html:listItem($config, ., ("tei-condition", css:map-rend-to-class(.)), (ec:label('condition'), ec:colon(), .), ())
                    case element(physDesc) return
                        if (exists(sealDesc)) then
                            html:listItem($config, ., ("tei-physDesc1", css:map-rend-to-class(.)), sealDesc, ())
                        else
                            if (not(exists(sealDesc))) then
                                html:omit($config, ., ("tei-physDesc2", css:map-rend-to-class(.)), .)
                            else
                                $config?apply($config, ./node())
                    case element(supportDesc) return
                        (
                            html:listItem($config, ., ("tei-supportDesc1", css:map-rend-to-class(.)), support/material, ()),
                            html:listItem($config, ., ("tei-supportDesc2", css:map-rend-to-class(.)), extent/dimensions, ())
                        )

                    case element(material) return
                        if (node() or @*) then
                            html:inline($config, ., ("tei-material", css:map-rend-to-class(.)), (ec:label('surface'), ec:colon(), .))
                        else
                            $config?apply($config, ./node())
                    case element(dimensions) return
                        if (@type = 'leaves' and (width/@quantity > 0 or height/@quantity > 0)) then
                            html:inline($config, ., ("tei-dimensions1", css:map-rend-to-class(.)), (ec:label('format'), ' (cm)', ec:colon(), string-join((width/@quantity,height/@quantity), ' × ') ))
                        else
                            if (@type = 'plica' and width/@quantity > 0) then
                                html:inline($config, ., ("tei-dimensions2", css:map-rend-to-class(.)), ' (Plica' || ec:colon() || width/@quantity || ' cm)')
                            else
                                $config?apply($config, ./node())
                    case element(sealDesc) return
                        if (seal) then
                            (
                                html:inline($config, ., ("tei-sealDesc1", css:map-rend-to-class(.)), (count(seal), ' ', ec:label('sigle', false(), count(seal)), ec:colon())),
                                html:list($config, ., ("tei-sealDesc2", css:map-rend-to-class(.)), ., 'ordered')
                            )

                        else
                            if (not(seal)) then
                                (: sealDesc in "weitere Überlieferungen" :)
                                html:listItem($config, ., ("tei-sealDesc3", css:map-rend-to-class(.)), (ec:label('sigle'), ec:colon(), .), ())
                            else
                                html:omit($config, ., ("tei-sealDesc4", css:map-rend-to-class(.)), .)
                    case element(seal) return
                        html:listItem($config, ., ("tei-seal", css:map-rend-to-class(.)), (persName|orgName, if ((persName|orgName)/text()) then ', ' else (), string-join((@nontei:material,@nontei:shape,@nontei:extent,@nontei:attachment,@nontei:condition) ! ec:translate(., 0, ()), ', ')), ())
                    case element(additional) return
                        html:heading($config, ., ("tei-additional", css:map-rend-to-class(.)), ., ())
                    case element(textLang) return
                        (: Ausgabe Sprache in "weitere Überlieferungen" :)
                        html:listItem($config, ., ("tei-textLang", css:map-rend-to-class(.)), (ec:label('language'), ec:colon(), string-join(for $lang in tokenize(., ', *') return ec:label($lang, false()), ', ')), ())
                    case element(person) return
                        if ($parameters?header='context') then
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @xml:id,
                                    "value": ( <a href="../people/all/{./persName[@type='full_sorted']/string()}?key={@xml:id}" target="_blank">{./persName[@type='full_sorted']/string()}</a>, if (string-length(./note) > 0) then( <span> ({./note/string()})</span>) else () )
                                }

                                                        let $content := 
                                model:template-person($config, ., $params)
                            return
                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-person1", css:map-rend-to-class(.)), $content)
                        else
                            (
                                html:inline($config, ., ("tei-person2", css:map-rend-to-class(.)), (ec:label('person'), ' ')),
                                ext-html:link($config, ., ("tei-person3", css:map-rend-to-class(.)), persName[@type='full_sorted']/string(), '../people/all/' || persName[@type='full_sorted']/string() || '?key=' || @xml:id, '_new')
                            )

                    case element(place) return
                        if ($parameters?header='context') then
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @xml:id,
                                    "value": (<a href="../places/all/{placeName[@type="main"]/string()}?key={@xml:id}">{placeName[@type="main"]/string()}</a>, <span>{" " || placeName[@type="add"]/string()}</span>)
                                }

                                                        let $content := 
                                model:template-place($config, ., $params)
                            return
                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-place1", css:map-rend-to-class(.)), $content)
                        else
                            (
                                html:inline($config, ., ("tei-place2", css:map-rend-to-class(.)), (ec:label('place'), ' ')),
                                ext-html:link($config, ., ("tei-place3", css:map-rend-to-class(.)), placeName[@type="main"]/string(), '../places/all/' || placeName[@type="main"]/string() || '?key=' || @xml:id, '_new'),
                                html:inline($config, ., ("tei-place4", css:map-rend-to-class(.)), " " || placeName[@type="add"]/string())
                            )

                    case element(org) return
                        if ($parameters?header='context') then
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @xml:id,
                                    "value": (<a href="../organization/all/{./orgName/string()}?key={@xml:id}" target="_blank">{orgName/string()}</a>, if (@type) then( <span> ({@type/string()})</span>) else ())
                                }

                                                        let $content := 
                                model:template-org($config, ., $params)
                            return
                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-org1", css:map-rend-to-class(.)), $content)
                        else
                            (
                                html:inline($config, ., ("tei-org2", css:map-rend-to-class(.)), (ec:label('organisation'), ' ')),
                                ext-html:link($config, ., ("tei-org3", css:map-rend-to-class(.)), orgName/string(), '../organization/all/' || orgName/string() || '?key=' || @xml:id, '_new'),
                                html:inline($config, ., ("tei-org4", css:map-rend-to-class(.)), " " || @type/string())
                            )

                    case element(category) return
                        if ($parameters?header='context') then
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @xml:id,
                                    "value": (<a href="https://www.ssrq-sds-fds.ch/lemma-db-edit/views/view-keyword.xq?id={@xml:id}" target="_blank">{desc/string()}</a>, if(gloss) then(<span> ({gloss/string()})</span>) else ())
                                }

                                                        let $content := 
                                model:template-category($config, ., $params)
                            return
                                                        html:pass-through(map:merge(($config, map:entry("template", true()))), ., ("tei-category", css:map-rend-to-class(.)), $content)
                        else
                            $config?apply($config, ./node())
                    case element(exist:match) return
                        html:match($config, ., .)
                    case element() return
                        if (namespace-uri(.) = 'http://www.tei-c.org/ns/1.0') then
                            $config?apply($config, ./node())
                        else
                            .
                    case text() | xs:anyAtomicType return
                        ext-html:content($config, ., ("tei--text", css:map-rend-to-class(.)), .)
                    default return 
                        $config?apply($config, ./node())

        )

};

declare function model:apply-children($config as map(*), $node as element(), $content as item()*) {
        
    if ($config?template) then
        $content
    else
        $content ! (
            typeswitch(.)
                case element() return
                    if (. is $node) then
                        $config?apply($config, ./node())
                    else
                        $config?apply($config, .)
                default return
                    html:escapeChars(.)
        )
};

declare function model:source($parameters as map(*), $elem as element()) {
        
    let $id := $elem/@exist:id
    return
        if ($id and $parameters?root) then
            util:node-by-id($parameters?root, $id)
        else
            $elem
};

declare function model:process-annotation($html, $context as node()) {
        
    let $classRegex := analyze-string($html/@class, '\s?annotation-([^\s]+)\s?')
    return
        if ($classRegex//fn:match) then (
            if ($html/@data-type) then
                ()
            else
                attribute data-type { ($classRegex//fn:group)[1]/string() },
            if ($html/@data-annotation) then
                ()
            else
                attribute data-annotation {
                    map:merge($context/@* ! map:entry(node-name(.), ./string()))
                    => serialize(map { "method": "json" })
                }
        ) else
            ()
                    
};

declare function model:map($html, $context as node(), $trackIds as item()?) {
        
    if ($trackIds) then
        for $node in $html
        return
            typeswitch ($node)
                case document-node() | comment() | processing-instruction() return 
                    $node
                case element() return
                    if ($node/@class = ("footnote")) then
                        if (local-name($node) = 'pb-popover') then
                            ()
                        else
                            element { node-name($node) }{
                                $node/@*,
                                $node/*[@class="fn-number"],
                                model:map($node/*[@class="fn-content"], $context, $trackIds)
                            }
                    else
                        element { node-name($node) }{
                            attribute data-tei { util:node-id($context) },
                            $node/@*,
                            model:process-annotation($node, $context),
                            $node/node()
                        }
                default return
                    <pb-anchor data-tei="{ util:node-id($context) }">{$node}</pb-anchor>
    else
        $html
                    
};


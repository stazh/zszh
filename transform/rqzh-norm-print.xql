(:~

    Transformation module generated from TEI ODD extensions for processing models.
    ODD: /db/apps/rqzh2/resources/odd/rqzh-norm.odd
 :)
xquery version "3.1";

module namespace model="http://www.tei-c.org/pm/models/rqzh-norm/fo";

declare default element namespace "http://www.tei-c.org/ns/1.0";

declare namespace xhtml='http://www.w3.org/1999/xhtml';

declare namespace xi='http://www.w3.org/2001/XInclude';

declare namespace pb='http://teipublisher.com/1.0';

declare namespace nontei='http://ssrq-sds-fds.ch/ns/nonTEI';

import module namespace css="http://www.tei-c.org/tei-simple/xquery/css";

import module namespace fo="http://www.tei-c.org/tei-simple/xquery/functions/fo";

import module namespace ec="http://www.tei-c.org/tei-simple/xquery/functions/ssrq-common" at "xmldb:exist:///db/apps/rqzh2/modules/ext-common.xql";

import module namespace ext-fo="http://www.tei-c.org/tei-simple/xquery/ext-fo" at "xmldb:exist:///db/apps/rqzh2/modules/ext-fo.xql";

(: generated template function for element spec: org :)
declare %private function model:template-org($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
};
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
(: generated template function for element spec: category :)
declare %private function model:template-category($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
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
(: generated template function for element spec: place :)
declare %private function model:template-place($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
  <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
  <div>{$config?apply-children($config, $node, $params?value)}</div>
</li></t>/*
};
(: generated template function for element spec: orgName :)
declare %private function model:template-orgName($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?default)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?alternate)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: person :)
declare %private function model:template-person($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li data-ref="{$config?apply-children($config, $node, $params?ref)}">
        <paper-checkbox class="select-facet" title="i18n(highlight-facet)"/>
        <div>{$config?apply-children($config, $node, $params?value)}</div>
        </li></t>/*
};
(: generated template function for element spec: persName :)
declare %private function model:template-persName3($config as map(*), $node as node()*, $params as map(*)) {
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
(: generated template function for element spec: term :)
declare %private function model:template-term($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><pb-popover data-ref="{$config?apply-children($config, $node, $params?ref)}">
                                <span slot="default">{$config?apply-children($config, $node, $params?content)}</span>
                                <span slot="alternate">{$config?apply-children($config, $node, $params?label)} {$config?apply-children($config, $node, $params?value)}</span>
                            </pb-popover></t>/*
};
(: generated template function for element spec: bibl :)
declare %private function model:template-bibl($config as map(*), $node as node()*, $params as map(*)) {
    <t xmlns=""><li>
                                <a href="{$config?apply-children($config, $node, $params?url)}" target="_blank">{$config?apply-children($config, $node, $params?text)}</a>
                            </li></t>/*
};
(:~

    Main entry point for the transformation.
    
 :)
declare function model:transform($options as map(*), $input as node()*) {
        
    let $config :=
        map:merge(($options,
            map {
                "output": ["fo","print"],
                "odd": "/db/apps/rqzh2/resources/odd/rqzh-norm.odd",
                "apply": model:apply#2,
                "apply-children": model:apply-children#3
            }
        ))
    let $config := fo:init($config, $input)
    
    return (
        ec:prepare($config, $input),
    
        let $output := model:apply($config, $input)
        return
            $output
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
                    case element(handShift) return
                        fo:note($config, ., ("tei-handShift", css:map-rend-to-class(.)), (ec:label('handswitch'), if (@scribe) then (ec:colon(), ec:scribe(@scribe)) else ()), 'footnote', ())
                    case element(org) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            (
                                fo:inline($config, ., ("tei-org2", css:map-rend-to-class(.)), (ec:label('organisation'), ' ')),
                                fo:link($config, ., ("tei-org3", css:map-rend-to-class(.)), orgName/string(), (), map {"link": '../organization/all/' || orgName/string() || '?key=' || @xml:id, "target": '_new'}),
                                fo:inline($config, ., ("tei-org4", css:map-rend-to-class(.)), " " || @type/string())
                            )

                    case element(castItem) return
                        (: Insert item, rendered as described in parent list rendition. :)
                        fo:listItem($config, ., ("tei-castItem", css:map-rend-to-class(.)), ., ())
                    case element(msDesc) return
                        fo:list($config, ., ("tei-msDesc", css:map-rend-to-class(.)), (msIdentifier,history/origin/origDate,msContents/msItem/filiation[@type='current'], physDesc/objectDesc/supportDesc/condition, physDesc/objectDesc/supportDesc, physDesc, msContents/msItem/textLang, msContents/msItem/docImprint, msContents/msItem/author[@role="scribe"], additional), ())
                    case element(item) return
                        fo:listItem($config, ., ("tei-item", css:map-rend-to-class(.)), ., ())
                    case element(teiHeader) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            if ($parameters?mode='footer-prev') then
                                let $params := 
                                    map {
                                        "target":              let $idno := .//seriesStmt/idno                 let $col := substring-after(util:collection-name($idno), "/db/apps/rqzh-data/")                                          let $temp  := replace($idno, "^(.+?)_(\d{3}.*?)(?:_\d{1,2})?$", "$1 $2")                 let $parts := tokenize($temp)                 let $start := $parts[1]                                          let $id :=                      if (matches($parts[2], "^\d{8}")) then                         replace($parts[2], "_", "-")                     else if (matches($parts[2], "^\d{4}_\d{3}")) then                         number(substring-before($parts[2], "_")) || "-" || number(substring-after($parts[2], "_"))                                                  else if (count($parts) eq 1)                                                      then ()                                                  else                                                          number($parts[2])                 let $next := xs:string($id - 1)                 let $len := string-length($next)                 let $next-id :=                      if ($len > 2) then                          $next                      else                          substring("000", 1, 3 - $len) || $next                                          let $idn := $start || "_" || $next-id                 let $match := for $m in collection("/db/apps/rqzh-data")//idno[starts-with(., $idn)] order by $m return $m                                          let $link :=                      if (count($match)) then                          $col || "/" || substring-before(util:document-name(head($match)), '.xml')                     else ()                                           return replace($link, '^(.*)_1$', '$1'),
                                        "content": .
                                    }

                                                                let $content := 
                                    model:template-teiHeader2($config, ., $params)
                                return
                                                                fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader2", "footer", "button-prev", css:map-rend-to-class(.)), $content)
                            else
                                if ($parameters?mode='footer-next') then
                                    let $params := 
                                        map {
                                            "target": let $idno := .//seriesStmt/idno                          let $col := substring-after(util:collection-name($idno), "/db/apps/rqzh-data/")                          let $temp  := replace($idno, "^(.+?)_(\d{3}.*?)(?:_\d{1,2})?$", "$1 $2")                          let $parts := tokenize($temp)                          let $start := $parts[1]                          let $id    :=                             if (matches($parts[2], "^\d{8}")) then                                 replace($parts[2], "_", "-")                             else if (matches($parts[2], "^\d{4}_\d{3}")) then                                 number(substring-before($parts[2], "_")) || "-" || number(substring-after($parts[2], "_"))                             else if (count($parts) eq 1)                             then ()                             else                                 number($parts[2])                          let $next := xs:string($id + 1)                         let $len := string-length($next)                         let $next-id := if ($len > 2) then $next else substring("000", 1, 3 - $len) || $next                         let $idn := $start || "_" || $next-id                         let $match := for $m in collection("/db/apps/rqzh-data")//idno[starts-with(., $idn)] order by $m return $m                         let $link := if (count($match)) then $col || "/" || substring-before(util:document-name(head($match)), '.xml') else ()                          return replace($link, '^(.*)_1$', '$1'),
                                            "content": .
                                        }

                                                                        let $content := 
                                        model:template-teiHeader3($config, ., $params)
                                    return
                                                                        fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader3", "footer", "button-next", css:map-rend-to-class(.)), $content)
                                else
                                    if ($parameters?view='metadata') then
                                        (
                                            if (not(ends-with(util:document-name(.//sourceDesc), 'Introduction.xml'))) then
                                                fo:block($config, ., ("tei-teiHeader4", css:map-rend-to-class(.)), fileDesc)
                                            else
                                                (),
                                            fo:block($config, ., ("tei-teiHeader5", css:map-rend-to-class(.)), .//msDesc/head),
                                            (: No function found for behavior: output-date :)
                                            $config?apply($config, ./node()),
                                            if (exists(.//msContents/summary/node())) then
                                                let $params := 
                                                    map {
                                                        "content": .//msContents/summary
                                                    }

                                                                                                let $content := 
                                                    model:template-teiHeader7($config, ., $params)
                                                return
                                                                                                fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader7", css:map-rend-to-class(.)), $content)
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
                                                                                                fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader8", css:map-rend-to-class(.)), $content)
                                            else
                                                (),
                                            if (root($parameters?root)/TEI[not(@type) or @type != 'introduction'] and ec:existsAdditionalSource(.//fileDesc/seriesStmt/idno/text())) then
                                                let $params := 
                                                    map {
                                                        "content": ec:additionalSource(.//fileDesc/seriesStmt/idno/text())
                                                    }

                                                                                                let $content := 
                                                    model:template-teiHeader9($config, ., $params)
                                                return
                                                                                                fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-teiHeader9", css:map-rend-to-class(.)), $content)
                                            else
                                                ()
                                        )

                                    else
                                        fo:omit($config, ., ("tei-teiHeader10", css:map-rend-to-class(.)), .)
                    case element(figure) return
                        fo:inline($config, ., ("tei-figure", css:map-rend-to-class(.)), ec:translate(@type, 0, 'uppercase'))
                    case element(supplied) return
                        if (parent::choice) then
                            fo:inline($config, ., ("tei-supplied1", css:map-rend-to-class(.)), .)
                        else
                            if (@source and @reason) then
                                ext-fo:alternote($config, ., ("tei-supplied2", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:translate(@reason, 0, 'uppercase'), ', ', ec:label('supplied-after', false()), ' ', @source))
                            else
                                if (@source) then
                                    ext-fo:alternote($config, ., ("tei-supplied3", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:label('supplied-after'), ' ', @source))
                                else
                                    if (@reason) then
                                        ext-fo:alternote($config, ., ("tei-supplied4", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', (ec:translate(@reason, 0, 'uppercase'), ', ', ec:label('supplied', false())))
                                    else
                                        if (@resp) then
                                            ext-fo:alternote($config, ., ("tei-supplied5", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'), (), 'text-critical', ec:label('supplied'))
                                        else
                                            fo:inline($config, ., ("tei-supplied6", "text-critical", css:map-rend-to-class(.)), ('[', ., ']'))
                    case element(idno) return
                        if (parent::altIdentifier) then
                            fo:inline($config, ., ("tei-idno1", css:map-rend-to-class(.)), (ec:label('signatureAlt'), ec:colon(), .))
                        else
                            if (@source) then
                                fo:link($config, ., ("tei-idno2", css:map-rend-to-class(.)), (ec:label('signature'), ec:colon(), .), (), map {"link": @source, "target": '_new'})
                            else
                                fo:inline($config, ., ("tei-idno3", css:map-rend-to-class(.)), (ec:label('signature'), ec:colon(), .))
                    case element(milestone) return
                        fo:inline($config, ., ("tei-milestone", css:map-rend-to-class(.)), .)
                    case element(label) return
                        if (@type='keyword') then
                            ext-fo:alternote($config, ., ("tei-label1", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:label('marginal-note'), ' ', ec:translate(@place, 0, 'lowercase'), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()))
                        else
                            fo:paragraph($config, ., ("tei-label2", css:map-rend-to-class(.)), .)
                    case element(ptr) return
                        if (parent::notatedMusic) then
                            (: No function found for behavior: webcomponent :)
                            $config?apply($config, ./node())
                        else
                            $config?apply($config, ./node())
                    case element(signed) return
                        fo:block($config, ., ("tei-signed", css:map-rend-to-class(.)), ('[', ec:label('signed'), ec:punct(':', false()), '] ', .))
                    case element(pb) return
                        if (following-sibling::node()[1][self::lb]) then
                            (: If followed by an lb, process the lb first, then the pb :)
                            ext-fo:copy($config, ., ("tei-pb1", css:map-rend-to-class(.)), (following-sibling::lb[1], $node))
                        else
                            $config?apply($config, ./node())
                    case element(pc) return
                        fo:inline($config, ., ("tei-pc", css:map-rend-to-class(.)), .)
                    case element(TEI) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            if ($parameters?view='metadata') then
                                (
                                    fo:block($config, ., ("tei-TEI2", "document-heading", css:map-rend-to-class(.)), teiHeader),
                                    fo:block($config, ., ("tei-TEI3", css:map-rend-to-class(.)), text//back)
                                )

                            else
                                fo:document($config, ., ("tei-TEI4", css:map-rend-to-class(.)), .)
                    case element(anchor) return
                        if (exists(root($parameters?root)//*[@spanTo = '#' || $node/@xml:id])) then
                            ext-fo:notespan-end($config, ., ("tei-anchor1", css:map-rend-to-class(.)), root($parameters?root)//*[@spanTo = '#' || $node/@xml:id])
                        else
                            fo:anchor($config, ., ("tei-anchor2", css:map-rend-to-class(.)), ., @xml:id)
                    case element(physDesc) return
                        if (exists(sealDesc)) then
                            fo:listItem($config, ., ("tei-physDesc1", css:map-rend-to-class(.)), sealDesc, ())
                        else
                            if (not(exists(sealDesc))) then
                                fo:omit($config, ., ("tei-physDesc2", css:map-rend-to-class(.)), .)
                            else
                                $config?apply($config, ./node())
                    case element(formula) return
                        if (@rendition='simple:display') then
                            fo:block($config, ., ("tei-formula1", css:map-rend-to-class(.)), .)
                        else
                            if (@rend='display') then
                                (: No function found for behavior: webcomponent :)
                                $config?apply($config, ./node())
                            else
                                (: No function found for behavior: webcomponent :)
                                $config?apply($config, ./node())
                    case element(choice) return
                        if (sic/del and corr) then
                            ext-fo:alternote($config, ., ("tei-choice4", "text-critical", css:map-rend-to-class(.)), corr, (), 'text-critical', (ec:label('corrected-from'), ec:colon(), normalize-space(string-join(sic//text())), ', ', ec:translate(sic/del/@rend, 0, 'uppercase'), ec:colon(), sic/del//text()))
                        else
                            if (sic and corr) then
                                ext-fo:alternote($config, ., ("tei-choice5", "text-critical", css:map-rend-to-class(.)), corr, (), 'text-critical', (ec:label('corrected-from'), ec:colon(), sic))
                            else
                                if (abbr and expan) then
                                    ext-fo:alternate($config, ., ("tei-choice6", "text-critical", css:map-rend-to-class(.)), ., expan[1], (ec:label('abbr-nonexpanded'), ec:colon(), abbr[1]))
                                else
                                    if (orig and reg) then
                                        ext-fo:alternate($config, ., ("tei-choice7", "text-critical", css:map-rend-to-class(.)), ., reg[1], orig[1])
                                    else
                                        $config?apply($config, ./node())
                    case element(category) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            $config?apply($config, ./node())
                    case element(hi) return
                        if (@rend='sup') then
                            fo:inline($config, ., ("tei-hi1", css:map-rend-to-class(.)), .)
                        else
                            if (@rend!='sup' and @hand) then
                                ext-fo:alternote($config, ., ("tei-hi2", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:translate(@rend), ' ', ec:translate(@hand, 0, 'lowercase')))
                            else
                                if (@rend!='sup') then
                                    ext-fo:alternate($config, ., ("tei-hi3", "text-critical", css:map-rend-to-class(.)), ., ., ec:translate(@rend))
                                else
                                    $config?apply($config, ./node())
                    case element(note) return
                        if (@place) then
                            fo:note($config, ., ("tei-note1", css:map-rend-to-class(.)), ., @place, @n)
                        else
                            fo:note($config, ., ("tei-note2", css:map-rend-to-class(.)), ., (), ())
                    case element(code) return
                        fo:inline($config, ., ("tei-code", css:map-rend-to-class(.)), .)
                    case element(addSpan) return
                        if (parent::subst) then
                            fo:inline($config, ., ("tei-addSpan1", css:map-rend-to-class(.)), .)
                        else
                            (: with @hand: just show footnote :)
                            fo:note($config, ., ("tei-addSpan2", css:map-rend-to-class(.)), (ec:label('add'), ' ', string-join((ec:translate(@place, 0, ()), ec:translate(@hand, 0, 'lowercase'), ec:translate(@rend, 0, 'lowercase')), ' '), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()), "footnote", ())
                    case element(dateline) return
                        fo:block($config, ., ("tei-dateline", css:map-rend-to-class(.)), .)
                    case element(back) return
                        if ($parameters?view='metadata' and exists(./div/p/node())) then
                            let $params := 
                                map {
                                    "content": div
                                }

                                                        let $content := 
                                model:template-back($config, ., $params)
                            return
                                                        fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-back1", css:map-rend-to-class(.)), $content)
                        else
                            if (div/@n) then
                                fo:list($config, ., ("tei-back2", css:map-rend-to-class(.)), ., 'ordered')
                            else
                                fo:block($config, ., ("tei-back3", css:map-rend-to-class(.)), .)
                    case element(seal) return
                        fo:listItem($config, ., ("tei-seal", css:map-rend-to-class(.)), (persName|orgName, if ((persName|orgName)/text()) then ', ' else (), string-join((@nontei:material,@nontei:shape,@nontei:extent,@nontei:attachment,@nontei:condition) ! ec:translate(., 0, ()), ', ')), ())
                    case element(del) return
                        if (ancestor::back//orig) then
                            fo:omit($config, ., ("tei-del1", css:map-rend-to-class(.)), .)
                        else
                            if (add/@type='catchword') then
                                fo:note($config, ., ("tei-del2", css:map-rend-to-class(.)), ., (), ())
                            else
                                if (@hand='later hand' and not(parent::subst)) then
                                    (: Show text of del with popup and footnote :)
                                    ext-fo:alternote($config, ., ("tei-del3", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (if (@rend) then (ec:translate(@rend, 0, 'uppercase')) else (ec:label('del')), ' ', ec:translate(@hand, 0, 'lowercase')))
                                else
                                    if (add) then
                                        fo:note($config, ., ("tei-del4", css:map-rend-to-class(.)), ., (), ())
                                    else
                                        if (parent::subst) then
                                            fo:inline($config, ., ("tei-del5", css:map-rend-to-class(.)), .)
                                        else
                                            if (gap) then
                                                ext-fo:alternote($config, ., ("tei-del6", css:map-rend-to-class(.)), '', (), 'text-critical', (ec:label('del-gap'), ' (', gap/@quantity, ' ', ec:translate(gap/@unit, gap/@quantity, ()), ')'))
                                            else
                                                if (unclear and @rend) then
                                                    fo:note($config, ., ("tei-del7", css:map-rend-to-class(.)), ., "footnote", ())
                                                else
                                                    if (unclear) then
                                                        fo:note($config, ., ("tei-del8", css:map-rend-to-class(.)), ., "footnote", ())
                                                    else
                                                        if (@rend) then
                                                            (: Show footnote only :)
                                                            fo:note($config, ., ("tei-del9", css:map-rend-to-class(.)), ., (), ())
                                                        else
                                                            if (@hand) then
                                                                (: Show footnote only :)
                                                                fo:note($config, ., ("tei-del10", css:map-rend-to-class(.)), ., (), ())
                                                            else
                                                                (: Show footnote only :)
                                                                fo:note($config, ., ("tei-del11", css:map-rend-to-class(.)), ., (), ())
                    case element(trailer) return
                        fo:block($config, ., ("tei-trailer", css:map-rend-to-class(.)), .)
                    case element(lem) return
                        fo:inline($config, ., ("tei-lem", css:map-rend-to-class(.)), .)
                    case element(titlePart) return
                        fo:block($config, ., css:get-rendition(., ("tei-titlePart", css:map-rend-to-class(.))), .)
                    case element(ab) return
                        if (@place) then
                            fo:block($config, ., ("tei-ab1", "ab", css:map-rend-to-class(.)), ('[', string-join((ec:translate(@type, 0, 'lowercase'),ec:translate(@place, 0, 'lowercase'),ec:translate(@hand, 0, 'lowercase')), ' '), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else (), ec:punct(':', false()), '] ', .))
                        else
                            fo:paragraph($config, ., ("tei-ab2", css:map-rend-to-class(.)), .)
                    case element(app) return
                        if (empty(rdg/node())) then
                            (: app with empty reading :)
                            ext-fo:alternote($config, ., ("tei-app1", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', (ec:label('omitted-in'), ' ', rdg/@wit))
                        else
                            if (empty(lem/node())) then
                                (: app with empty lemma :)
                                ext-fo:alternote($config, ., ("tei-app2", "text-critical", css:map-rend-to-class(.)), '', (), 'text-critical', rdg)
                            else
                                if (lem/unclear) then
                                    ext-fo:alternote($config, ., ("tei-app3", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg)
                                else
                                    if (rdg/unclear) then
                                        ext-fo:alternote($config, ., ("tei-app4", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg)
                                    else
                                        if (rdg[2]) then
                                            ext-fo:alternote($config, ., ("tei-app5", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', (ec:label('alt-rdg-in'), ' ', rdg[1]/@wit, ec:colon(), rdg[1], '. ', ec:label('alt-rdg-in'), ' ', rdg[2]/@wit, ec:colon(), rdg[2]))
                                        else
                                            ext-fo:alternote($config, ., ("tei-app6", "text-critical", css:map-rend-to-class(.)), lem, (), 'text-critical', rdg)
                    case element(revisionDesc) return
                        fo:omit($config, ., ("tei-revisionDesc", css:map-rend-to-class(.)), .)
                    case element(subst) return
                        if (ancestor::teiHeader) then
                            fo:inline($config, ., ("tei-subst1", css:map-rend-to-class(.)), add)
                        else
                            if (del/gap and add) then
                                ext-fo:alternote($config, ., ("tei-subst2", css:map-rend-to-class(.)), add, (), 'text-critical', (ec:label('corr'), ' ', ec:translate(add/@place, 0, 'lowercase'), ', ', ec:label('subst-del-gap', false())))
                            else
                                if (add[@hand='later hand'] and del[@hand='later hand']) then
                                    ext-fo:alternote($config, ., ("tei-subst3", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del)
                                else
                                    if (add/@hand) then
                                        ext-fo:alternote($config, ., ("tei-subst4", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del)
                                    else
                                        if (add) then
                                            ext-fo:alternote($config, ., ("tei-subst5", "text-critical", css:map-rend-to-class(.)), add, (), 'text-critical', del)
                                        else
                                            fo:inline($config, ., ("tei-subst6", css:map-rend-to-class(.)), .)
                    case element(am) return
                        fo:inline($config, ., ("tei-am", css:map-rend-to-class(.)), .)
                    case element(damageSpan) return
                        if (@agent) then
                            fo:note($config, ., ("tei-damageSpan1", css:map-rend-to-class(.)), (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ())), "footnote", ())
                        else
                            fo:omit($config, ., ("tei-damageSpan2", css:map-rend-to-class(.)), .)
                    case element(roleDesc) return
                        fo:block($config, ., ("tei-roleDesc", css:map-rend-to-class(.)), .)
                    case element(orig) return
                        fo:inline($config, ., ("tei-orig", css:map-rend-to-class(.)), ('«', ., '»'))
                    case element(opener) return
                        fo:block($config, ., ("tei-opener", css:map-rend-to-class(.)), .)
                    case element(speaker) return
                        fo:block($config, ., ("tei-speaker", css:map-rend-to-class(.)), .)
                    case element(dimensions) return
                        if (@type = 'leaves' and (width/@quantity > 0 or height/@quantity > 0)) then
                            fo:inline($config, ., ("tei-dimensions1", css:map-rend-to-class(.)), (ec:label('format'), ' (cm)', ec:colon(), string-join((width/@quantity,height/@quantity), ' × ') ))
                        else
                            if (@type = 'plica' and width/@quantity > 0) then
                                fo:inline($config, ., ("tei-dimensions2", css:map-rend-to-class(.)), ' (Plica' || ec:colon() || width/@quantity || ' cm)')
                            else
                                $config?apply($config, ./node())
                    case element(publisher) return
                        if (ancestor::teiHeader) then
                            (: Omit if located in teiHeader. :)
                            fo:omit($config, ., ("tei-publisher", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(imprimatur) return
                        fo:block($config, ., ("tei-imprimatur", css:map-rend-to-class(.)), .)
                    case element(rs) return
                        fo:inline($config, ., ("tei-rs", css:map-rend-to-class(.)), .)
                    case element(figDesc) return
                        fo:inline($config, ., ("tei-figDesc", css:map-rend-to-class(.)), .)
                    case element(foreign) return
                        if ((session:get-attribute('ssrq.lang'), 'de')[1]='fr') then
                            ext-fo:alternate($config, ., ("tei-foreign1", css:map-rend-to-class(.)), ., ., (ec:label('lang-switch'), ec:colon(), ' ', ec:label(@xml:lang, false())))
                        else
                            ext-fo:alternate($config, ., ("tei-foreign2", css:map-rend-to-class(.)), ., ., (ec:label('lang-switch'), ec:colon(), ' ', ec:label(@xml:lang, false())))
                    case element(fileDesc) return
                        if ($parameters?header='short' and ancestor::TEI[@type='introduction']) then
                            (
                                fo:block($config, ., ("tei-fileDesc1", "header-short", css:map-rend-to-class(.)), ec:format-id(seriesStmt/idno)),
                                fo:link($config, ., ("tei-fileDesc2", "header-short", "title", css:map-rend-to-class(.)),                              let $subtype := ancestor::TEI/@subtype                              return switch ($subtype)                                 case 'a' return 'Reihenvorwort'                                 case 'b' return 'Vorwort'                                 case 'c' return 'Einleitung'                                 case 'd' return 'Quellenverzeichnis'                                 default return 'Introduction'                                 , (), map {"link": $parameters?doc})
                            )

                        else
                            if ($parameters?header='short') then
                                (
                                    fo:block($config, ., ("tei-fileDesc3", "header-short", css:map-rend-to-class(.)), ec:format-id(seriesStmt/idno)),
                                    fo:link($config, ., ("tei-fileDesc4", "header-short", css:map-rend-to-class(.)), sourceDesc/msDesc/head, (), map {"link": $parameters?doc}),
                                    fo:block($config, ., ("tei-fileDesc5", "header-short", css:map-rend-to-class(.)), if (exists(sourceDesc/msDesc/msContents/msItem/filiation[@type='original'][origDate])) then                                      ec:print-date(sourceDesc/msDesc/msContents/msItem/filiation[@type='original']/origDate)                                     else if (exists(sourceDesc/msDesc/history/origin/origDate)) then                                     ec:print-date(sourceDesc/msDesc/history/origin/origDate)                                    else                                       ()),
                                    fo:block($config, ., ("tei-fileDesc6", "header-short", css:map-rend-to-class(.)), editionStmt),
                                    fo:block($config, ., ("tei-fileDesc7", "header-short", css:map-rend-to-class(.)), publicationStmt),
                                    fo:block($config, ., ("tei-fileDesc8", "header-short", css:map-rend-to-class(.)), titleStmt)
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
                                                                        fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc9", css:map-rend-to-class(.)), $content)
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
                                                                                fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc10", css:map-rend-to-class(.)), $content)
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
                                                    "link": 'https://rechtsquellen.sources-online.org/' || substring-after(util:collection-name(.), '/db/apps/rqzh-data/') || '/' || replace(seriesStmt/idno, '^(.*)_1$', '$1'),
                                                    "content": .
                                                }

                                                                                        let $content := 
                                                model:template-fileDesc11($config, ., $params)
                                            return
                                                                                        fo:block(map:merge(($config, map:entry("template", true()))), ., ("tei-fileDesc11", css:map-rend-to-class(.)), $content)
                                        else
                                            $config?apply($config, ./node())
                    case element(delSpan) return
                        if (not(@rend)) then
                            fo:note($config, ., ("tei-delSpan1", css:map-rend-to-class(.)), ec:label('del'), (), ())
                        else
                            fo:note($config, ., ("tei-delSpan2", css:map-rend-to-class(.)), (ec:translate(@rend, 0, 'uppercase'), if (@hand) then (' ', ec:translate(@hand, 0, 'lowercase')) else ()), (), ())
                    case element(seg) return
                        if (@n and not(p)) then
                            fo:block($config, ., ("tei-seg1", css:map-rend-to-class(.)), (text{'['}, @n, text{'] '}, .))
                        else
                            if (. is (ancestor::quote[1]/seg[1])) then
                                (: Force « on same line, cf. quote :)
                                fo:inline($config, ., ("tei-seg2", css:map-rend-to-class(.)), .)
                            else
                                if (. is (ancestor::quote[1]/seg[last()])) then
                                    (: Force » on same line, cf. quote :)
                                    fo:inline($config, ., ("tei-seg3", css:map-rend-to-class(.)), .)
                                else
                                    if (. is (ancestor::quote[1]/seg[last()-1])) then
                                        (: Add missing margin :)
                                        fo:block($config, ., ("tei-seg4", css:map-rend-to-class(.)), .)
                                    else
                                        fo:block($config, ., ("tei-seg5", css:map-rend-to-class(.)), .)
                    case element(notatedMusic) return
                        fo:figure($config, ., ("tei-notatedMusic", css:map-rend-to-class(.)), ptr, label)
                    case element(profileDesc) return
                        fo:omit($config, ., ("tei-profileDesc", css:map-rend-to-class(.)), .)
                    case element(email) return
                        fo:inline($config, ., ("tei-email", css:map-rend-to-class(.)), .)
                    case element(place) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            (
                                fo:inline($config, ., ("tei-place2", css:map-rend-to-class(.)), (ec:label('place'), ' ')),
                                fo:link($config, ., ("tei-place3", css:map-rend-to-class(.)), placeName[@type="main"]/string(), (), map {"link": '../places/all/' || placeName[@type="main"]/string() || '?key=' || @xml:id, "target": '_new'}),
                                fo:inline($config, ., ("tei-place4", css:map-rend-to-class(.)), " " || placeName[@type="add"]/string())
                            )

                    case element(floatingText) return
                        fo:block($config, ., ("tei-floatingText", css:map-rend-to-class(.)), .)
                    case element(text) return
                        fo:body($config, ., ("tei-text", css:map-rend-to-class(.)), .)
                    case element(sp) return
                        fo:block($config, ., ("tei-sp", css:map-rend-to-class(.)), .)
                    case element(table) return
                        fo:table($config, ., ("tei-table", css:map-rend-to-class(.)), .)
                    case element(abbr) return
                        if (parent::choice) then
                            fo:inline($config, ., ("tei-abbr1", css:map-rend-to-class(.)), .)
                        else
                            if (unclear) then
                                ext-fo:alternate($config, ., ("tei-abbr2", css:map-rend-to-class(.)), ., ., (ec:label('abbr-unclear'), ec:colon(), ec:abbr(.)))
                            else
                                ext-fo:alternate($config, ., ("tei-abbr3", css:map-rend-to-class(.)), ., ., (ec:label('abbr'), ec:colon(), ec:abbr(.)))
                    case element(group) return
                        fo:block($config, ., ("tei-group", css:map-rend-to-class(.)), .)
                    case element(cb) return
                        fo:break($config, ., ("tei-cb", css:map-rend-to-class(.)), ., 'column', @n)
                    case element(editor) return
                        if (ancestor::teiHeader) then
                            fo:omit($config, ., ("tei-editor1", css:map-rend-to-class(.)), .)
                        else
                            fo:inline($config, ., ("tei-editor2", css:map-rend-to-class(.)), .)
                    case element(licence) return
                        fo:omit($config, ., ("tei-licence2", css:map-rend-to-class(.)), .)
                    case element(orgName) return
                        if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/organization/organization.xml"))) then
                            let $params := 
                                map {
                                    "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/organization/organization.xml")),
                                    "default": .,
                                    "ref": @ref,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-orgName($config, ., $params)
                            return
                                                        fo:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-orgName1", "semantic", "person", css:map-rend-to-class(.)), $content)
                        else
                            if (@ref) then
                                fo:link($config, ., ("tei-orgName2", "semantic", "organization", css:map-rend-to-class(.)), ., 'https://www.ssrq-sds-fds.ch/persons-db-edit/?query=' || replace(@ref, ' ', '-'), map {})
                            else
                                $config?apply($config, ./node())
                    case element(listBibl) return
                        if (not($parameters?mode = 'filiation')) then
                            (
                                (: Titel des Bibliographieabschnitts :)
                                fo:heading($config, ., ("tei-listBibl1", css:map-rend-to-class(.)), head/node(), 5),
                                (: Liste der Bibliographieeinträge :)
                                fo:list($config, ., ("tei-listBibl2", css:map-rend-to-class(.)), bibl, ())
                            )

                        else
                            fo:omit($config, ., ("tei-listBibl3", css:map-rend-to-class(.)), .)
                    case element(c) return
                        fo:inline($config, ., ("tei-c", css:map-rend-to-class(.)), .)
                    case element(summary) return
                        fo:block($config, ., ("tei-summary", css:map-rend-to-class(.)), .)
                    case element(address) return
                        fo:block($config, ., ("tei-address", css:map-rend-to-class(.)), .)
                    case element(g) return
                        if (not(text())) then
                            fo:glyph($config, ., ("tei-g1", css:map-rend-to-class(.)), .)
                        else
                            fo:inline($config, ., ("tei-g2", css:map-rend-to-class(.)), .)
                    case element(author) return
                        (: Ausgabe des Schreibers im Header :)
                        fo:listItem($config, ., ("tei-author", css:map-rend-to-class(.)), (ec:label('scriptor'), ec:colon(), .), ())
                    case element(castList) return
                        if (child::*) then
                            fo:list($config, ., css:get-rendition(., ("tei-castList", css:map-rend-to-class(.))), castItem, ())
                        else
                            $config?apply($config, ./node())
                    case element(l) return
                        fo:block($config, ., css:get-rendition(., ("tei-l", css:map-rend-to-class(.))), .)
                    case element(closer) return
                        fo:block($config, ., ("tei-closer", css:map-rend-to-class(.)), .)
                    case element(rhyme) return
                        fo:inline($config, ., ("tei-rhyme", css:map-rend-to-class(.)), .)
                    case element(msItem) return
                        fo:listItem($config, ., ("tei-msItem", css:map-rend-to-class(.)), filiation[@type='current'], ())
                    case element(origDate) return
                        if ($parameters?header='short') then
                            (: Called to output the sigle of a document :)
                            fo:inline($config, ., ("tei-origDate1", css:map-rend-to-class(.)), ec:print-date(.))
                        else
                            if (parent::origin and text()) then
                                (: Ausgabe in "Stückbeschreibung" :)
                                fo:listItem($config, ., ("tei-origDate2", css:map-rend-to-class(.)), (ec:label('origDate'), ec:colon(), ec:print-date(.), ' (', ., ')'), ())
                            else
                                if (parent::origin) then
                                    (: Ausgabe in "Stückbeschreibung" :)
                                    fo:listItem($config, ., ("tei-origDate3", css:map-rend-to-class(.)), (ec:label('origDate'), ec:colon(), ec:print-date(.)), ())
                                else
                                    if (@calendar and @from and @to and ancestor::body and not(ancestor::note)) then
                                        ext-fo:alternate($config, ., ("tei-origDate4", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@from), ' – ', ec:format-date(@to), ' (', ec:translate(@calendar, 0, ()), ')'))
                                    else
                                        if (@calendar) then
                                            ext-fo:alternate($config, ., ("tei-origDate5", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@when), ' (', ec:translate(@calendar, 0, ()), ')'))
                                        else
                                            if (@from and @to and ancestor::body and not(ancestor::note)) then
                                                ext-fo:alternate($config, ., ("tei-origDate6", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@from), ' – ', ec:format-date(@to)))
                                            else
                                                ext-fo:alternate($config, ., ("tei-origDate7", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('origDate'), ec:colon(), ec:format-date(@when)))
                    case element(p) return
                        if (parent::seg[@n] and parent::seg/*[1] is .) then
                            (: Put seg numbering before the first p but on the same line :)
                            fo:paragraph($config, ., css:get-rendition(., ("tei-p1", css:map-rend-to-class(.))), ('[', parent::seg/@n, '] ', .))
                        else
                            if (parent::body/div and parent::div[@n]/*[1] is .) then
                                fo:paragraph($config, ., css:get-rendition(., ("tei-p2", css:map-rend-to-class(.))), ('[', parent::div/@n, '] ', .))
                            else
                                fo:paragraph($config, ., css:get-rendition(., ("tei-p3", css:map-rend-to-class(.))), .)
                    case element(list) return
                        if (@rendition) then
                            fo:list($config, ., css:get-rendition(., ("tei-list1", css:map-rend-to-class(.))), item, ())
                        else
                            if (not(@rendition)) then
                                fo:list($config, ., ("tei-list2", css:map-rend-to-class(.)), item, ())
                            else
                                $config?apply($config, ./node())
                    case element(q) return
                        fo:inline($config, ., ("tei-q", css:map-rend-to-class(.)), ('«', ., '»'))
                    case element(measure) return
                        if (ancestor::measureGrp and (session:get-attribute('ssrq.lang'), 'de')[1]!='de') then
                            (: Display summarized measures for a measure group in a tooltip (non German) :)
                            ext-fo:alternate($config, ., ("tei-measure1", "text-critical", css:map-rend-to-class(.)), ., ., let $measures := ancestor::measureGrp//measure  return (  ec:translate($measures[1]/@type, 0, 'uppercase'), ec:colon(),           for $measure in $measures     return     (' ', $measure/@quantity, ' ', ec:translate($measure/@unit, $measure/@quantity, 'lowercase'), ' ', ec:translate($measure/@commodity, 0, 'lowercase'), ' ', ec:translate($measure/@origin, 0, 'lowercase')) ))
                        else
                            if (ancestor::measureGrp and (session:get-attribute('ssrq.lang'), 'de')[1]='de') then
                                (: Display summarized measures for a measure group in a tooltip (German) :)
                                ext-fo:alternate($config, ., ("tei-measure2", "text-critical", css:map-rend-to-class(.)), ., ., let $measures := ancestor::measureGrp//measure  return (  ec:translate($measures[1]/@type, 0, 'uppercase'), ec:colon(),           for $measure in $measures     return     (' ', $measure/@quantity, ' ', ec:translate($measure/@origin, 0, 'lowercase'), ' ', ec:translate($measure/@unit, $measure/@quantity, 'lowercase'), ' ', ec:translate($measure/@commodity, 0, 'lowercase')) ))
                            else
                                if ((session:get-attribute('ssrq.lang'), 'de')[1]='de') then
                                    (: Display measurement with given parameters in tooltip and highlight text with color :)
                                    ext-fo:alternate($config, ., ("tei-measure3", "text-critical", css:map-rend-to-class(.)), ., ., (ec:translate(@type, 0, 'uppercase'), ec:colon(), @quantity, ' ', ec:translate(@origin, 0, 'lowercase'), ' ', ec:translate(@unit, @quantity, 'lowercase'), ' ', ec:translate(@commodity, 0, 'lowercase')))
                                else
                                    if ((session:get-attribute('ssrq.lang'), 'de')[1]!='de') then
                                        (: Display measurement with given parameters in tooltip and highlight text with color :)
                                        ext-fo:alternate($config, ., ("tei-measure4", "text-critical", css:map-rend-to-class(.)), ., ., (ec:translate(@type, 0, 'uppercase'), ec:colon(), @quantity, ' ', ec:translate(@unit, @quantity, 'lowercase'), ' ', ec:translate(@commodity, 0, 'lowercase'), ' ', ec:translate(@origin, 0, 'lowercase')))
                                    else
                                        $config?apply($config, ./node())
                    case element(epigraph) return
                        fo:block($config, ., ("tei-epigraph", css:map-rend-to-class(.)), .)
                    case element(actor) return
                        fo:inline($config, ., ("tei-actor", css:map-rend-to-class(.)), .)
                    case element(s) return
                        fo:inline($config, ., ("tei-s", css:map-rend-to-class(.)), .)
                    case element(condition) return
                        fo:listItem($config, ., ("tei-condition", css:map-rend-to-class(.)), (ec:label('condition'), ec:colon(), .), ())
                    case element(material) return
                        if (node() or @*) then
                            fo:inline($config, ., ("tei-material", css:map-rend-to-class(.)), (ec:label('surface'), ec:colon(), .))
                        else
                            $config?apply($config, ./node())
                    case element(rdg) return
                        if (../gap) then
                            (: app with gap and reading :)
                            fo:inline($config, ., ("tei-rdg", css:map-rend-to-class(.)), (ec:label('unreadable'), ', ', ec:label('supplied-after', false()), ' ', @wit))
                        else
                            $config?apply($config, ./node())
                    case element(lb) return
                        fo:omit($config, ., ("tei-lb", css:map-rend-to-class(.)), .)
                    case element(docTitle) return
                        fo:block($config, ., css:get-rendition(., ("tei-docTitle", css:map-rend-to-class(.))), .)
                    case element(w) return
                        fo:inline($config, ., ("tei-w", css:map-rend-to-class(.)), .)
                    case element(person) return
                        if ($parameters?header='context') then
                            (: No function found for behavior: pass-through :)
                            $config?apply($config, ./node())
                        else
                            (
                                fo:inline($config, ., ("tei-person2", css:map-rend-to-class(.)), (ec:label('person'), ' ')),
                                fo:link($config, ., ("tei-person3", css:map-rend-to-class(.)), persName[@type='full_sorted']/string(), (), map {"link": '../people/all/' || persName[@type='full_sorted']/string() || '?key=' || @xml:id, "target": '_new'})
                            )

                    case element(titlePage) return
                        fo:block($config, ., css:get-rendition(., ("tei-titlePage", css:map-rend-to-class(.))), .)
                    case element(stage) return
                        fo:block($config, ., ("tei-stage", css:map-rend-to-class(.)), .)
                    case element(name) return
                        fo:inline($config, ., ("tei-name", css:map-rend-to-class(.)), .)
                    case element(persName) return
                        if (parent::respStmt and ../preceding-sibling::respStmt) then
                            fo:inline($config, ., ("tei-persName1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::respStmt) then
                                fo:inline($config, ., ("tei-persName2", css:map-rend-to-class(.)), .)
                            else
                                if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/person/person.xml"))) then
                                    let $params := 
                                        map {
                                            "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/person/person.xml")),
                                            "default": .,
                                            "ref": @ref,
                                            "content": .
                                        }

                                                                        let $content := 
                                        model:template-persName3($config, ., $params)
                                    return
                                                                        fo:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-persName3", "semantic", "person", css:map-rend-to-class(.)), $content)
                                else
                                    if (@ref) then
                                        fo:link($config, ., ("tei-persName4", "semantic", "person", css:map-rend-to-class(.)), ., 'https://www.ssrq-sds-fds.ch/persons-db-edit/?query=' || replace(@ref, ' ', '-'), map {})
                                    else
                                        $config?apply($config, ./node())
                    case element(lg) return
                        fo:block($config, ., ("tei-lg", css:map-rend-to-class(.)), .)
                    case element(front) return
                        fo:block($config, ., ("tei-front", css:map-rend-to-class(.)), .)
                    case element(publicationStmt) return
                        fo:omit($config, ., ("tei-publicationStmt2", css:map-rend-to-class(.)), .)
                    case element(placeName) return
                        if (@ref and id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/place/place.xml"))) then
                            let $params := 
                                map {
                                    "alternate": id(replace(@ref, ' ', '-'), doc("/db/apps/rqzh-data/place/place.xml")),
                                    "default": .,
                                    "ref": @ref,
                                    "content": .
                                }

                                                        let $content := 
                                model:template-placeName($config, ., $params)
                            return
                                                        fo:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-placeName1", "semantic", "place", css:map-rend-to-class(.)), $content)
                        else
                            if (@ref) then
                                fo:link($config, ., ("tei-placeName2", "semantic", "place", css:map-rend-to-class(.)), ., 'https://www.ssrq-sds-fds.ch/places-db-edit/views/view-place.xq?id=' || replace(@ref, ' ', '-'), map {})
                            else
                                $config?apply($config, ./node())
                    case element(desc) return
                        fo:inline($config, ., ("tei-desc", css:map-rend-to-class(.)), .)
                    case element(biblScope) return
                        fo:inline($config, ., ("tei-biblScope", css:map-rend-to-class(.)), .)
                    case element(damage) return
                        if (gap) then
                            ext-fo:alternote($config, ., ("tei-damage1", "text-critical", css:map-rend-to-class(.)), '[...]', (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ' (', gap/@quantity, ' ', ec:translate(gap/@unit, gap/@quantity, ()), ')'))
                        else
                            if (unclear) then
                                ext-fo:alternote($config, ., ("tei-damage2", "text-critical", css:map-rend-to-class(.)), unclear/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('unclear-rdg', false())))
                            else
                                if (supplied/@source) then
                                    ext-fo:alternote($config, ., ("tei-damage3", "text-critical", css:map-rend-to-class(.)), supplied/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('supplied-after', false()), ' ', supplied/@source))
                                else
                                    if (supplied) then
                                        ext-fo:alternote($config, ., ("tei-damage4", "text-critical", css:map-rend-to-class(.)), supplied/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:label('supplied', false())))
                                    else
                                        if (add) then
                                            ext-fo:alternote($config, ., ("tei-damage5", "text-critical", css:map-rend-to-class(.)), add/node(), (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ()), ', ', ec:span((ec:label('add'), ' ', string-join((ec:translate(add/@place, 0, 'lowercase'), ec:translate(add/@hand, 0, 'lowercase'), ec:translate(add/@rend, 0, 'lowercase'), ec:translate(add/@type, 0, 'lowercase')), ' ')))))
                                        else
                                            if (@agent) then
                                                ext-fo:alternote($config, ., ("tei-damage6", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:label('damage'), ' ', ec:label('through', false()), ' ', ec:translate(@agent, 0, ())))
                                            else
                                                $config?apply($config, ./node())
                    case element(role) return
                        fo:block($config, ., ("tei-role", css:map-rend-to-class(.)), .)
                    case element(num) return
                        (: Display number in tooltip and highlight text with color :)
                        ext-fo:alternate($config, ., ("tei-num", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('amount'), ec:colon(), @value))
                    case element(docEdition) return
                        fo:inline($config, ., ("tei-docEdition", css:map-rend-to-class(.)), .)
                    case element(additional) return
                        fo:heading($config, ., ("tei-additional", css:map-rend-to-class(.)), ., ())
                    case element(postscript) return
                        fo:block($config, ., ("tei-postscript", css:map-rend-to-class(.)), .)
                    case element(docImprint) return
                        fo:listItem($config, ., ("tei-docImprint", css:map-rend-to-class(.)), (ec:label('imprint'), ec:colon(), translate((translate((pubPlace/text() || " " || publisher/text() ),")","")),"(","")), ())
                    case element(edition) return
                        if (ancestor::teiHeader) then
                            fo:block($config, ., ("tei-edition", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(space) return
                        ext-fo:alternote($config, ., ("tei-space", "text-critical", css:map-rend-to-class(.)), text{'...'}, (), 'text-critical', (ec:label('gap-in-orig'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'))
                    case element(relatedItem) return
                        fo:inline($config, ., ("tei-relatedItem", css:map-rend-to-class(.)), .)
                    case element(cell) return
                        (: Insert table cell. :)
                        fo:cell($config, ., ("tei-cell", css:map-rend-to-class(.)), ., ())
                    case element(div) return
                        if (parent::back and @n) then
                            (: output as list item if in commentary :)
                            fo:listItem($config, ., ("tei-div1", css:map-rend-to-class(.)), ., ())
                        else
                            if (parent::body or parent::front or parent::back) then
                                fo:section($config, ., ("tei-div2", css:map-rend-to-class(.)), .)
                            else
                                fo:block($config, ., ("tei-div3", css:map-rend-to-class(.)), .)
                    case element(reg) return
                        fo:inline($config, ., ("tei-reg", css:map-rend-to-class(.)), .)
                    case element(graphic) return
                        fo:graphic($config, ., ("tei-graphic", css:map-rend-to-class(.)), ., @url, @width, @height, @scale, desc)
                    case element(ref) return
                        if (parent::bibl) then
                            fo:link($config, ., ("tei-ref1", "ref-link", css:map-rend-to-class(.)), ., (), map {"text": ., "link": ec:ref-link(@target, util:collection-name(.))})
                        else
                            if (ancestor::div/@type='collection') then
                                (: Link in Klammerdokument :)
                                fo:link($config, ., ("tei-ref2", css:map-rend-to-class(.)), (doc(util:collection-name(.) || '/' || . || '.xml')//sourceDesc/msDesc/head/text(), ' (', ec:format-id(.), ')'), (), map {"link": string() || '.xml'})
                            else
                                if (not(@target) and matches(., '^(?:SSRQ|SDS|FDS)_')) then
                                    (: Link auf ein anderes Dokument innerhalb Portal :)
                                    fo:link($config, ., ("tei-ref3", css:map-rend-to-class(.)), ., (), map {"link": string() || ".xml"})
                                else
                                    if (not(@target)) then
                                        (: Link ohne Verweisadresse :)
                                        fo:inline($config, ., ("tei-ref4", css:map-rend-to-class(.)), .)
                                    else
                                        if (not(text())) then
                                            fo:link($config, ., ("tei-ref5", css:map-rend-to-class(.)), @target, (), map {"link": @target})
                                        else
                                            fo:link($config, ., ("tei-ref6", css:map-rend-to-class(.)), ., (), map {"link": @target, "target": '_new'})
                    case element(msIdentifier) return
                        (
                            fo:listItem($config, ., ("tei-msIdentifier1", css:map-rend-to-class(.)), idno, ()),
                            if (exists(altIdentifier)) then
                                fo:listItem($config, ., ("tei-msIdentifier2", css:map-rend-to-class(.)), altIdentifier/idno, ())
                            else
                                ()
                        )

                    case element(pubPlace) return
                        if (ancestor::teiHeader) then
                            (: Omit if located in teiHeader. :)
                            fo:omit($config, ., ("tei-pubPlace", css:map-rend-to-class(.)), .)
                        else
                            $config?apply($config, ./node())
                    case element(term) return
                        if (@ref) then
                            (: Semantic highlighting of keywords and lemmata with dark-red text color :)
                            let $params := 
                                map {
                                    "content": .,
                                    "ref": @ref,
                                    "label": ec:label('term'),
                                    "value": let $id := replace(@ref, ' ', '-') let $target:= id($id, doc("/db/apps/rqzh-data/taxonomy/taxonomy.xml")) let $letter := substring($id, 1, 1) => upper-case() return     if ($target) then ( <a href="https://www.ssrq-sds-fds.ch/lemma-db-edit/views/view-keyword.xq?id={$id}" target="_blank">{$target/desc/string()}</a>, if ($target/gloss) then( <span> ({$target/gloss/string()} )</span>) else () ) else (<a href="https://www.ssrq-sds-fds.ch/persons-db-edit/?query={$id}" target="_blank">{$id}</a>)
                                }

                                                        let $content := 
                                model:template-term($config, ., $params)
                            return
                                                        fo:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-term", "semantic", "term", css:map-rend-to-class(.)), $content)
                        else
                            $config?apply($config, ./node())
                    case element(supportDesc) return
                        (
                            fo:listItem($config, ., ("tei-supportDesc1", css:map-rend-to-class(.)), support/material, ()),
                            fo:listItem($config, ., ("tei-supportDesc2", css:map-rend-to-class(.)), extent/dimensions, ())
                        )

                    case element(add) return
                        if (ancestor::back//orig) then
                            fo:inline($config, ., ("tei-add1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::subst) then
                                fo:inline($config, ., ("tei-add2", css:map-rend-to-class(.)), .)
                            else
                                if (parent::del) then
                                    fo:inline($config, ., ("tei-add3", css:map-rend-to-class(.)), .)
                                else
                                    if (@hand!='other hand') then
                                        (: Show footnote only :)
                                        fo:note($config, ., ("tei-add4", css:map-rend-to-class(.)), ., (), ())
                                    else
                                        if (@type='catchword') then
                                            (: Show text of add with popup and footnote :)
                                            ext-fo:alternote($config, ., ("tei-add6", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:span((ec:label('add'), ' ', string-join((ec:translate(@place, 0, 'lowercase'), ', ', ec:translate(@type, 0, 'lowercase')))))))
                                        else
                                            (: Show text of add with popup and footnote :)
                                            ext-fo:alternote($config, ., ("tei-add5", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', (ec:span((ec:label('add'), ' ', string-join((ec:translate(@place, 0, 'lowercase'), ec:translate(@hand, 0, 'lowercase'), ec:translate(@rend, 0, 'lowercase'), ec:translate(@type, 0, 'lowercase')), ' '))), if (@scribe) then (' ', ec:label('byScribe', false()), ' ', ec:scribe(@scribe)) else ()))
                    case element(docDate) return
                        fo:inline($config, ., ("tei-docDate", css:map-rend-to-class(.)), .)
                    case element(head) return
                        if (@resp and @n) then
                            (: Supplied heading: output in brackets if @resp :)
                            fo:heading($config, ., ("tei-head1", css:map-rend-to-class(.)), ('[ ', @n, ' ', ., ' ]'), if (@type='title') then 1 else 2)
                        else
                            if (@n) then
                                (: Supplied heading: n. in brackets unless @resp :)
                                fo:heading($config, ., ("tei-head2", css:map-rend-to-class(.)), ('[ ', @n, ' ] ', .), if (@type='title') then 1 else 2)
                            else
                                if (@resp) then
                                    (: Supplied heading: output in brackets if @resp :)
                                    fo:heading($config, ., ("tei-head3", css:map-rend-to-class(.)), ., if (@type='title') then 1 else 2)
                                else
                                    if ($parameters?header='short') then
                                        fo:inline($config, ., ("tei-head4", css:map-rend-to-class(.)), replace(string-join(.//text()[not(parent::ref)]), '^(.*?)[^\w]*$', '$1'))
                                    else
                                        if (parent::figure) then
                                            fo:block($config, ., ("tei-head5", css:map-rend-to-class(.)), .)
                                        else
                                            if (parent::table) then
                                                (: No function found for behavior: caption :)
                                                $config?apply($config, ./node())
                                            else
                                                if (parent::lg) then
                                                    fo:block($config, ., ("tei-head7", css:map-rend-to-class(.)), .)
                                                else
                                                    if (parent::list) then
                                                        fo:block($config, ., ("tei-head8", css:map-rend-to-class(.)), .)
                                                    else
                                                        if (ancestor::app) then
                                                            (: Heading in app :)
                                                            fo:inline($config, ., ("tei-head9", "head", css:map-rend-to-class(.)), .)
                                                        else
                                                            if (parent::div[@n][@type=('chapter', 'section')]/*[1] is .) then
                                                                (: Show number in front of heading if @n is set on parent :)
                                                                fo:heading($config, ., ("tei-head10", css:map-rend-to-class(.)), ('[', parent::div/@n, '] ', .), 1)
                                                            else
                                                                if (parent::div[@n]/*[1] is .) then
                                                                    (: Show number in front of heading if @n is set on parent :)
                                                                    fo:heading($config, ., ("tei-head11", css:map-rend-to-class(.)), ('[', parent::div/@n, '] ', .), if (@type=('chapter','section','title')) then 1 else 2)
                                                                else
                                                                    (: All other headings are same size as text :)
                                                                    fo:heading($config, ., ("tei-head12", css:map-rend-to-class(.)), ., if (@type='title') then 1 else 2)
                    case element(ex) return
                        fo:inline($config, ., ("tei-ex", css:map-rend-to-class(.)), .)
                    case element(origPlace) return
                        if (parent::origin and node()) then
                            fo:listItem($config, ., ("tei-origPlace1", css:map-rend-to-class(.)), (ec:label('origPlace'), ec:colon(), .), ())
                        else
                            if (parent::origin) then
                                (: Leeres Element im header :)
                                fo:omit($config, ., ("tei-origPlace2", css:map-rend-to-class(.)), .)
                            else
                                (: Semantic highlighting of origPlace names with tooltip and green text color :)
                                ext-fo:alternate($config, ., ("tei-origPlace4", "semantic", "place", css:map-rend-to-class(.)), ., ., (ec:label('origPlace'), ec:colon(), . ))
                    case element(sealDesc) return
                        if (seal) then
                            (
                                fo:inline($config, ., ("tei-sealDesc1", css:map-rend-to-class(.)), (count(seal), ' ', ec:label('sigle', false(), count(seal)), ec:colon())),
                                fo:list($config, ., ("tei-sealDesc2", css:map-rend-to-class(.)), ., 'ordered')
                            )

                        else
                            if (not(seal)) then
                                (: sealDesc in "weitere Überlieferungen" :)
                                fo:listItem($config, ., ("tei-sealDesc3", css:map-rend-to-class(.)), (ec:label('sigle'), ec:colon(), .), ())
                            else
                                fo:omit($config, ., ("tei-sealDesc4", css:map-rend-to-class(.)), .)
                    case element(time) return
                        if (@period) then
                            (: Display time with given parameter in tooltip and highlight text with color :)
                            ext-fo:alternate($config, ., ("tei-time1", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:translate(@period, 0, ())))
                        else
                            if (@when) then
                                (: Display time with given parameter in tooltip and highlight text with color :)
                                ext-fo:alternate($config, ., ("tei-time2", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('time'), ec:colon(), format-time(@when, '[H]:[m]')))
                            else
                                if (@dur) then
                                    (: Display time in tooltip and highlight text with color :)
                                    ext-fo:alternate($config, ., ("tei-time3", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('duration'), ec:colon(), ec:format-duration(@dur)))
                                else
                                    (: Display time in tooltip and highlight text with color :)
                                    ext-fo:alternate($config, ., ("tei-time4", "text-critical", css:map-rend-to-class(.)), ., ., ec:label('time'))
                    case element(castGroup) return
                        if (child::*) then
                            (: Insert list. :)
                            fo:list($config, ., ("tei-castGroup", css:map-rend-to-class(.)), castItem|castGroup, ())
                        else
                            $config?apply($config, ./node())
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
                                                        fo:inline(map:merge(($config, map:entry("template", true()))), ., ("tei-bibl1", "bibl-link", css:map-rend-to-class(.)), $content)
                        else
                            if (ancestor::teiHeader) then
                                fo:listItem($config, ., ("tei-bibl2", css:map-rend-to-class(.)), ., ())
                            else
                                fo:inline($config, ., ("tei-bibl3", css:map-rend-to-class(.)), .)
                    case element(unclear) return
                        if (ancestor::back//orig) then
                            fo:inline($config, ., ("tei-unclear1", css:map-rend-to-class(.)), .)
                        else
                            if (parent::del or parent::abbr or parent::corr or parent::lem or parent::rdg) then
                                fo:inline($config, ., ("tei-unclear2", css:map-rend-to-class(.)), .)
                            else
                                ext-fo:alternote($config, ., ("tei-unclear3", "text-critical", css:map-rend-to-class(.)), ., (), 'text-critical', ec:label('unclear-rdg'))
                    case element(salute) return
                        if (parent::closer) then
                            fo:inline($config, ., ("tei-salute1", css:map-rend-to-class(.)), .)
                        else
                            fo:block($config, ., ("tei-salute2", css:map-rend-to-class(.)), .)
                    case element(title) return
                        if ($parameters?header='short') then
                            fo:heading($config, ., ("tei-title1", css:map-rend-to-class(.)), ., 5)
                        else
                            if (parent::titleStmt/parent::fileDesc) then
                                (
                                    if (preceding-sibling::title) then
                                        fo:text($config, ., ("tei-title2", css:map-rend-to-class(.)), ' — ')
                                    else
                                        (),
                                    fo:inline($config, ., ("tei-title3", css:map-rend-to-class(.)), .)
                                )

                            else
                                if (not(@level) and parent::bibl) then
                                    fo:inline($config, ., ("tei-title4", css:map-rend-to-class(.)), .)
                                else
                                    if (@level='m' or not(@level)) then
                                        (
                                            fo:inline($config, ., ("tei-title5", css:map-rend-to-class(.)), .),
                                            if (ancestor::biblFull) then
                                                fo:text($config, ., ("tei-title6", css:map-rend-to-class(.)), ', ')
                                            else
                                                ()
                                        )

                                    else
                                        if (@level='s' or @level='j') then
                                            (
                                                fo:inline($config, ., ("tei-title7", css:map-rend-to-class(.)), .),
                                                if (following-sibling::* and     (  ancestor::biblFull)) then
                                                    fo:text($config, ., ("tei-title8", css:map-rend-to-class(.)), ', ')
                                                else
                                                    ()
                                            )

                                        else
                                            if (@level='u' or @level='a') then
                                                (
                                                    fo:inline($config, ., ("tei-title9", css:map-rend-to-class(.)), .),
                                                    if (following-sibling::* and     (    ancestor::biblFull)) then
                                                        fo:text($config, ., ("tei-title10", css:map-rend-to-class(.)), '. ')
                                                    else
                                                        ()
                                                )

                                            else
                                                fo:inline($config, ., ("tei-title11", css:map-rend-to-class(.)), .)
                    case element(date) return
                        if (@type) then
                            ext-fo:alternate($config, ., ("tei-date9", "text-critical", css:map-rend-to-class(.)), ., ., (ec:label('date'), ' ', ec:translate(@type, 0, ())))
                        else
                            if (text()) then
                                fo:inline($config, ., ("tei-date10", "text-critical", css:map-rend-to-class(.)), .)
                            else
                                $config?apply($config, ./node())
                    case element(argument) return
                        fo:block($config, ., ("tei-argument", css:map-rend-to-class(.)), .)
                    case element(corr) return
                        if (parent::choice) then
                            fo:inline($config, ., ("tei-corr1", css:map-rend-to-class(.)), .)
                        else
                            ext-fo:alternate($config, ., ("tei-corr2", css:map-rend-to-class(.)), ., ., ec:label('corr'))
                    case element(cit) return
                        if (child::quote and child::bibl) then
                            (: Insert citation :)
                            fo:cit($config, ., ("tei-cit", css:map-rend-to-class(.)), ., ())
                        else
                            $config?apply($config, ./node())
                    case element(sic) return
                        if (parent::choice and count(parent::*/*) gt 1) then
                            fo:inline($config, ., ("tei-sic1", css:map-rend-to-class(.)), .)
                        else
                            ext-fo:alternate($config, ., ("tei-sic2", "text-critical", css:map-rend-to-class(.)), ., ., ec:label('sic'))
                    case element(titleStmt) return
                        fo:heading($config, ., ("tei-titleStmt1", css:map-rend-to-class(.)), ., ())
                    case element(filiation) return
                        if (text() and origDate) then
                            fo:inline($config, ., ("tei-filiation1", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), normalize-space(text()[1]), ', ', ec:print-date(origDate)))
                        else
                            if (text() and $parameters?view='metadata') then
                                fo:listItem($config, ., ("tei-filiation2", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), text()[1]), ())
                            else
                                if (text()) then
                                    fo:inline($config, ., ("tei-filiation3", css:map-rend-to-class(.)), (ec:label('other-source'), ec:colon(), text()[1]))
                                else
                                    fo:omit($config, ., ("tei-filiation4", css:map-rend-to-class(.)), .)
                    case element(expan) return
                        fo:inline($config, ., ("tei-expan", css:map-rend-to-class(.)), .)
                    case element(spGrp) return
                        fo:block($config, ., ("tei-spGrp", css:map-rend-to-class(.)), .)
                    case element(body) return
                        (
                            fo:index($config, ., ("tei-body1", css:map-rend-to-class(.)), ., 'toc'),
                            fo:block($config, ., ("tei-body2", "body", css:map-rend-to-class(.)), .)
                        )

                    case element(fw) return
                        if (ancestor::p or ancestor::ab) then
                            fo:inline($config, ., ("tei-fw1", css:map-rend-to-class(.)), .)
                        else
                            fo:block($config, ., ("tei-fw2", css:map-rend-to-class(.)), .)
                    case element(encodingDesc) return
                        fo:omit($config, ., ("tei-encodingDesc", css:map-rend-to-class(.)), .)
                    case element(textLang) return
                        (: Ausgabe Sprache in "weitere Überlieferungen" :)
                        fo:listItem($config, ., ("tei-textLang", css:map-rend-to-class(.)), (ec:label('language'), ec:colon(), string-join(for $lang in tokenize(., ', *') return ec:label($lang, false()), ', ')), ())
                    case element(quote) return
                        (: With quotes :)
                        fo:inline($config, ., ("tei-quote", css:map-rend-to-class(.)), .)
                    case element(gap) return
                        if (@reason='irrelevant') then
                            ext-fo:alternate($config, ., ("tei-gap1", "text-critical", css:map-rend-to-class(.)), ., text{'[...]'}, ec:label('irrelevant'))
                        else
                            if (@reason='illegible') then
                                ext-fo:alternote($config, ., ("tei-gap2", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('unreadable'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'))
                            else
                                if (@reason='missing') then
                                    ext-fo:alternote($config, ., ("tei-gap3", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('missing'), ' (' , @quantity , ' ', ec:translate(@unit, @quantity, 'lowercase'), ')'))
                                else
                                    if (@source) then
                                        ext-fo:alternote($config, ., ("tei-gap4", "text-critical", css:map-rend-to-class(.)), text{'[...]'}, (), 'text-critical', (ec:label('compare'), ' ', @source))
                                    else
                                        if (desc) then
                                            fo:inline($config, ., ("tei-gap5", css:map-rend-to-class(.)), .)
                                        else
                                            if (@extent) then
                                                fo:inline($config, ., ("tei-gap6", "text-critical", css:map-rend-to-class(.)), @extent)
                                            else
                                                fo:inline($config, ., ("tei-gap7", "text-critical", css:map-rend-to-class(.)), .)
                    case element(addrLine) return
                        fo:block($config, ., ("tei-addrLine", css:map-rend-to-class(.)), .)
                    case element(row) return
                        if (@role='label') then
                            fo:row($config, ., ("tei-row1", css:map-rend-to-class(.)), .)
                        else
                            (: Insert table row. :)
                            fo:row($config, ., ("tei-row2", css:map-rend-to-class(.)), .)
                    case element(docAuthor) return
                        fo:inline($config, ., ("tei-docAuthor", css:map-rend-to-class(.)), .)
                    case element(byline) return
                        fo:block($config, ., ("tei-byline", css:map-rend-to-class(.)), .)
                    case element() return
                        if (namespace-uri(.) = 'http://www.tei-c.org/ns/1.0') then
                            $config?apply($config, ./node())
                        else
                            .
                    case text() | xs:anyAtomicType return
                        ext-fo:content($config, ., ("tei--text", css:map-rend-to-class(.)), .)
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
                    fo:escapeChars(.)
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


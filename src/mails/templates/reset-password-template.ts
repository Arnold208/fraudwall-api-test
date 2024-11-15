export const resetPasswordMailTemplate = (name: string, url: string) => {
  return `<!doctype html>
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    
        <style type="text/css">
          p {
            margin: 10px 0;
            padding: 0;
          }
          table {
            border-collapse: collapse;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            display: block;
            margin: 0;
            padding: 0;
          }
          img,
          a img {
            border: 0;
            height: auto;
            outline: none;
            text-decoration: none;
          }
          body,
          #bodyTable,
          #bodyCell {
            height: 100%;
            margin: 0;
            padding: 0;
            width: 100%;
          }
          .mcnPreviewText {
            display: none !important;
          }
          #outlook a {
            padding: 0;
          }
          img {
            -ms-interpolation-mode: bicubic;
          }
          .ReadMsgBody {
            width: 100%;
          }
          .ExternalClass {
            width: 100%;
          }
          p,
          a,
          li,
          td,
          a[href^='tel'],
          a[href^='sms'] {
            color: inherit;
            cursor: default;
            text-decoration: none;
          }
          p,
          a,
          li,
          td,
          body,
          table,
          blockquote {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass td,
          .ExternalClass div,
          .ExternalClass span,
          .ExternalClass font {
            line-height: 100%;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          .templateContainer {
            max-width: 600px !important;
          }
          a.mcnButton {
            display: block;
          }
          .mcnImage,
          .mcnRetinaImage {
            vertical-align: bottom;
          }
          .mcnTextContent {
            word-break: break-word;
          }
          .mcnTextContent img {
            height: auto !important;
          }
          .mcnDividerBlock {
            table-layout: fixed !important;
          }
          /*
            @tab Page
            @section Heading 1
            @style heading 1
            */
          h1 {
            /*@editable*/
            color: #222222;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 40px;
            /*@editable*/
            font-style: normal;
            /*@editable*/
            font-weight: bold;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            letter-spacing: normal;
            /*@editable*/
            text-align: center;
          }
          /*
            @tab Page
            @section Heading 2
            @style heading 2
            */
          h2 {
            /*@editable*/
            color: #222222;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 34px;
            /*@editable*/
            font-style: normal;
            /*@editable*/
            font-weight: bold;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            letter-spacing: normal;
            /*@editable*/
            text-align: left;
          }
          /*
            @tab Page
            @section Heading 3
            @style heading 3
            */
          h3 {
            /*@editable*/
            color: #444444;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 22px;
            /*@editable*/
            font-style: normal;
            /*@editable*/
            font-weight: bold;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            letter-spacing: normal;
            /*@editable*/
            text-align: left;
          }
          /*
            @tab Page
            @section Heading 4
            @style heading 4
            */
          h4 {
            /*@editable*/
            color: #949494;
            /*@editable*/
            font-family: Georgia;
            /*@editable*/
            font-size: 20px;
            /*@editable*/
            font-style: italic;
            /*@editable*/
            font-weight: normal;
            /*@editable*/
            line-height: 125%;
            /*@editable*/
            letter-spacing: normal;
            /*@editable*/
            text-align: left;
          }
          /*
            @tab Header
            @section Header Container Style
            */
          #templateHeader {
            /*@editable*/
            background-color: #ffffff;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 0px;
            /*@editable*/
            padding-bottom: 0px;
          }
          /*
            @tab Header
            @section Header Interior Style
            */
          .headerContainer {
            /*@editable*/
            background-color: transparent;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 0;
            /*@editable*/
            padding-bottom: 0;
          }
          /*
            @tab Header
            @section Header Text
            */
          .headerContainer .mcnTextContent,
          .headerContainer .mcnTextContent p {
            /*@editable*/
            color: #757575;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 16px;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            text-align: left;
          }
          /*
            @tab Header
            @section Header Link
            */
          .headerContainer .mcnTextContent a,
          .headerContainer .mcnTextContent p a {
            /*@editable*/
            color: #007c89;
            /*@editable*/
            font-weight: normal;
            /*@editable*/
            text-decoration: underline;
          }
          /*
            @tab Body
            @section Body Container Style
            */
          #templateBody {
            /*@editable*/
            background-color: #ffffff;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 16px;
            /*@editable*/
            padding-bottom: 16px;
          }
          /*
            @tab Body
            @section Body Interior Style
            */
          .bodyContainer {
            /*@editable*/
            background-color: transparent;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 0;
            /*@editable*/
            padding-bottom: 0;
          }
          /*
            @tab Body
            @section Body Text
            */
          .bodyContainer .mcnTextContent,
          .bodyContainer .mcnTextContent p {
            /*@editable*/
            color: #757575;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 16px;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            text-align: left;
          }
          /*
            @tab Body
            @section Body Link
            */
          .bodyContainer .mcnTextContent a,
          .bodyContainer .mcnTextContent p a {
            /*@editable*/
            color: #007c89;
            /*@editable*/
            font-weight: normal;
            /*@editable*/
            text-decoration: underline;
          }
          /*
            @tab Footer
            @section Footer Style
            */
          #templateFooter {
            /*@editable*/
            background-color: #00756a;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 0px;
            /*@editable*/
            padding-bottom: 0px;
          }
          /*
            @tab Footer
            @section Footer Interior Style
            */
          .footerContainer {
            /*@editable*/
            background-color: transparent;
            /*@editable*/
            background-image: none;
            /*@editable*/
            background-repeat: no-repeat;
            /*@editable*/
            background-position: center;
            /*@editable*/
            background-size: cover;
            /*@editable*/
            border-top: 0;
            /*@editable*/
            border-bottom: 0;
            /*@editable*/
            padding-top: 0;
            /*@editable*/
            padding-bottom: 0;
          }
          /*
            @tab Footer
            @section Footer Text
            */
          .footerContainer .mcnTextContent,
          .footerContainer .mcnTextContent p {
            /*@editable*/
            color: #ffffff;
            /*@editable*/
            font-family: Helvetica;
            /*@editable*/
            font-size: 12px;
            /*@editable*/
            line-height: 150%;
            /*@editable*/
            text-align: center;
          }
          /*
            @tab Footer
            @section Footer Link
            */
          .footerContainer .mcnTextContent a,
          .footerContainer .mcnTextContent p a {
            /*@editable*/
            color: #ffffff;
            /*@editable*/
            font-weight: normal;
            /*@editable*/
            text-decoration: underline;
          }
          @media only screen and (min-width: 768px) {
            .templateContainer {
              width: 600px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            body,
            table,
            td,
            p,
            a,
            li,
            blockquote {
              -webkit-text-size-adjust: none !important;
            }
          }
          @media only screen and (max-width: 480px) {
            body {
              width: 100% !important;
              min-width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnRetinaImage {
              max-width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImage {
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnCartContainer,
            .mcnCaptionTopContent,
            .mcnRecContentContainer,
            .mcnCaptionBottomContent,
            .mcnTextContentContainer,
            .mcnBoxedTextContentContainer,
            .mcnImageGroupContentContainer,
            .mcnCaptionLeftTextContentContainer,
            .mcnCaptionRightTextContentContainer,
            .mcnCaptionLeftImageContentContainer,
            .mcnCaptionRightImageContentContainer,
            .mcnImageCardLeftTextContentContainer,
            .mcnImageCardRightTextContentContainer,
            .mcnImageCardLeftImageContentContainer,
            .mcnImageCardRightImageContentContainer {
              max-width: 100% !important;
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnBoxedTextContentContainer {
              min-width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageGroupContent {
              padding: 9px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnCaptionLeftContentOuter .mcnTextContent,
            .mcnCaptionRightContentOuter .mcnTextContent {
              padding-top: 9px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageCardTopImageContent,
            .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,
            .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
              padding-top: 18px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageCardBottomImageContent {
              padding-bottom: 9px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageGroupBlockInner {
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageGroupBlockOuter {
              padding-top: 9px !important;
              padding-bottom: 9px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnTextContent,
            .mcnBoxedTextContentColumn {
              padding-right: 18px !important;
              padding-left: 18px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcnImageCardLeftImageContent,
            .mcnImageCardRightImageContent {
              padding-right: 18px !important;
              padding-bottom: 0 !important;
              padding-left: 18px !important;
            }
          }
          @media only screen and (max-width: 480px) {
            .mcpreview-image-uploader {
              display: none !important;
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Heading 1
            @tip Make the first-level headings larger in size for better readability on small screens.
            */
            h1 {
              /*@editable*/
              font-size: 30px !important;
              /*@editable*/
              line-height: 125% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Heading 2
            @tip Make the second-level headings larger in size for better readability on small screens.
            */
            h2 {
              /*@editable*/
              font-size: 26px !important;
              /*@editable*/
              line-height: 125% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Heading 3
            @tip Make the third-level headings larger in size for better readability on small screens.
            */
            h3 {
              /*@editable*/
              font-size: 20px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Heading 4
            @tip Make the fourth-level headings larger in size for better readability on small screens.
            */
            h4 {
              /*@editable*/
              font-size: 18px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Boxed Text
            @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
            */
            .mcnBoxedTextContentContainer .mcnTextContent,
            .mcnBoxedTextContentContainer .mcnTextContent p {
              /*@editable*/
              font-size: 14px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Header Text
            @tip Make the header text larger in size for better readability on small screens.
            */
            .headerContainer .mcnTextContent,
            .headerContainer .mcnTextContent p {
              /*@editable*/
              font-size: 16px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Body Text
            @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
            */
            .bodyContainer .mcnTextContent,
            .bodyContainer .mcnTextContent p {
              /*@editable*/
              font-size: 16px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
          @media only screen and (max-width: 480px) {
            /*
            @tab Mobile Styles
            @section Footer Text
            @tip Make the footer content text larger in size for better readability on small screens.
            */
            .footerContainer .mcnTextContent,
            .footerContainer .mcnTextContent p {
              /*@editable*/
              font-size: 14px !important;
              /*@editable*/
              line-height: 150% !important;
            }
          }
        </style>
        <script>
          !(function () {
            function o(n, i) {
              if (n && i)
                for (var r in i)
                  i.hasOwnProperty(r) &&
                    (void 0 === n[r]
                      ? (n[r] = i[r])
                      : n[r].constructor === Object && i[r].constructor === Object
                        ? o(n[r], i[r])
                        : (n[r] = i[r]));
            }
            try {
              var n = decodeURIComponent(
                '%0A%7B%0A%22ResourceTiming%22%3A%7B%0A%22comment%22%3A%20%22Clear%20RT%20Buffer%20on%20mPulse%20beacon%22%2C%0A%22clearOnBeacon%22%3A%20true%0A%7D%2C%0A%22AutoXHR%22%3A%7B%0A%22comment%22%3A%20%22Monitor%20XHRs%20requested%20using%20FETCH%22%2C%0A%22monitorFetch%22%3A%20true%2C%0A%22comment%22%3A%20%22Start%20Monitoring%20SPAs%20from%20Click%22%2C%0A%22spaStartFromClick%22%3A%20true%0A%7D%2C%0A%22PageParams%22%3A%7B%0A%22comment%22%3A%20%22Monitor%20all%20SPA%20XHRs%22%2C%0A%22spaXhr%22%3A%20%22all%22%0A%7D%0A%7D',
              );
              if (
                n.length > 0 &&
                window.JSON &&
                'function' == typeof window.JSON.parse
              ) {
                var i = JSON.parse(n);
                void 0 !== window.BOOMR_config
                  ? o(window.BOOMR_config, i)
                  : (window.BOOMR_config = i);
              }
            } catch (r) {
              window.console &&
                'function' == typeof window.console.error &&
                console.error('mPulse: Could not parse configuration', r);
            }
          })();
        </script>
        <script>
          !(function (a) {
            var e = 'https://s.go-mpulse.net/boomerang/',
              t = 'addEventListener';
            if ('True' == 'True')
              (a.BOOMR_config = a.BOOMR_config || {}),
                (a.BOOMR_config.PageParams = a.BOOMR_config.PageParams || {}),
                (a.BOOMR_config.PageParams.pci = !0),
                (e = 'https://s2.go-mpulse.net/boomerang/');
            if (
              ((window.BOOMR_API_key = 'QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA'),
              (function () {
                function n(e) {
                  a.BOOMR_onload = (e && e.timeStamp) || new Date().getTime();
                }
                if (!a.BOOMR || (!a.BOOMR.version && !a.BOOMR.snippetExecuted)) {
                  (a.BOOMR = a.BOOMR || {}), (a.BOOMR.snippetExecuted = !0);
                  var i,
                    _,
                    o,
                    r = document.createElement('iframe');
                  if (a[t]) a[t]('load', n, !1);
                  else if (a.attachEvent) a.attachEvent('onload', n);
                  (r.src = 'javascript:void(0)'),
                    (r.title = ''),
                    (r.role = 'presentation'),
                    ((r.frameElement || r).style.cssText =
                      'width:0;height:0;border:0;display:none;'),
                    (o = document.getElementsByTagName('script')[0]),
                    o.parentNode.insertBefore(r, o);
                  try {
                    _ = r.contentWindow.document;
                  } catch (O) {
                    (i = document.domain),
                      (r.src =
                        "javascript:var d=document.open();d.domain='" +
                        i +
                        "';void(0);"),
                      (_ = r.contentWindow.document);
                  }
                  (_.open()._l = function () {
                    var a = this.createElement('script');
                    if (i) this.domain = i;
                    (a.id = 'boomr-if-as'),
                      (a.src = e + 'QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA'),
                      (BOOMR_lstart = new Date().getTime()),
                      this.body.appendChild(a);
                  }),
                    _.write('<bo' + 'dy onload="document._l();">'),
                    _.close();
                }
              })(),
              '400'.length > 0)
            )
              if (
                a &&
                'performance' in a &&
                a.performance &&
                'function' == typeof a.performance.setResourceTimingBufferSize
              )
                a.performance.setResourceTimingBufferSize(400);
            !(function () {
              if (
                ((BOOMR = a.BOOMR || {}),
                (BOOMR.plugins = BOOMR.plugins || {}),
                !BOOMR.plugins.AK)
              ) {
                var e = '' == 'true' ? 1 : 0,
                  t = '',
                  n = 'm2yf5oixjcn2wzjs6yfq-f-69a6d437b-clientnsv4-s.akamaihd.net',
                  i = 'false' == 'true' ? 2 : 1,
                  _ = {
                    'ak.v': '36',
                    'ak.cp': '282636',
                    'ak.ai': parseInt('199322', 10),
                    'ak.ol': '0',
                    'ak.cr': 146,
                    'ak.ipv': 4,
                    'ak.proto': 'h2',
                    'ak.rid': '79f1f77',
                    'ak.r': 41423,
                    'ak.a2': e,
                    'ak.m': 'x',
                    'ak.n': 'essl',
                    'ak.bpcip': '102.176.94.0',
                    'ak.cport': 21892,
                    'ak.gh': '2.23.5.195',
                    'ak.quicv': '',
                    'ak.tlsv': 'tls1.3',
                    'ak.0rtt': '',
                    'ak.csrc': '-',
                    'ak.acc': '',
                    'ak.t': '1697838603',
                    'ak.ak':
                      'hOBiQwZUYzCg5VSAfCLimQ==JMSmu5vwHPpOD+JDqCKxMxOqYV+JX+O0q9qi6FyN/9BNnNW9jxIBeCJflySzAAfzc6z3CGRT37YDhENEh3j0keqc0E9lVTbEYT1LItP+M6zGvXDxfYk3oRaMTOzxq748GoyATWzyIUH5Dbdlyjjs6oI+FA8hpuIddpZ4Xv8hzmYkAAoP6COCv/XIcyxfpWDPnvBmqM7Nxrf/BC6FkWWirg9jIChpd9kZ3wJSTvH2cnF3ZPjUL8rsHB93YXg9mOJ41i3AgbL9KFeFbU3Z8uYUWQY03eYhbTwPjpafQGF3r4n3f6MIdxxWEmHlbiHYI0i1kWNc60Hq8JY3Xpv8zeRVhHgD/uNUc25kdbuC0jQtA3on6ZZ5Pgz47M+RvhzGxbpNGtE2fPj7URT7d0DNr5a7tX3eSN4LSinnS9HDMHSihac=',
                    'ak.pv': '159',
                    'ak.dpoabenc': '',
                    'ak.tf': i,
                  };
                if ('' !== t) _['ak.ruds'] = t;
                var o = {
                  i: !1,
                  av: function (e) {
                    var t = 'http.initiator';
                    if (e && (!e[t] || 'spa_hard' === e[t]))
                      (_['ak.feo'] = void 0 !== a.aFeoApplied ? 1 : 0),
                        BOOMR.addVar(_);
                  },
                  rv: function () {
                    var a = [
                      'ak.bpcip',
                      'ak.cport',
                      'ak.cr',
                      'ak.csrc',
                      'ak.gh',
                      'ak.ipv',
                      'ak.m',
                      'ak.n',
                      'ak.ol',
                      'ak.proto',
                      'ak.quicv',
                      'ak.tlsv',
                      'ak.0rtt',
                      'ak.r',
                      'ak.acc',
                      'ak.t',
                      'ak.tf',
                    ];
                    BOOMR.removeVar(a);
                  },
                };
                BOOMR.plugins.AK = {
                  akVars: _,
                  akDNSPreFetchDomain: n,
                  init: function () {
                    if (!o.i) {
                      var a = BOOMR.subscribe;
                      a('before_beacon', o.av, null, null),
                        a('onbeacon', o.rv, null, null),
                        (o.i = !0);
                    }
                    return this;
                  },
                  is_complete: function () {
                    return !0;
                  },
                };
              }
            })();
          })(window);
        </script>
      </head>
      <body>
        <center>
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            height="100%"
            width="100%"
            id="bodyTable"
          >
            <tr>
              <td align="center" valign="top" id="bodyCell">
                <!-- BEGIN TEMPLATE // -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      align="center"
                      valign="top"
                      id="templateHeader"
                      data-template-container
                    ></td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      valign="top"
                      id="templateBody"
                      data-template-container
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        class="templateContainer"
                      >
                        <tr>
                          <td valign="top" class="bodyContainer">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="mcnImageBlock"
                              style="min-width: 100%"
                            >
                              <tbody class="mcnImageBlockOuter">
                                <tr>
                                  <td
                                    valign="top"
                                    style="padding: 9px"
                                    class="mcnImageBlockInner"
                                  >
                                    <table
                                      align="left"
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="mcnImageContentContainer"
                                      style="min-width: 100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            class="mcnImageContent"
                                            valign="top"
                                            style="
                                              padding-right: 9px;
                                              padding-left: 9px;
                                              padding-top: 0;
                                              padding-bottom: 0;
                                              text-align: center;
                                            "
                                          >
                                            <img
                                              align="center"
                                              alt=""
                                              src="https://mcusercontent.com/93017f5e7800e16e35b196c8f/images/fbd6b09c-f4ba-f44e-f276-6e0a88e37cc6.png"
                                              width="210.42"
                                              style="
                                                max-width: 501px;
                                                padding-bottom: 0;
                                                display: inline !important;
                                                vertical-align: bottom;
                                              "
                                              class="mcnImage"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="mcnTextBlock"
                              style="min-width: 100%"
                            >
                              <tbody class="mcnTextBlockOuter">
                                <tr>
                                  <td
                                    valign="top"
                                    class="mcnTextBlockInner"
                                    style="padding-top: 9px"
                                  >
                                    <table
                                      align="left"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="max-width: 100%; min-width: 100%"
                                      width="100%"
                                      class="mcnTextContentContainer"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            class="mcnTextContent"
                                            style="
                                              padding-top: 0;
                                              padding-right: 18px;
                                              padding-bottom: 9px;
                                              padding-left: 18px;
                                            "
                                          >
                                            <div style="text-align: center">
                                              <font
                                                color="#00756a"
                                                face="roboto, helvetica neue, helvetica, arial, sans-serif"
                                                ><span style="font-size: 18px"
                                                  ><strong
                                                    >Securing Your Account</strong
                                                  ></span
                                                ></font
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if mso]>
                        </td>
                        <![endif]-->
    
                                    <!--[if mso]>
                        </tr>
                        </table>
                        <![endif]-->
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="mcnTextBlock"
                              style="min-width: 100%"
                            >
                              <tbody class="mcnTextBlockOuter">
                                <tr>
                                  <td
                                    valign="top"
                                    class="mcnTextBlockInner"
                                    style="padding-top: 9px"
                                  >
                                    <table
                                      align="left"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="max-width: 100%; min-width: 100%"
                                      width="100%"
                                      class="mcnTextContentContainer"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            class="mcnTextContent"
                                            style="
                                              padding-top: 0;
                                              padding-right: 18px;
                                              padding-bottom: 9px;
                                              padding-left: 18px;
                                            "
                                          >
                                            <div style="text-align: center">
                                              <span
                                                style="
                                                  font-family:
                                                    roboto,
                                                    helvetica neue,
                                                    helvetica,
                                                    arial,
                                                    sans-serif;
                                                "
                                                ><span style="font-size: 13px"
                                                  ><span style="color: #000000"
                                                    >Hello ${name}!<br />
                                                    <br />
                                                    We received a request to reset
                                                    your account's password. Click
                                                    the button below to do so.</span
                                                  ></span
                                                ></span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="mcnButtonBlock"
                              style="min-width: 100%"
                            >
                              <tbody class="mcnButtonBlockOuter">
                                <tr>
                                  <td
                                    style="
                                      padding-top: 0;
                                      padding-right: 18px;
                                      padding-bottom: 18px;
                                      padding-left: 18px;
                                    "
                                    valign="top"
                                    align="center"
                                    class="mcnButtonBlockInner"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="mcnButtonContentContainer"
                                      style="
                                        border-collapse: separate !important;
                                        border-radius: 50px;
                                        background-color: #00756a;
                                      "
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="center"
                                            valign="middle"
                                            class="mcnButtonContent"
                                            style="
                                              font-family: Roboto, 'Helvetica Neue',
                                                Helvetica, Arial, sans-serif;
                                              font-size: 16px;
                                              padding: 18px;
                                            "
                                          >
                                            <a
                                              class="mcnButton"
                                              title="Reset Password"
                                              href="${url}"
                                              target="_blank"
                                              style="
                                                font-weight: bold;
                                                letter-spacing: normal;
                                                line-height: 100%;
                                                text-align: center;
                                                text-decoration: none;
                                                color: #ffffff;
                                              "
                                              >Reset Password</a
                                            >
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="mcnTextBlock"
                              style="min-width: 100%"
                            >
                              <tbody class="mcnTextBlockOuter">
                                <tr>
                                  <td
                                    valign="top"
                                    class="mcnTextBlockInner"
                                    style="padding-top: 9px"
                                  >
                                    <!--[if mso]>
                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                        <tr>
                        <![endif]-->
    
                                    <!--[if mso]>
                        <td valign="top" width="600" style="width:600px;">
                        <![endif]-->
                                    <table
                                      align="left"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="max-width: 100%; min-width: 100%"
                                      width="100%"
                                      class="mcnTextContentContainer"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            class="mcnTextContent"
                                            style="
                                              padding-top: 0;
                                              padding-right: 18px;
                                              padding-bottom: 9px;
                                              padding-left: 18px;
                                            "
                                          >
                                            <div style="text-align: center">
                                              <span
                                                style="
                                                  font-family:
                                                    roboto,
                                                    helvetica neue,
                                                    helvetica,
                                                    arial,
                                                    sans-serif;
                                                "
                                                ><span style="font-size: 13px"
                                                  ><span style="color: #000000"
                                                    >If you didn't make this
                                                    request, kindly ignore this
                                                    email.</span
                                                  ></span
                                                ></span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
        <script
          type="text/javascript"
          src="/LmDEEI6kgkRzYA9TFdqEgRVm/z51JJStw0Q/SGNYRA/QU/QKZW8GRWkB"
        ></script>
      </body>
    </html>
    
    `;
};


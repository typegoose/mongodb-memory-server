"use strict";(self.webpackChunkmongodb_memory_server_website=self.webpackChunkmongodb_memory_server_website||[]).push([[7895],{6931:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>x,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var s=r(5893),t=r(1151);const o={id:"mongodb-server-versions",title:"Mongodb Server Versions"},d=void 0,i={id:"guides/mongodb-server-versions",title:"Mongodb Server Versions",description:"This Guide will show what MongoDB Server versions are / were the default for versions of mongodb-memory-server-core and the guidelines of when a version gets changed.",source:"@site/../docs/guides/mongodb-server-versions.md",sourceDirName:"guides",slug:"/guides/mongodb-server-versions",permalink:"/mongodb-memory-server/versions/beta/docs/guides/mongodb-server-versions",draft:!1,unlisted:!1,editUrl:"https://github.com/nodkz/mongodb-memory-server/edit/master/docs/../docs/guides/mongodb-server-versions.md",tags:[],version:"current",frontMatter:{id:"mongodb-server-versions",title:"Mongodb Server Versions"},sidebar:"guides",previous:{title:"Details for Errors & Warnings",permalink:"/mongodb-memory-server/versions/beta/docs/guides/error-warning-details"},next:{title:"Common Issues",permalink:"/mongodb-memory-server/versions/beta/docs/guides/common-issues"}},l={},c=[{value:"When a Version gets upgraded",id:"when-a-version-gets-upgraded",level:2},{value:"<code>mongodb-memory-server-core</code> Version Table",id:"mongodb-memory-server-core-version-table",level:2},{value:"<code>mongodb-memory-server-global-*</code> Version Table",id:"mongodb-memory-server-global--version-table",level:2}];function h(e){const n={a:"a",admonition:"admonition",br:"br",code:"code",em:"em",h2:"h2",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["This Guide will show what MongoDB Server versions are / were the default for versions of ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," and the guidelines of when a version gets changed."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:(0,s.jsxs)("sub",{children:["Some expressions will use ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/semver",children:"npm's semver convention"}),"."]})})}),"\n",(0,s.jsx)(n.h2,{id:"when-a-version-gets-upgraded",children:"When a Version gets upgraded"}),"\n",(0,s.jsxs)(n.p,{children:["In a new major version of ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," (",(0,s.jsx)(n.code,{children:"X.0.0"}),"), the default mongodb binary version may be upgraded to any newer version (",(0,s.jsx)(n.code,{children:"X.X.X"}),").",(0,s.jsx)(n.br,{}),"\n","In a minor version of ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," (",(0,s.jsx)(n.code,{children:"0.X.0"}),"), the default mongodb binary version may be upgraded to the latest patch version ",(0,s.jsx)(n.code,{children:"0.0.X"}),".",(0,s.jsx)(n.br,{}),"\n","In a patch version of ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," (",(0,s.jsx)(n.code,{children:"0.0.X"}),"), the default mongodb binary version will not be changed."]}),"\n",(0,s.jsx)(n.p,{children:"There are some exceptions:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["A mongodb binary may go offline (not being able to download it anymore), then the default version will be changed and a ",(0,s.jsx)(n.em,{children:"minor"})," (",(0,s.jsx)(n.code,{children:"0.X.0"}),") release will happen."]}),"\n",(0,s.jsxs)(n.li,{children:["A mongodb binary may be broken, then the default version will be changed and a ",(0,s.jsx)(n.em,{children:"minor"})," (",(0,s.jsx)(n.code,{children:"0.X.0"}),") release will happen."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"The versions with a broken default binary may get deprecated (when possible)."}),"\n",(0,s.jsxs)(n.p,{children:["For Packages that are named with a version (like ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-4.2"}),"), the patch version (",(0,s.jsx)(n.code,{children:"0.0.X"}),") of a binary may be changed with minor (",(0,s.jsx)(n.code,{children:"0.X.0"}),") releases."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Starting with MongoDB version 5.0, the default versions for ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," will only be major ",(0,s.jsx)(n.code,{children:"X.0.0"})," versions (no ",(0,s.jsx)(n.code,{children:"X.X.0"})," versions), see ",(0,s.jsx)(n.a,{href:"https://docs.mongodb.com/manual/reference/versioning/#std-label-release-version-numbers",children:"MongoDB Versioning"}),"."]})}),"\n",(0,s.jsxs)(n.h2,{id:"mongodb-memory-server-core-version-table",children:[(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," Version Table"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.th,{style:{textAlign:"center"},children:[(0,s.jsx)(n.code,{children:"mongodb-memory-server-core"})," Version"]}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Default MongoDB Version"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"9.0.x - 9.0.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"6.0.9"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"8.14.x - 8.16.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"5.0.19"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"8.13.x - 8.13.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"5.0.18"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"8.11.x - 8.12.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"5.0.13"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"8.6.x - 8.10.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"5.0.8"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"8.0.x - 8.5.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"5.0.3"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"7.5.x - 7.5.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.0.27"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"7.0.x - 7.4.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.0.25"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"6.4.x - 6.9.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.0.14"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"6.0.x - 6.4.x"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.0.3"})]})]})]}),"\n",(0,s.jsxs)(n.h2,{id:"mongodb-memory-server-global--version-table",children:[(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-*"})," Version Table"]}),"\n",(0,s.jsxs)(n.p,{children:["This Section will show all ",(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-*"})," packages that ever existed for this Project, what Version they provide in the latest version and what Branch they will be updated from."]}),"\n",(0,s.jsxs)(n.p,{children:["If the branch is named like ",(0,s.jsx)(n.code,{children:"old/"}),", then it means that this package will not be updated for new major MMS versions anymore. (Example if the package is in ",(0,s.jsx)(n.code,{children:"old/6.x"}),", then it will not get any updates to MMS 7.0 or higher)"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Package Name"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Provided MongoDB Version"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Current Branch"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-4.4"})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.4.22"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"master"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-4.2"})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.2.23"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"master"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-4.0"})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"4.0.28"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"master"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-3.6"})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"3.6.23"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"old/7.x"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"mongodb-memory-server-global-3.4"})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"3.4.20"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"old/6.x"})})]})]})]})]})}function x(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1151:(e,n,r)=>{r.d(n,{Z:()=>i,a:()=>d});var s=r(7294);const t={},o=s.createContext(t);function d(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);
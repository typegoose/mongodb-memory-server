"use strict";(self.webpackChunkmongodb_memory_server_website=self.webpackChunkmongodb_memory_server_website||[]).push([[895],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return g}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),d=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=m(e,["components","mdxType","originalType","parentName"]),c=d(n),g=a,b=c["".concat(l,".").concat(g)]||c[g]||p[g]||o;return n?r.createElement(b,i(i({ref:t},s),{},{components:n})):r.createElement(b,i({ref:t},s))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=c;var m={};for(var l in t)hasOwnProperty.call(t,l)&&(m[l]=t[l]);m.originalType=e,m.mdxType="string"==typeof e?e:a,i[1]=m;for(var d=2;d<o;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},6966:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return m},metadata:function(){return d},toc:function(){return p}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],m={id:"mongodb-server-versions",title:"Mongodb Server Versions"},l=void 0,d={unversionedId:"guides/mongodb-server-versions",id:"guides/mongodb-server-versions",title:"Mongodb Server Versions",description:"This Guide will show what MongoDB Server versions are / were the default for versions of mongodb-memory-server-core and the guidelines of when a version gets changed.",source:"@site/../docs/guides/mongodb-server-versions.md",sourceDirName:"guides",slug:"/guides/mongodb-server-versions",permalink:"/mongodb-memory-server/docs/guides/mongodb-server-versions",draft:!1,editUrl:"https://github.com/nodkz/mongodb-memory-server/edit/master/docs/../docs/guides/mongodb-server-versions.md",tags:[],version:"current",frontMatter:{id:"mongodb-server-versions",title:"Mongodb Server Versions"},sidebar:"guides",previous:{title:"Details for Errors & Warnings",permalink:"/mongodb-memory-server/docs/guides/error-warning-details"},next:{title:"Migrate to version 8.0.0",permalink:"/mongodb-memory-server/docs/guides/migration/migrate8"}},s={},p=[{value:"When a Version gets upgraded",id:"when-a-version-gets-upgraded",level:2},{value:"<code>mongodb-memory-server-core</code> Version Table",id:"mongodb-memory-server-core-version-table",level:2},{value:"<code>mongodb-memory-server-global-*</code> Version Table",id:"mongodb-memory-server-global--version-table",level:2}],c={toc:p};function g(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This Guide will show what MongoDB Server versions are / were the default for versions of ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-core")," and the guidelines of when a version gets changed."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},(0,o.kt)("sub",null,"Some expressions will use ",(0,o.kt)("a",{parentName:"em",href:"https://www.npmjs.com/package/semver"},"npm's semver convention"),"."))),(0,o.kt)("h2",{id:"when-a-version-gets-upgraded"},"When a Version gets upgraded"),(0,o.kt)("p",null,"In a new major version of ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-core")," (",(0,o.kt)("inlineCode",{parentName:"p"},"X.0.0"),"), the default mongodb binary version may be upgraded to any newer version (",(0,o.kt)("inlineCode",{parentName:"p"},"X.X.X"),").",(0,o.kt)("br",{parentName:"p"}),"\n","In a minor version of ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-core")," (",(0,o.kt)("inlineCode",{parentName:"p"},"0.X.0"),"), the default mongodb binary version may be upgraded to the latest patch version ",(0,o.kt)("inlineCode",{parentName:"p"},"0.0.X"),".",(0,o.kt)("br",{parentName:"p"}),"\n","In a patch version of ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-core")," (",(0,o.kt)("inlineCode",{parentName:"p"},"0.0.X"),"), the default mongodb binary version will not be changed."),(0,o.kt)("p",null,"There are some exceptions:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"A mongodb binary may go offline (not being able to download it anymore), then the default version will be changed and a ",(0,o.kt)("em",{parentName:"li"},"minor")," (",(0,o.kt)("inlineCode",{parentName:"li"},"0.X.0"),") release will happen."),(0,o.kt)("li",{parentName:"ul"},"A mongodb binary may be broken, then the default version will be changed and a ",(0,o.kt)("em",{parentName:"li"},"minor")," (",(0,o.kt)("inlineCode",{parentName:"li"},"0.X.0"),") release will happen.")),(0,o.kt)("p",null,"The versions with a broken default binary may get deprecated (when possible)."),(0,o.kt)("p",null,"For Packages that are named with a version (like ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-global-4.2"),"), the patch version (",(0,o.kt)("inlineCode",{parentName:"p"},"0.0.X"),") of a binary may be changed with minor (",(0,o.kt)("inlineCode",{parentName:"p"},"0.X.0"),") releases."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Starting with MongoDB version 5.0, the default versions for ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-core")," will only be major ",(0,o.kt)("inlineCode",{parentName:"p"},"X.0.0")," versions (no ",(0,o.kt)("inlineCode",{parentName:"p"},"X.X.0")," versions), see ",(0,o.kt)("a",{parentName:"p",href:"https://docs.mongodb.com/manual/reference/versioning/#std-label-release-version-numbers"},"MongoDB Versioning"),"."))),(0,o.kt)("h2",{id:"mongodb-memory-server-core-version-table"},(0,o.kt)("inlineCode",{parentName:"h2"},"mongodb-memory-server-core")," Version Table"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"th"},"mongodb-memory-server-core")," Version"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Default MongoDB Version"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"8.6.x - 8.6.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"5.0.8")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"8.0.x - 8.5.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"5.0.3")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"7.5.x - 7.5.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.0.27")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"7.0.x - 7.4.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.0.25")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"6.4.x - 6.9.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.0.14")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"6.0.x - 6.4.x"),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.0.3")))),(0,o.kt)("h2",{id:"mongodb-memory-server-global--version-table"},(0,o.kt)("inlineCode",{parentName:"h2"},"mongodb-memory-server-global-*")," Version Table"),(0,o.kt)("p",null,"This Section will show all ",(0,o.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server-global-*")," packages that ever existed for this Project, what Version they provide in the latest version and what Branch they will be updated from."),(0,o.kt)("p",null,"If the branch is named like ",(0,o.kt)("inlineCode",{parentName:"p"},"old/"),", then it means that this package will not be updated for new major MMS versions anymore. (Example if the package is in ",(0,o.kt)("inlineCode",{parentName:"p"},"old/6.x"),", then it will not get any updates to MMS 7.0 or higher)"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"Package Name"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Provided MongoDB Version"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Current Branch"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"mongodb-memory-server-global-4.4")),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.4.13"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"master"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"mongodb-memory-server-global-4.2")),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.2.18"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"master"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"mongodb-memory-server-global-4.0")),(0,o.kt)("td",{parentName:"tr",align:"center"},"4.0.28"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"master"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"mongodb-memory-server-global-3.6")),(0,o.kt)("td",{parentName:"tr",align:"center"},"3.6.23"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"old/7.x"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"mongodb-memory-server-global-3.4")),(0,o.kt)("td",{parentName:"tr",align:"center"},"3.4.20"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"old/6.x"))))))}g.isMDXComponent=!0}}]);
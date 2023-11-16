"use strict";(self.webpackChunkmongodb_memory_server_website=self.webpackChunkmongodb_memory_server_website||[]).push([[917],{2360:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>t,toc:()=>a});var r=n(5893),i=n(1151);const d={id:"supported-systems",title:"Supported Systems"},o=void 0,t={id:"guides/supported-systems",title:"Supported Systems",description:"Currently Supported platforms:",source:"@site/../docs/guides/supported-systems.md",sourceDirName:"guides",slug:"/guides/supported-systems",permalink:"/mongodb-memory-server/versions/beta/docs/guides/supported-systems",draft:!1,unlisted:!1,editUrl:"https://github.com/nodkz/mongodb-memory-server/edit/master/docs/../docs/guides/supported-systems.md",tags:[],version:"current",frontMatter:{id:"supported-systems",title:"Supported Systems"},sidebar:"guides",previous:{title:"Known Issues",permalink:"/mongodb-memory-server/versions/beta/docs/guides/known-issues"},next:{title:"Integration with Test Runners",permalink:"/mongodb-memory-server/versions/beta/docs/guides/integration-examples/test-runners"}},c={},a=[{value:"Windows",id:"windows",level:2},{value:"MacOS",id:"macos",level:2},{value:"Linux",id:"linux",level:2},{value:"Ubuntu (and based on systems)",id:"ubuntu-and-based-on-systems",level:3},{value:"Debian",id:"debian",level:3},{value:"Fedora",id:"fedora",level:3},{value:"Rhel",id:"rhel",level:3},{value:"Amazon",id:"amazon",level:3},{value:"ElementaryOS",id:"elementaryos",level:3},{value:"Linux Mint",id:"linux-mint",level:3},{value:"Suse",id:"suse",level:3},{value:"Arch",id:"arch",level:3},{value:"Gentoo",id:"gentoo",level:3},{value:"Alpine",id:"alpine",level:3}];function l(e){const s={a:"a",admonition:"admonition",br:"br",code:"code",em:"em",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",ul:"ul",...(0,i.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.p,{children:"Currently Supported platforms:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"win32"})," / ",(0,r.jsx)(s.code,{children:"windows"})]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"macos"})," / ",(0,r.jsx)(s.code,{children:"osx"})," / ",(0,r.jsx)(s.code,{children:"darwin"})]}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.code,{children:"linux"})}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:"Officially Supported Architectures:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"x64"})," / ",(0,r.jsx)(s.code,{children:"x86_64"})]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"arm64"})," / ",(0,r.jsx)(s.code,{children:"aarch64"})," (only some linux distros have binaries)"]}),"\n"]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["On systems that have native arch translation (like ARM MacOS), the architecture will need to be overwritten with ",(0,r.jsx)(s.code,{children:"MONGOMS_ARCH=x64"}),"."]})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.p,{children:"Legend:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"})," means that it is supported by mongodb natively or is a distro that is based on a supported distro."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)("span",{class:"badge badge--warning",children:"Untested"})," means that it is not tested on hardware and so not verified to work."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)("span",{class:"badge badge--warning",children:"Outdated"})," means that the current mappings for MMS are outdated and may not have proper tests."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)("span",{class:"badge badge--danger",children:"Unsupported"})," means that it is unsupported by MMS ",(0,r.jsx)(s.em,{children:"and"})," mongodb."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)("span",{class:"badge badge--secondary",children:"Working"})," means that it is supported by MMS but not by mongodb natively and not based on a supported distro."]}),"\n"]}),"\n",(0,r.jsx)(s.h2,{id:"windows",children:"Windows"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsx)(s.p,{children:"Should just work out of the box"}),"\n",(0,r.jsx)(s.h2,{id:"macos",children:"MacOS"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["On x64 systems, it should work right out of the box",(0,r.jsx)("br",{}),"\nSince Mongodb 6.0.0, they have ",(0,r.jsx)(s.code,{children:"arm64"})," binaries",(0,r.jsx)("br",{}),"\nUses ",(0,r.jsx)(s.code,{children:"arm64"})," binaries for all versions above or equal to ",(0,r.jsx)(s.code,{children:"6.0.0"}),", for older versions falls back to using ",(0,r.jsx)(s.code,{children:"x86_64"})," binaries (requires Rosetta)",(0,r.jsx)("br",{}),"\nUsage of the ",(0,r.jsx)(s.code,{children:"x86_64"})," binary can be forced with ",(0,r.jsx)(s.a,{href:"/mongodb-memory-server/versions/beta/docs/api/config-options#arch",children:(0,r.jsx)(s.code,{children:"MONGOMS_ARCH=x64"})})," (or equal in ",(0,r.jsx)(s.code,{children:"package.json"}),")"]}),"\n",(0,r.jsx)(s.h2,{id:"linux",children:"Linux"}),"\n",(0,r.jsx)(s.p,{children:"Depends on the distribution, many common ones should just work right out of the box"}),"\n",(0,r.jsx)(s.h3,{id:"ubuntu-and-based-on-systems",children:"Ubuntu (and based on systems)"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"ubuntu"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"1404"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"2204"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"2204"}),(0,r.jsx)("br",{}),"\nArchitectures Supported: ",(0,r.jsx)(s.code,{children:"x86_64"}),", ",(0,r.jsx)(s.code,{children:"arm64"}),"(",(0,r.jsx)(s.code,{children:"aarch64"}),")"]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["Lower Versions than ",(0,r.jsx)(s.code,{children:"2004"})," may be used if mongodb dosnt provide binaries for an lower version of mongodb for an higher version of ubuntu"]})}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["Since Mongodb ",(0,r.jsx)(s.code,{children:"6.0.4"})," there are binaries for ",(0,r.jsx)(s.code,{children:"2204"}),", any version before is mapped to ",(0,r.jsx)(s.code,{children:"2204"})," (or earlier) and will require ",(0,r.jsx)(s.code,{children:"libssl1.1"})," to be installed.",(0,r.jsx)(s.br,{}),"\n","See ",(0,r.jsx)(s.a,{href:"https://jira.mongodb.org/browse/SERVER-62300",children:"this mongodb issue"}),"."]})}),"\n",(0,r.jsx)(s.h3,{id:"debian",children:"Debian"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"debian"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"71"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"11"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"10"})," (when in ",(0,r.jsx)(s.code,{children:"unstable"})," or ",(0,r.jsx)(s.code,{children:"testing"}),", otherwise none)"]}),"\n",(0,r.jsx)(s.h3,{id:"fedora",children:"Fedora"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"rhel"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"6"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"36"})," (see note)",(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"34"})," (when above or equal to ",(0,r.jsx)(s.code,{children:"34"}),", otherwise none)"]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["Fedora 36 and onwards dont ship openssl1.1 anymore by default and currently needs to be manually installed.",(0,r.jsx)(s.br,{}),"\n","There are currently no newer mongodb builds that support the newer provided openssl."]})}),"\n",(0,r.jsx)(s.h3,{id:"rhel",children:"Rhel"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Untested"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"rhel"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"5"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"9"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"70"}),(0,r.jsx)("br",{}),"\nArchitectures Supported: ",(0,r.jsx)(s.code,{children:"x86_64"}),", ",(0,r.jsx)(s.code,{children:"arm64"}),"(",(0,r.jsx)(s.code,{children:"aarch64"}),")"]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"arm64"}),"/",(0,r.jsx)(s.code,{children:"aarch64"})," support is only for Rhel 8.2 & mongodb 4.4.2 or Rhel 9 & mongodb 6.0.7"]})}),"\n",(0,r.jsx)(s.h3,{id:"amazon",children:"Amazon"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"amazon"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"1"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"2"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"1"})]}),"\n",(0,r.jsx)(s.h3,{id:"elementaryos",children:"ElementaryOS"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Untested"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Outdated"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"ubuntu"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"3"})," (or ",(0,r.jsx)(s.code,{children:"0.3"}),")",(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"6"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"6"})]}),"\n",(0,r.jsx)(s.h3,{id:"linux-mint",children:"Linux Mint"}),"\n",(0,r.jsx)("span",{class:"badge badge--success",children:"Supported"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"ubuntu"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"17"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"20"}),(0,r.jsx)("br",{}),"\nDefault version is ",(0,r.jsx)(s.code,{children:"20"})]}),"\n",(0,r.jsx)(s.h3,{id:"suse",children:"Suse"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Untested"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Outdated"}),"\n",(0,r.jsxs)(s.p,{children:["(uses mongodb's ",(0,r.jsx)(s.code,{children:"suse"})," release)",(0,r.jsx)("br",{}),"\nLowest supported Distribution version is ",(0,r.jsx)(s.code,{children:"11"}),(0,r.jsx)("br",{}),"\nHighest version is ",(0,r.jsx)(s.code,{children:"12"}),(0,r.jsx)("br",{}),"\nDefault version is none"]}),"\n",(0,r.jsx)(s.h3,{id:"arch",children:"Arch"}),"\n",(0,r.jsx)("span",{class:"badge badge--danger",children:"Unsupported"}),"\n",(0,r.jsx)("span",{class:"badge badge--secondary",children:"Working"}),"\n",(0,r.jsxs)(s.p,{children:["There are no official mongodb builds for Arch Distributions, but the ",(0,r.jsx)(s.code,{children:"ubuntu"})," binaries work on most Arch systems, so they are used.",(0,r.jsx)("br",{}),"\nCurrently Mapping to: ",(0,r.jsx)(s.code,{children:"ubuntu2204"})]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["Because Arch* dosnt base on ubuntu, there is no specific ubuntu version associated with an arch version, so it defaults to highest supported ",(0,r.jsx)(s.code,{children:"ubuntu"})," version"]})}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["MongoDB Binary versions before ",(0,r.jsx)(s.code,{children:"6.0.4"})," require OpenSSL 1.1 installed, on arch can be installed via ",(0,r.jsx)(s.code,{children:"core/openssl-1.1"}),"."]})}),"\n",(0,r.jsx)(s.h3,{id:"gentoo",children:"Gentoo"}),"\n",(0,r.jsx)("span",{class:"badge badge--danger",children:"Unsupported"}),"\n",(0,r.jsx)("span",{class:"badge badge--secondary",children:"Working"}),"\n",(0,r.jsxs)(s.p,{children:["There are no official mongodb builds for Gentoo Distributions, but the ",(0,r.jsx)(s.code,{children:"debian"})," binaries work on most Gentoo systems, so they are used.",(0,r.jsx)("br",{}),"\nCurrently Mapping to: ",(0,r.jsx)(s.code,{children:"debain11"})]}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["Because Gentoo dosnt base on debian, there is no specific debian version associated with an gentoo version, so it defaults to highest supported ",(0,r.jsx)(s.code,{children:"debian"})," version"]})}),"\n",(0,r.jsx)(s.h3,{id:"alpine",children:"Alpine"}),"\n",(0,r.jsx)("span",{class:"badge badge--danger",children:"Unsupported"}),"\n",(0,r.jsx)(s.p,{children:"There are no official mongodb builds alpine, though there are some unoffical build of mongodb build for it which can be used"})]})}function h(e={}){const{wrapper:s}={...(0,i.a)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},1151:(e,s,n)=>{n.d(s,{Z:()=>t,a:()=>o});var r=n(7294);const i={},d=r.createContext(i);function o(e){const s=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(d.Provider,{value:s},e.children)}}}]);
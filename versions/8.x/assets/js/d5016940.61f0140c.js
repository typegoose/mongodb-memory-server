"use strict";(self.webpackChunkmongodb_memory_server_website=self.webpackChunkmongodb_memory_server_website||[]).push([[416],{3905:function(e,n,t){t.d(n,{Zo:function(){return m},kt:function(){return g}});var o=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=o.createContext({}),c=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},m=function(e){var n=c(e.components);return o.createElement(l.Provider,{value:n},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},d=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),p=c(t),d=r,g=p["".concat(l,".").concat(d)]||p[d]||u[d]||a;return t?o.createElement(g,s(s({ref:n},m),{},{components:t})):o.createElement(g,s({ref:n},m))}));function g(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,s=new Array(a);s[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i[p]="string"==typeof e?e:r,s[1]=i;for(var c=2;c<a;c++)s[c]=t[c];return o.createElement.apply(null,s)}return o.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8957:function(e,n,t){t.r(n),t.d(n,{assets:function(){return m},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return p}});var o=t(7462),r=t(3366),a=(t(7294),t(3905)),s=["components"],i={id:"test-runners",title:"Integration with Test Runners"},l=void 0,c={unversionedId:"guides/integration-examples/test-runners",id:"guides/integration-examples/test-runners",title:"Integration with Test Runners",description:"This Guide will show how mongodb-memory-server can be used with different frameworks",source:"@site/../docs/guides/integration-examples/test-runners.md",sourceDirName:"guides/integration-examples",slug:"/guides/integration-examples/test-runners",permalink:"/mongodb-memory-server/versions/8.x/docs/guides/integration-examples/test-runners",draft:!1,editUrl:"https://github.com/nodkz/mongodb-memory-server/edit/master/docs/../docs/guides/integration-examples/test-runners.md",tags:[],version:"current",frontMatter:{id:"test-runners",title:"Integration with Test Runners"},sidebar:"guides",previous:{title:"Supported Systems",permalink:"/mongodb-memory-server/versions/8.x/docs/guides/supported-systems"},next:{title:"Integration with Docker",permalink:"/mongodb-memory-server/versions/8.x/docs/guides/integration-examples/docker"}},m={},p=[{value:"jest",id:"jest",level:2},{value:"mocha / chai",id:"mocha--chai",level:2},{value:"AVA test runner",id:"ava-test-runner",level:2}],u={toc:p},d="wrapper";function g(e){var n=e.components,t=(0,r.Z)(e,s);return(0,a.kt)(d,(0,o.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This Guide will show how ",(0,a.kt)("inlineCode",{parentName:"p"},"mongodb-memory-server")," can be used with different frameworks"),(0,a.kt)("h2",{id:"jest"},"jest"),(0,a.kt)("span",{class:"badge badge--secondary"},"jest version 29"),(0,a.kt)("p",null,"For usage with ",(0,a.kt)("inlineCode",{parentName:"p"},"jest")," it is recommended to use the ",(0,a.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/configuration#globalsetup-string"},(0,a.kt)("inlineCode",{parentName:"a"},"globalSetup"))," and ",(0,a.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/configuration#globalteardown-string"},(0,a.kt)("inlineCode",{parentName:"a"},"globalTeardown"))," options"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"config.ts"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"// this file could be anything (like a json directly imported)\n\nexport = {\n  Memory: true,\n  IP: '127.0.0.1',\n  Port: '27017',\n  Database: 'somedb'\n}\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"jest.config.json"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'{\n  "preset": "ts-jest",\n  "globalSetup": "<rootDir>/test/globalSetup.ts",\n  "globalTeardown": "<rootDir>/test/globalTeardown.ts",\n  "setupFilesAfterEnv": [\n    "<rootDir>/test/setupFile.ts"\n  ]\n}\n\n')),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"globalSetup.ts"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { MongoMemoryServer } from 'mongodb-memory-server';\nimport * as mongoose from 'mongoose';\nimport { config } from './utils/config';\n\nexport = async function globalSetup() {\n  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used\n    // it's needed in global space, because we don't want to create a new instance every test-suite\n    const instance = await MongoMemoryServer.create();\n    const uri = instance.getUri();\n    (global as any).__MONGOINSTANCE = instance;\n    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));\n  } else {\n    process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}`;\n  }\n\n  // The following is to make sure the database is clean before an test starts\n  await mongoose.connect(`${process.env.MONGO_URI}/${config.Database}`);\n  await mongoose.connection.db.dropDatabase();\n  await mongoose.disconnect();\n};\n\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"globalTeardown.ts"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { MongoMemoryServer } from 'mongodb-memory-server';\nimport { config } from './utils/config';\n\nexport = async function globalTeardown() {\n  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used\n    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;\n    await instance.stop();\n  }\n};\n")),(0,a.kt)("p",null,"and an ",(0,a.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/configuration#setupfilesafterenv-array"},(0,a.kt)("inlineCode",{parentName:"a"},"setupFilesAfterEnv"))," can be used to connect something like ",(0,a.kt)("inlineCode",{parentName:"p"},"mongoose")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"mongodb")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"setupFile.ts"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"beforeAll(async () => {\n  // put your client connection code here, example with mongoose:\n  await mongoose.connect(process.env['MONGO_URI']);\n});\n\nafterAll(async () => {\n  // put your client disconnection code here, example with mongodb:\n  await mongoose.disconnect();\n});\n")),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"It is very important to limit the spawned number of Jest workers on machines that have many cores, because otherwise the tests may run slower than with fewer workers, because the database instance(s) may be hit very hard.",(0,a.kt)("br",{parentName:"p"}),"\n","Use either ",(0,a.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/configuration#maxworkers-number--string"},(0,a.kt)("inlineCode",{parentName:"a"},"--maxWorkers 4"))," or ",(0,a.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/cli#--runinband"},(0,a.kt)("inlineCode",{parentName:"a"},"--runInBand"))," to limit the workers.")),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"Keep in mind that jest's global-setup and global-teardown do ",(0,a.kt)("strong",{parentName:"p"},"not")," share a environment with the tests themself, and so require ",(0,a.kt)("inlineCode",{parentName:"p"},"setupFile")," / ",(0,a.kt)("inlineCode",{parentName:"p"},"setupFilesAfterEnv")," to actually connect.")),(0,a.kt)("h2",{id:"mocha--chai"},"mocha / chai"),(0,a.kt)("span",{class:"badge badge--secondary"},"mocha version (unknown)"),(0,a.kt)("p",null,"Start Mocha with ",(0,a.kt)("inlineCode",{parentName:"p"},"--timeout 60000")," cause first download of MongoDB binaries may take a time."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import mongoose from 'mongoose';\nimport { MongoMemoryServer } from 'mongodb-memory-server';\n\nlet mongoServer;\nconst opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above\n\nbefore(async () => {\n  mongoServer = await MongoMemoryServer.create();\n  const mongoUri = mongoServer.getUri();\n  await mongoose.connect(mongoUri, opts);\n});\n\nafter(async () => {\n  await mongoose.disconnect();\n  await mongoServer.stop();\n});\n\ndescribe('...', () => {\n  it('...', async () => {\n    const User = mongoose.model('User', new mongoose.Schema({ name: String }));\n    const cnt = await User.count();\n    expect(cnt).to.equal(0);\n  });\n});\n")),(0,a.kt)("h2",{id:"ava-test-runner"},"AVA test runner"),(0,a.kt)("p",null,"For AVA written ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/zellwk/ava/blob/8b7ccba1d80258b272ae7cae6ba4967cd1c13030/docs/recipes/endpoint-testing-with-mongoose.md"},"detailed tutorial")," how to test mongoose models by @zellwk."),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"Note that this mentioned tutorial is pre 7.x")))}g.isMDXComponent=!0}}]);
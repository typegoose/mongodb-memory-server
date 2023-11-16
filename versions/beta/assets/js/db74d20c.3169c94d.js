"use strict";(self.webpackChunkmongodb_memory_server_website=self.webpackChunkmongodb_memory_server_website||[]).push([[1176],{9611:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>l,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var r=s(5893),t=s(1151);const i={id:"mongo-memory-replset",title:"MongoMemoryReplSet"},l=void 0,o={id:"api/classes/mongo-memory-replset",title:"MongoMemoryReplSet",description:"API Documentation of MongoMemoryReplSet-Class",source:"@site/../docs/api/classes/mongo-memory-replset.md",sourceDirName:"api/classes",slug:"/api/classes/mongo-memory-replset",permalink:"/mongodb-memory-server/versions/beta/docs/api/classes/mongo-memory-replset",draft:!1,unlisted:!1,editUrl:"https://github.com/nodkz/mongodb-memory-server/edit/master/docs/../docs/api/classes/mongo-memory-replset.md",tags:[],version:"current",frontMatter:{id:"mongo-memory-replset",title:"MongoMemoryReplSet"},sidebar:"api",previous:{title:"MongoMemoryServer",permalink:"/mongodb-memory-server/versions/beta/docs/api/classes/mongo-memory-server"},next:{title:"MongoInstance",permalink:"/mongodb-memory-server/versions/beta/docs/api/classes/mongo-instance"}},a={},d=[{value:"Functions",id:"functions",level:2},{value:"new",id:"new",level:3},{value:"create",id:"create",level:3},{value:"stateChange",id:"statechange",level:3},{value:"getInstanceOpts",id:"getinstanceopts",level:3},{value:"getUri",id:"geturi",level:3},{value:"start",id:"start",level:3},{value:"initAllServers",id:"initallservers",level:3},{value:"ensureKeyFile",id:"ensurekeyfile",level:3},{value:"stop",id:"stop",level:3},{value:"cleanup",id:"cleanup",level:3},{value:"waitUntilRunning",id:"waituntilrunning",level:3},{value:"_initReplSet",id:"_initreplset",level:3},{value:"_initServer",id:"_initserver",level:3},{value:"_waitForPrimary",id:"_waitforprimary",level:3},{value:"Values",id:"values",level:2},{value:"servers",id:"servers",level:3},{value:"instanceOpts",id:"instanceopts",level:3},{value:"_instanceOpts",id:"_instanceopts",level:3},{value:"binaryOpts",id:"binaryopts",level:3},{value:"_binaryOpts",id:"_binaryopts",level:3},{value:"replSetOpts",id:"replsetopts",level:3},{value:"_replSetOpts",id:"_replsetopts",level:3},{value:"_keyfiletmp",id:"_keyfiletmp",level:3},{value:"state",id:"state",level:3},{value:"_state",id:"_state",level:3},{value:"_ranCreateAuth",id:"_rancreateauth",level:3}];function c(e){const n={a:"a",admonition:"admonition",br:"br",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["API Documentation of ",(0,r.jsx)(n.code,{children:"MongoMemoryReplSet"}),"-Class"]}),"\n",(0,r.jsx)(n.h2,{id:"functions",children:"Functions"}),"\n",(0,r.jsx)(n.h3,{id:"new",children:"new"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"constructor(opts: Partial<MongoMemoryReplSetOpts> = {})"})]}),"\n",(0,r.jsx)(n.p,{children:"Create an new ReplSet without starting it"}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["When directly starting the replset, ",(0,r.jsx)(n.a,{href:"#create",children:(0,r.jsx)(n.code,{children:"create"})})," should be used"]})}),"\n",(0,r.jsx)(n.h3,{id:"create",children:"create"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"static async create(opts?: Partial<MongoMemoryReplSetOpts>): Promise<MongoMemoryReplSet>"})]}),"\n",(0,r.jsx)(n.p,{children:"Create an new ReplSet and start it (while being an Promise)"}),"\n",(0,r.jsx)(n.h3,{id:"statechange",children:"stateChange"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected stateChange(newState: MongoMemoryReplSetStates, ...args: any[]): void"})]}),"\n",(0,r.jsxs)(n.p,{children:["Used to change the state of the class, uses ",(0,r.jsxs)(n.a,{href:"/mongodb-memory-server/versions/beta/docs/api/enums/mongo-memory-replset-states",children:[(0,r.jsx)(n.code,{children:"MongoMemoryReplSetStates"})," enum"]}),", it is ",(0,r.jsx)(n.code,{children:"protected"})," to not accidentally use it"]}),"\n",(0,r.jsx)(n.h3,{id:"getinstanceopts",children:"getInstanceOpts"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected getInstanceOpts(baseOpts: MongoMemoryInstancePropBase = {}): MongoMemoryInstanceProp"})]}),"\n",(0,r.jsx)(n.p,{children:"Constructs the options used for an instance"}),"\n",(0,r.jsx)(n.h3,{id:"geturi",children:"getUri"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"getUri(otherDb?: string): string"})]}),"\n",(0,r.jsx)(n.p,{children:"Get an mongodb-usable uri (can also be used in mongoose)"}),"\n",(0,r.jsxs)(n.p,{children:["When no arguments are set, the URI will always use ip ",(0,r.jsx)(n.code,{children:"127.0.0.1"})," and end with ",(0,r.jsx)(n.code,{children:"/?replicaSet=ReplSetName"})," (not setting a database).",(0,r.jsx)(n.br,{}),"\n","When setting ",(0,r.jsx)(n.code,{children:"otherDbName"}),", the value of ",(0,r.jsx)(n.code,{children:"otherDbName"})," will be appended after ",(0,r.jsx)(n.code,{children:"/"})," and before any query arguments.",(0,r.jsx)(n.br,{}),"\n","When setting ",(0,r.jsx)(n.code,{children:"otherIp"}),", the ip will be the value of ",(0,r.jsx)(n.code,{children:"otherIp"})," instead of ",(0,r.jsx)(n.code,{children:"127.0.0.1"})," (for all instances)."]}),"\n",(0,r.jsx)(n.h3,{id:"start",children:"start"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"async start(): Promise<void>"})]}),"\n",(0,r.jsx)(n.p,{children:"Used to start an new ReplSet or to Re-Start an stopped ReplSet"}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsx)(n.p,{children:"Will Error if ReplSet is already running"})}),"\n",(0,r.jsx)(n.h3,{id:"initallservers",children:"initAllServers"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected async initAllServers(): Promise<void>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Used by ",(0,r.jsx)(n.a,{href:"#start",children:(0,r.jsx)(n.code,{children:"start"})})," and to restart without fully running everything again"]}),"\n",(0,r.jsx)(n.h3,{id:"ensurekeyfile",children:"ensureKeyFile"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected async ensureKeyFile(): Promise<string>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Ensures and returns that ",(0,r.jsx)(n.a,{href:"#_keyfiletmp",children:(0,r.jsx)(n.code,{children:"_keyfiletmp"})})," is defined an exists and also that the keyfile is created"]}),"\n",(0,r.jsx)(n.h3,{id:"stop",children:"stop"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"async stop(cleanupOptions?: Cleanup): Promise<boolean>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Stop an running instance, this function will by default call ",(0,r.jsx)(n.a,{href:"#cleanup",children:(0,r.jsx)(n.code,{children:".cleanup"})})," with ",(0,r.jsx)(n.code,{children:"{ doCleanup: true, force: false }"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["With ",(0,r.jsx)(n.code,{children:"cleanupOptions"})," options for cleanup can be manually set."]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsx)(n.p,{children:"Will not Error if instance is not running"})}),"\n",(0,r.jsx)(n.h3,{id:"cleanup",children:"cleanup"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"async cleanup(options?: Cleanup): Promise<void>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Cleanup all files used by this ReplSet's instances, by default ",(0,r.jsx)(n.code,{children:"{ doCleanup: true, force: false }"})," is used."]}),"\n",(0,r.jsxs)(n.p,{children:["With ",(0,r.jsx)(n.code,{children:"options"})," can be set how to run a cleanup."]}),"\n",(0,r.jsx)(n.h3,{id:"waituntilrunning",children:"waitUntilRunning"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"async waitUntilRunning(): Promise<void>"})]}),"\n",(0,r.jsx)(n.p,{children:"Wait until all instances are running."}),"\n",(0,r.jsxs)(n.p,{children:["It is recommended to ",(0,r.jsx)(n.code,{children:"await"})," the promise returned from ",(0,r.jsx)(n.code,{children:"start"})," when available."]}),"\n",(0,r.jsxs)(n.p,{children:["Does not start the replset instance if not already starting (unlike ",(0,r.jsx)(n.a,{href:"/mongodb-memory-server/versions/beta/docs/api/classes/mongo-memory-server#ensureinstance",children:(0,r.jsx)(n.code,{children:"ensureInstance"})}),")."]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will Error if state is not ",(0,r.jsx)(n.code,{children:"running"})," or ",(0,r.jsx)(n.code,{children:"init"}),"."]})}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will ",(0,r.jsx)(n.strong,{children:"not"})," Error if a error is encountered while waiting."]})}),"\n",(0,r.jsx)(n.h3,{id:"_initreplset",children:"_initReplSet"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected async _initReplSet(): Promise<void>"})]}),"\n",(0,r.jsxs)(n.p,{children:["This is used to connect to the first server and initiate the ReplSet with an command",(0,r.jsx)("br",{}),"\nAlso enables ",(0,r.jsx)(n.code,{children:"auth"})]}),"\n",(0,r.jsx)(n.h3,{id:"_initserver",children:"_initServer"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _initServer(instanceOpts: MongoMemoryInstanceProp): MongoMemoryServer"})]}),"\n",(0,r.jsxs)(n.p,{children:["Creates an new ",(0,r.jsx)(n.a,{href:"/mongodb-memory-server/versions/beta/docs/api/classes/mongo-memory-server",children:(0,r.jsx)(n.code,{children:"instance"})})," for the ReplSet"]}),"\n",(0,r.jsx)(n.h3,{id:"_waitforprimary",children:"_waitForPrimary"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected async _waitForPrimary(timeout: number = 1000 * 30, where?: string): Promise<void>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Wait until the ReplSet has elected an Primary, the ",(0,r.jsx)(n.code,{children:"where"})," string will be added to the error if the timeout is reached"]}),"\n",(0,r.jsx)(n.h2,{id:"values",children:"Values"}),"\n",(0,r.jsx)(n.h3,{id:"servers",children:"servers"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"servers: MongoMemoryServer[]"})]}),"\n",(0,r.jsx)(n.p,{children:"Stores all the servers of this ReplSet"}),"\n",(0,r.jsx)(n.h3,{id:"instanceopts",children:"instanceOpts"}),"\n",(0,r.jsx)(n.p,{children:"Typings:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"get instanceOpts(): MongoMemoryInstancePropBase[]"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"set instanceOpts(val: MongoMemoryInstancePropBase[])"})}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Getter & Setter for ",(0,r.jsx)(n.a,{href:"#_instanceopts",children:(0,r.jsx)(n.code,{children:"_instanceOpts"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will Throw an Error if ",(0,r.jsx)(n.code,{children:"state"})," is not ",(0,r.jsx)(n.code,{children:"stopped"})]})}),"\n",(0,r.jsx)(n.h3,{id:"_instanceopts",children:"_instanceOpts"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _instanceOpts!: MongoMemoryInstancePropBase[]"})]}),"\n",(0,r.jsx)(n.p,{children:"Stores Options used for an instance"}),"\n",(0,r.jsx)(n.h3,{id:"binaryopts",children:"binaryOpts"}),"\n",(0,r.jsx)(n.p,{children:"Typings:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"get binaryOpts(): MongoBinaryOpts"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"set binaryOpts(val: MongoBinaryOpts)"})}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Getter & Setter for ",(0,r.jsx)(n.a,{href:"#_binaryopts",children:(0,r.jsx)(n.code,{children:"_binaryOpts"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will Throw an Error if ",(0,r.jsx)(n.code,{children:"state"})," is not ",(0,r.jsx)(n.code,{children:"stopped"})]})}),"\n",(0,r.jsx)(n.h3,{id:"_binaryopts",children:"_binaryOpts"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _binaryOpts!: MongoBinaryOpts"})]}),"\n",(0,r.jsx)(n.p,{children:"Stores the options used for the binary"}),"\n",(0,r.jsx)(n.h3,{id:"replsetopts",children:"replSetOpts"}),"\n",(0,r.jsx)(n.p,{children:"Typings:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"get replSetOpts(): ReplSetOpts"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"set replSetOpts(val: ReplSetOpts)"})}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Getter & Setter for ",(0,r.jsx)(n.a,{href:"#_replsetopts",children:(0,r.jsx)(n.code,{children:"_replSetOpts"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will Throw an Error if ",(0,r.jsx)(n.code,{children:"state"})," is not ",(0,r.jsx)(n.code,{children:"stopped"})]})}),"\n",(0,r.jsx)(n.h3,{id:"_replsetopts",children:"_replSetOpts"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _replSetOpts!: Required<ReplSetOpts>"})]}),"\n",(0,r.jsxs)(n.p,{children:["Stores the options used for the ReplSet Initiation, uses ",(0,r.jsx)(n.a,{href:"/mongodb-memory-server/versions/beta/docs/api/interfaces/replset-opts",children:(0,r.jsx)(n.code,{children:"ReplSetOpts"})}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"_keyfiletmp",children:"_keyfiletmp"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _keyfiletmp?: string"})]}),"\n",(0,r.jsx)(n.p,{children:"Stores the path of the created temporary directory for the keyfile location"}),"\n",(0,r.jsx)(n.h3,{id:"state",children:"state"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"get state(): MongoMemoryReplSetStates"})]}),"\n",(0,r.jsxs)(n.p,{children:["Getter for ",(0,r.jsx)(n.a,{href:"#_state",children:(0,r.jsx)(n.code,{children:"_state"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"caution",children:(0,r.jsxs)(n.p,{children:["Will Throw an Error if ",(0,r.jsx)(n.code,{children:"state"})," is not ",(0,r.jsx)(n.code,{children:"stopped"})]})}),"\n",(0,r.jsx)(n.h3,{id:"_state",children:"_state"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _state: MongoMemoryReplSetStates"})]}),"\n",(0,r.jsxs)(n.p,{children:["Stores the current State, uses ",(0,r.jsxs)(n.a,{href:"/mongodb-memory-server/versions/beta/docs/api/enums/mongo-memory-replset-states",children:[(0,r.jsx)(n.code,{children:"MongoMemoryReplSetStates"})," enum"]}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"_rancreateauth",children:"_ranCreateAuth"}),"\n",(0,r.jsx)("span",{class:"badge badge--warning",children:"Internal"}),"\n",(0,r.jsxs)(n.p,{children:["Typings: ",(0,r.jsx)(n.code,{children:"protected _ranCreateAuth: boolean"})]}),"\n",(0,r.jsx)(n.p,{children:"Stores if the auth creation has already ran"})]})}function p(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>o,a:()=>l});var r=s(7294);const t={},i=r.createContext(t);function l(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);
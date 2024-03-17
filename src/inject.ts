import fs from 'fs'

export default class Inject{
  static index?:string=undefined
  static indexFile?:string=undefined

  static getIndexFile(opt:{dir:string}){
    const architecture=["/src/app/layout.tsx","/src/app/layout.jsx","/src/app/layout.ts","/src/app/layout.js","/app/layout.tsx","/app/layout.jsx","/app/layout.ts","/app/layout.js",
      "/src/pages/_document.tsx","/src/pages/_document.jsx","/src/pages/_document.ts","/src/pages/_document.js","/pages/_document.tsx","/pages/_document.jsx","/pages/_document.ts","/pages/_document.js"]
    
    let indexFile=''
    for(let i=0;i<architecture.length;i++){
      if(fs.existsSync(opt.dir+architecture[i])){
        indexFile=opt.dir+architecture[i]
        break
      }
    }
    return indexFile
  }

  static injectScript(opt:{dir:string},port:number){
    this.indexFile=this.getIndexFile(opt)
    this.index=fs.readFileSync(this.indexFile,'utf-8')

    if(!/next-live-reload\/ws.js/.test(this.index)){
      let tab=(/\n(.*)<\/body>/.exec(this.index) as RegExpExecArray)[1],
      modIndex=this.index.replace('</body>',` <script type="javascript" src="/next-live-reload/ws.js"></script>\n${tab}</body>`)
      fs.writeFileSync(this.indexFile,modIndex)
      fs.mkdirSync(opt.dir+'/public/next-live-reload')
    }

    if(!fs.existsSync(opt.dir+'/public/next-live-relaod')){
      const ws=`window.addEventListener('load',()=>{
  let ws= new WebSocket('ws://localhost:'+${port})
  ws.onmessage=(e)=>{
    if(e.data=='reload'){
      window.location.reload()
    }
  }
})`
      fs.writeFileSync(opt.dir+'/public/next-live-reload/ws.js',ws)
    }
  }

  static restore(opt:{dir:string}){
    if(this.index && this.indexFile){
      fs.writeFileSync(this.indexFile,this.index)
      fs.rmdirSync(opt.dir+'/public/next-live-reload')
    }
  }
}
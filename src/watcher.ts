import ws from 'ws'
import chokidar from 'chokidar'

export default class Watcher{
  static wss?:ws.Server
  static watcher?:chokidar.FSWatcher

  static run(files:string[],ignored:string[]=[],opt:{dir:string}){
    let port=1000*(Math.floor(Math.random()*6+3))+100*(Math.floor(Math.random()*9))
      +10*(Math.floor(Math.random()*9))+Math.floor(Math.random()*9),
      _files=[],_ignored=[]
    for(let i=0;i<files.length;i++){
      _files.push(opt.dir+files[i])
    }
    for(let i=0;i<ignored.length;i++){
      _ignored.push(opt.dir+ignored[i])
    }

    this.wss=new ws.Server({port})
    this.watcher=chokidar.watch(_files,{
      ignored:_ignored,
      persistent:true,
      interval:1000
    })
    this.wss.on('connection',ws=>{
      ws.on('error',console.error)
      this.watcher?.on('change',()=>{
        ws.send('reload')
      })
    })
    return port
  }

  static close(){
    this.wss?.close()
    this.watcher?.close()
  }
}
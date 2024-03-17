import Inject from "./inject"
import Watcher from "./watcher"

/**
 * @class
 * @classdesc
 */
module.exports= class NextLiveReload{
  files:string[]
  ignored:string[]
  opt:{dir:string}
  /**
   * 
   * @param {string[]} files List of files to watch
   * @param {string[]} ignored List of files to ignore
   * @param {WebpackConfigContext} opt
   */
  constructor(files:string[],opt:{dir:string},ignored:string[]=[]){
    this.files=files
    this.ignored=ignored
    this.opt=opt
  }

  apply(compiler:any){
    compiler.hooks.beforeCompile.tap('Refresh',()=>{
      if(!process.env.NEXT_LIVE_RELOAD){
        let port=Watcher.run(this.files,this.ignored,this.opt)
        Inject.injectScript(this.opt,port)
        process.env.NEXT_LIVE_RELOAD='compiled'
        process.on('exit',()=>{
          Watcher.close()
          Inject.restore(this.opt)
          console.log('\x1b[1;33mNext Live Reload stopped\x1b[0m')
        })
      }
    })
  }
}
export function getConsumerOrigin(consumer:any, line:number, column:number){
  return new Promise(resolve => {
    const origin = consumer.originalPositionFor({
      source: './',
      line, 
      column
    })
    resolve(origin)
  })
}
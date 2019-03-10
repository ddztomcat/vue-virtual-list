function generateText() {
  let s = '是的活佛阿旺回复哦啊我护法还无法八王坟'
  let p = ''
  let kid = ~~(Math.random() * 30)
  for(let i = 0; i < kid; i++) {
    p += s
  }
  return p
}
export {generateText}
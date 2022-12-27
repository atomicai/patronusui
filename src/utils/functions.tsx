export function downloadAsFile(data: any, filename: string) {
  const a = document.createElement('a')
  const file = new Blob([data], { type: 'application/json' })
  a.href = URL.createObjectURL(file)
  a.download = filename
  a.click()
}

export function highlightWords(
  str: string,
  indexArray: number[],
  isHighlighted: boolean
) {
  const spanArray: any = []
  const strArray = str.split(' ')
  const punctuationless = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  const contextArray = punctuationless.replace(/\s{2,}/g, ' ').split(' ')

  contextArray.forEach((item, index) => {
    if (indexArray.includes(index)) {
      spanArray.push({
        word: strArray[index],
        highlight: `${isHighlighted ? 'cyan' : 'white'}`,
        shadow: `${
          isHighlighted ? '0 0 7px cyan,0 0 10px cyan, 0 0 21px cyan' : 'none'
        }`
      })
    } else {
      spanArray.push({
        word: strArray[index],
        highlight: `${isHighlighted ? 'gray' : 'white'}`
      })
    }
  })

  return spanArray
}

export function highlightAnswerWords(
  context: any,
  answer: any,
  indexArray: any,
  isHighlighted: boolean
) {
  const contextArray = context.split(' ')

  const wordsArray: any = []
  const spanArray: any = []
  const answerDirtyArray = answer.split(' ')

  indexArray.forEach((item: any) => {
    wordsArray.push(contextArray[item])
  })

  const punctuationless = answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  const answerArray = punctuationless.replace(/\s{2,}/g, ' ').split(' ')
  console.log(answerArray)
  answerArray.forEach((item: any, index: any) => {
    if (wordsArray.includes(item)) {
      spanArray.push({
        word: answerDirtyArray[index],
        highlight: `${isHighlighted ? 'cyan' : 'white'}`,
        shadow: `${
          isHighlighted ? '0 0 7px cyan,0 0 10px cyan, 0 0 21px cyan' : 'none'
        }`
      })
    } else {
      spanArray.push({
        word: answerDirtyArray[index],
        highlight: `${isHighlighted ? 'gray' : 'white'}`
      })
    }
  })
  // console.log(spanArray);

  return spanArray
}

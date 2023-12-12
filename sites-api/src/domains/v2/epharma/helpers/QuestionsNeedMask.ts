import { IEpharmaQuestionsNeedMask } from '../../../../adapters/interfaces/epharma'


const questions: IEpharmaQuestionsNeedMask[] = [
  {
    name: 'Question_Responsible_Document',
    type: 'text',
    mask: '999.999.999.99'
  },
  {
    name: 'Question_Responsible_Birth_Date',
    type: 'text',
    mask: '99/99/9999'
  }
]

export function questionNeedMask(name: string) {

  return questions.find(question => question.name === name)
}

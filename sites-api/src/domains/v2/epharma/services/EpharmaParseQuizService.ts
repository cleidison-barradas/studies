import { RegisterQuiz, RequestRegisterMemberQuiz } from '../../../../adapters/interfaces/epharma'

interface RequestEpharmaParseQuizServiceDTO {
  quiz: Record<string, any>
  defaultQuiz: RegisterQuiz[]
}

class EpharmaParseQuizService {
  constructor(private repository?: any) { }

  public parserQuiz({ quiz, defaultQuiz = [] }: RequestEpharmaParseQuizServiceDTO) {
    const parsed: RequestRegisterMemberQuiz[] = []

    defaultQuiz.forEach(_defaultQuiz => {
      const id = _defaultQuiz.id
      const skuId = _defaultQuiz.drugs.map(d => d.skuId)
      const configurationId = _defaultQuiz.configurationId

      const questions = _defaultQuiz.questions.map(question => {
        const questionFieldName = `${question.questionAlias}_${question.id}`

        let value = quiz[questionFieldName]

        if (question.questionAlias === 'Question_Responsible_Document') {
          value = String(value).replace(/[\W_]+/g, '')
        }

        return {
          id: question.id,
          value
        }
      })

      parsed.push({
        id,
        skuId,
        questions,
        configurationId,
      })
    })

    return parsed
  }
}

export default EpharmaParseQuizService

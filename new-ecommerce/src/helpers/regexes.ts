export const PASSWORD_REGEX = new RegExp(
  /(?=.*\d{2,})(?=.*[A-Z])(?=.*[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]+)[0-9a-zA-Z `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]{8,}/,
  'g'
)

export const TWO_DIGIT_REQUIRED = new RegExp(/(?=.*\d{2,})/, 'g')

export const UPPERLETTER_REQUIRED = new RegExp(/(?=.*[A-Z])/, 'g')

export const SPECIAL_CHARACTER_REQUIRED = new RegExp(
  /(?=.*[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]+)/,
  'g'
)

export const TWO_WORDS_REQUIRED = new RegExp(/[a-zA-Z]+\s+[a-zA-Z]+/, 'g')

export const CEP_VALIDATION = new RegExp(/^[0-9]{8}$/, 'g')

export const PHONE_NUMBER_VALIDATION = new RegExp(/(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/g)

export const CPF_VALIDATION = new RegExp(/^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/g)

export const STRONG_PASSWORD = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/g)

import React from 'react'
import {
  ParagraphTitleStyle,
  PolicyClauseNumberStyle,
  PolicyClauseStyle,
  PolicyParagraphStyle,
} from './styles'

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> { }

export const ParagraphTitle: React.FC<ComponentProps> = ({
  children,
  ...props
}: ComponentProps) => {
  return (
    <ParagraphTitleStyle {...props} variant="h5">
      {children}
    </ParagraphTitleStyle>
  )
}

export const PolicyClause: React.FC<ComponentProps> = ({ children, ...props }: ComponentProps) => {
  return (
    <PolicyClauseStyle {...props} variant="body1">
      {children}
    </PolicyClauseStyle>
  )
}

export const PolicyClauseNumber: React.FC<ComponentProps> = ({
  children,
  ...props
}: ComponentProps) => {
  return (
    <PolicyClauseNumberStyle {...props} component="span">
      {children}
    </PolicyClauseNumberStyle>
  )
}

export const PolicyParagraph: React.FC<ComponentProps> = ({
  children,
  ...props
}: ComponentProps) => {
  return <PolicyParagraphStyle {...props}>{children}</PolicyParagraphStyle>
}

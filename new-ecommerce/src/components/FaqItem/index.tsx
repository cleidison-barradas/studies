import { TreeItem } from '@mui/lab'
import { Dropdown } from '../Dropdown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { DropdownItem, QuestionAnswer, QuestionTitle } from './styles'

interface FaqItemProps {
  title: string
  description: React.ReactNode
}

export const FaqItem: React.FC<FaqItemProps> = ({ title, description }) => {
  return (
    <Dropdown>
      <TreeItem
        nodeId={'0'}
        label={
          <DropdownItem>
            <QuestionTitle>{title}</QuestionTitle> <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
          </DropdownItem>
        }
      >
        <TreeItem
          nodeId={'1'}
          label={
            <DropdownItem>
              <QuestionAnswer>{description}</QuestionAnswer>
            </DropdownItem>
          }
        />
      </TreeItem>
    </Dropdown>
  )
}

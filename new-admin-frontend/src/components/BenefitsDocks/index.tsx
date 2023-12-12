import { useContext } from 'react'
import { Button } from '@material-ui/core'

import { SyncDocksContext } from '../../context/SyncDocks'

import { BenefitsDocksStyled } from './styles'
import { BenefitsDocksProps } from './model'

import stockMyPharma from '../../assets/images/stockMyPharma.svg'
import groupSC from '../../assets/images/groupSC.svg'
import stockCart from '../../assets/images/stockCart.svg'
import stockFinance from '../../assets/images/stockFinance.svg'
import stockMoney from '../../assets/images/stockMoney.svg'

export const BenefitsDocks = ({ onFinish }: BenefitsDocksProps) => {
  const { setStepBenefit, stepBenefit, setCheckpoint, checkpoint } = useContext(SyncDocksContext)

  const benefits = [
    <div key="solution">
      <img src={stockMyPharma} alt="MyPharma" />
      <h1>Guia de introdução à integração do seu Estoque Virtual</h1>

      <img src={groupSC} alt="Grupo Santa Cruz" />

      <p>
        Esta é uma solução do GrupoSC.
        <br /> <strong>Aumente suas Vendas com o estoque virtual</strong>
      </p>

      <Button variant="contained" onClick={() => setStepBenefit(1)} color="primary">
        Ok! avançar e conhecer!
      </Button>
    </div>,
    <div key="stock" className="stock">
      <img src={stockCart} alt="Estoque" />

      <h1>Benefícios</h1>
      <strong>Tenha mais 15 mil ítens no seu estoque:</strong>

      <p>
        Ao integrar-se com o Estoque Virtual, você terá acesso a um vasto catálogo com mais de 15 mil itens farmacêuticos
        disponíveis. Isso permite que você amplie sua oferta de produtos, atendendo a uma maior variedade de necessidades dos
        clientes.
      </p>

      <footer>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setCheckpoint({
              ...checkpoint,
              back: true,
              onNext: () => setStepBenefit(2),
              onBack: () => setStepBenefit(0),
            })
          }}
        >
          Voltar e sair
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setStepBenefit(2)
          }}
          color="primary"
        >
          Avançar
        </Button>
      </footer>
    </div>,
    <div key="benefits_one" className="stock">
      <img src={stockFinance} alt="Estoque" />

      <h1>Benefícios</h1>
      <strong> Redução de investimento em estoque físico:</strong>

      <p>
        Com o Estoque Virtual disponível, você pode diminuir seus investimentos em estoque físico. Isso é especialmente benéfico
        para farmácias com espaço limitado ou que desejam minimizar os riscos associados ao estoque parado.
      </p>

      <footer>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setCheckpoint({
              ...checkpoint,
              back: true,
              onNext: () => setStepBenefit(3),
              onBack: () => setStepBenefit(1),
            })
          }}
        >
          Voltar e sair
        </Button>

        <Button fullWidth variant="contained" onClick={() => setStepBenefit(3)} color="primary">
          Avançar
        </Button>
      </footer>
    </div>,

    <div key="benefits_two" className="stock">
      <img src={stockMoney} alt="Estoque" />

      <h1>Benefícios</h1>
      <strong> Maior agilidade no atendimento:</strong>

      <p>
        Ao contar com um estoque virtual amplo e bem abastecido, você pode atender os pedidos dos clientes com mais agilidade.
        Isso pode levar a uma melhoria na satisfação dos clientes e a possíveis ganhos em fidelidade.
      </p>

      <footer>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setCheckpoint({
              ...checkpoint,
              back: true,
              onNext: () => setStepBenefit(4),
              onBack: () => setStepBenefit(2),
            })
          }}
        >
          Voltar e sair
        </Button>

        <Button fullWidth variant="contained" onClick={() => setStepBenefit(4)} color="primary">
          Avançar
        </Button>
      </footer>
    </div>,
    <div key="benefits_three" className="stock">
      <img src={stockFinance} alt="Estoque" />

      <h1>Benefícios</h1>
      <strong> Expansão das vendas:</strong>

      <p>
        Com um catálogo mais amplo, sua farmácia têm a oportunidade de diversificar suas ofertas e, assim, atrair novos clientes.
        Além disso, a maior disponibilidade de produtos pode levar a um aumento nas vendas por impulso e em vendas cruzadas.{' '}
      </p>

      <footer>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setCheckpoint({
              ...checkpoint,
              back: true,
              onNext: () => {
                onFinish()
              },
              onBack: () => setStepBenefit(2),
            })
          }}
        >
          Voltar e sair
        </Button>

        <Button fullWidth variant="contained" onClick={() => onFinish()} color="primary">
          Avançar
        </Button>
      </footer>
    </div>,
  ]

  return <BenefitsDocksStyled>{benefits[stepBenefit]}</BenefitsDocksStyled>
}

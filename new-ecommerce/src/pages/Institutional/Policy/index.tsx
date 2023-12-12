import { Stack, Typography } from '@mui/material'
import React from 'react'
import { BackArrowIcon } from '../../../assets/icons'
import { useNavigate } from 'react-router'
import { AboutUsHelmet } from '../../../components/AboutUsHelmet'
import { ReturnButton } from '../../AboutUs/styles'
import {
  ParagraphTitle,
  PolicyParagraph,
  PolicyClause,
  PolicyClauseNumber,
} from '../components/PolicyTextElements'

export const Policy: React.FC = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <AboutUsHelmet />
      <Stack mb={5} alignItems="center" mt={2} direction="row" spacing={2}>
        <ReturnButton onClick={() => navigate('/')}>
          <BackArrowIcon />
        </ReturnButton>
        <Typography variant="h1" color="#616D78" fontSize={{ lg: 30, xs: 18 }}>
          Politica de privacidade
        </Typography>
      </Stack>
      <Stack>
        <Typography mb={3} variant="h4">
          Termos de uso
        </Typography>
        <Stack mb={3}>
          <Typography variant="body1">
            <Typography style={{ fontWeight: 'bold', marginRight: '10px' }} component="span">
              CERTIFIQUE-SE DE TER LIDO E COMPREENDIDO OS TERMOS DE USO E POLÍTICA DE PRIVACIDADE.
            </Typography>
            A aceitação do presente Termo será confirmada com o ato de cadastramento (gratuito) do
            Usuário para utilização dos serviços prestados neste aplicativo e/ou website. O
            cadastro, navegação e a utilização dos serviços oferecidos neste Aplicativo implicam na
            imediata anuência deste Termo e seu conteúdo. Note que a recusa deste Termo impedirá que
            o Usuário faça pedidos, orçamentos e compras de produtos através do aplicativo. Este
            Termo descreve as condições aplicáveis ao Usuário em relação à utilização dos serviços
            disponibilizados neste aplicativo.
          </Typography>
        </Stack>

        <PolicyParagraph>
          <ParagraphTitle>1. Serviços Oferecidos</ParagraphTitle>
          <PolicyClause>
            <PolicyClauseNumber>1.1</PolicyClauseNumber>Este aplicativo trata-se de uma plataforma
            online por meio da qual nossa loja oferece seus produtos (legalmente admitidos para
            comercialização) aos usuários do aplicativo, podendo praticar preços diferentes das
            lojas físicas. Ao efetuar uma compra através deste aplicativo ou site, o usuário assume
            a possibilidade de que o estoque de alguns produtos talvez não estejam mais disponíveis
            em nosso estoque físico, para pronta entrega.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>1.2</PolicyClauseNumber>Os serviços prestados pelo neste aplicativo
            estão disponíveis apenas para uso pessoal e não comercial. Portanto, não é permitido
            vender, fazer links, usar, copiar, monitorar, exibir, baixar ou reproduzir qualquer
            conteúdo ou informação, software, produtos ou serviços disponíveis no aplicativo para
            quaisquer atividades de propósito comercial ou competitivo.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>2. Cadastro e Utilização</ParagraphTitle>
          <PolicyClause>
            <PolicyClauseNumber>2.1</PolicyClauseNumber>O cadastro, acesso e utilização deste
            aplicativo é gratuito. Todavia, tal circunstância poderá ser modificada a qualquer tempo
            e a seu exclusivo critério, o que deverá ser previamente cientificado ao Usuário para
            aceitação caso pretenda continuar utilizando o aplicativo. Nesta hipótese, as condições
            e forma de pagamento serão previstos em termo aditivo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.2</PolicyClauseNumber>Para utilização dos serviços descritos neste
            Termo, o Usuário deverá prestar as informações exigidas para o seu cadastro no
            aplicativo, sendo única e exclusivamente responsável pelas informações fornecidas, bem
            como por manter o sigilo e a confidencialidade de seus dados e de sua senha de acesso
            perante terceiros.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.3</PolicyClauseNumber>O Usuário reconhece e aceita que lhe fica
            especialmente vedado: (a) fornecer qualquer informação pessoal que não seja verdadeira,
            completa, precisa e atualizada (especialmente no tocante a nome e identificação); (b)
            efetuar registro em nome de terceiros ou utilizando nome ou informações de terceiros sem
            prévia autorização; (c) acessar e/ou divulgar de forma não autorizada informações do
            site e aplicativoi, dos demais Usuários ou de terceiros, ou de qualquer forma
            desrespeitar a intimidade e/ou privacidade de qualquer pessoa; (d) utilizar qualquer
            arquivo, programa de computador, software ou código que possa conter vírus, causar bugs
            ou qualquer outro mecanismo que possa: (d.1) impedir, prejudicar ou de qualquer forma
            limitar o adequado funcionamento de equipamentos e softwares, o acesso à Internet e ao
            site e aplicativo; ou (d.2) implicar ou possibilitar o acesso não autorizado a
            informações confidenciais do site e aplicativo ou dos demais Usuários.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.4</PolicyClauseNumber>O aplicativo e site poderá rejeitar ou
            cancelar ordens de compra (pedidos) e pedidos de registro de qualquer Usuário que deixe
            de atender o disposto nestes Termos de Uso ou possa estar fornecendo informações falsas,
            incompletas ou imprecisas. Não será permitida a criação de novos cadastros por Usuário
            que tenha tido seu cadastro cancelado por violação destes Termos de Uso.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.5</PolicyClauseNumber>O site e aplicativo poderá exigir a
            confirmação da veracidade, exatidão e atualização das informações fornecidas pelo
            Usuário.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.6</PolicyClauseNumber>O site e aplicativo obriga-se a tratar como
            confidenciais os dados pessoais do Usuário que permitam a sua identificação, de acordo
            com sua Política de Privacidade. O Usuário será o único responsável pelas informações
            que vier a fornecer ou divulgar no site e aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>2.7</PolicyClauseNumber>O Usuário poderá avaliar os serviços
            prestados pelo aplicativo site e aplicativo com relação aos negócios realizados por meio
            do aplicativo. Referida avaliação envolve não somente informações sobre a implementação
            do negócio, como comentários que justifiquem a avaliação apresentada. O Usuário será o
            único e exclusivo responsável pela avaliação e comentários que vier a apresentar,
            isentando o site e aplicativode qualquer responsabilidade nesse sentido. O site e
            aplicativo poderá usar e/ou divulgar referida avaliação, bem como excluir a avaliação
            e/ou os comentários em razão de decisão administrativa (interna) ou judicial.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>3. Obrigações do Usuário</ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>3.1</PolicyClauseNumber>Efetuado o cadastro, o Usuário terá acesso
            aos serviços por meio de login e senha, dados esses que se compromete a não divulgar a
            terceiros, ficando sob sua exclusiva responsabilidade qualquer solicitação de serviço
            que seja feito com o uso de login e senha de sua titularidade. O site e aplicativo não
            se responsabiliza por qualquer dano que resulte da divulgação da senha do Usuário a
            terceiros.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>3.2</PolicyClauseNumber>É obrigação do Usuário fornecer informações
            cadastrais totalmente verídicas e exatas, responsabilizando-se exclusiva e integralmente
            por todo o conteúdo informado, mantendo atualizado e confirmado o endereço para entrega
            dos produtos encomendados.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>3.3</PolicyClauseNumber>O Usuário atesta que utiliza os serviços do
            aplicativo por sua livre e desimpedida escolha, bem como reconhece e aceita como de sua
            inteira responsabilidade e risco a utilização do aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>3.4</PolicyClauseNumber>É vedada a transferência, cessão, comodato
            ou qualquer tipo de empréstimo, por qualquer forma, do cadastro do Usuário a terceiros.
            O cadastro do Usuário é pessoal e intransferível.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>3.5</PolicyClauseNumber>O Usuário se obriga, também, a pagar
            integralmente o preço dos produtos solicitados ou encomendados à farmácia e efetivamente
            a si entregues.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>3.6</PolicyClauseNumber>O Usuário garante que não usará os serviços
            do aplicativo para infringir a legislação brasileira.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>4. Obrigações do site e aplicativo</ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>4.1</PolicyClauseNumber>Disponibilizar espaço virtual que permita ao
            Usuário devidamente cadastrado conectar- se, e assim, efetivar pedidos de compra de
            produtos anunciados e comercializados, além de disponibilizar ao Usuário meios de
            pagamento do preço dos produtos via online.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>4.2</PolicyClauseNumber>O Usuário reconhece e concorda que o site e
            aplicativo atuam na área de prestação de serviços farmacêuticos e/ou estabelecimentos
            similares que seguem as práticas e normas da Agência de Vigilância Sanitária (ANVISA).
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>4.3</PolicyClauseNumber>Proteger o fluxo de informações entre
            Usuários e Servidor, bem como a confidencialidade de todas as informações e cadastros
            relativos ao Usuário, além dos valores atinentes às operações financeiras advindas da
            operacionalização dos serviços previstos neste Termo. Contudo, o site e aplicativo não
            responderá pela reparação de prejuízos que possam ser derivados de apreensão e cooptação
            de dados por parte de terceiros que, rompendo os sistemas de segurança, consigam acessar
            essas informações.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>4.4</PolicyClauseNumber>O site e aplicativo não garante que o
            aplicativo estará disponível ininterruptamente e sempre livre de erros, não podendo ser
            responsabilizada por danos causados aos Usuários em virtude de qualquer interrupção no
            funcionamento do aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>4.5</PolicyClauseNumber>O Usuário concorda também que o site e
            aplicativo não responderá por quaisquer danos ou prejuízos causados a seu aparelho
            celular, computador ou qualquer outro equipamento eletrônico em decorrência do uso do
            aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>4.6</PolicyClauseNumber>O site e aplicativo não pode ser
            responsabilizado por qualquer erro que seja relacionado às informações descritivas de
            produtos, e da forma como estes aparecem no aplicativo e site quando referente a seu
            preço, quantidade, imagem e espécie.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>5. Propriedade Intelectual</ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>5.1</PolicyClauseNumber>O Usuário reconhece que o site e aplicativo
            possui marca registrada e proteção junto ao INPI - Instituto Nacional de Propriedade
            Industrial.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>5.2</PolicyClauseNumber>As marcas, nomes, logotipos, nomes de
            domínio e demais sinais distintivos são de propriedade exclusiva do site e aplicativo.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>6. Licença</ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>6.1</PolicyClauseNumber>O site e aplicativo concede ao Usuário
            licença limitada, pessoal, não exclusiva, não transferível, não comercial e plenamente
            revogável, para usar o aplicativo em seu celular ou computador em conformidade com as
            condições previstas neste Termo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>6.2</PolicyClauseNumber>O site e aplicativo não se responsabiliza
            por danos sofridos pelo Usuário em razão de cópia, transferência, distribuição ou
            qualquer outra forma de utilização de conteúdo protegido disponibilizado no aplicativo.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>7. Limitação de Garantia </ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>7.1</PolicyClauseNumber>O Usuário reconhece e aceita que a
            utilização do site e aplicativoé disponibilizada ao Usuário sem qualquer garantia
            expressa ou implícita de funcionamento ininterrupto ou livre de defeitos ou de adequação
            a qualquer finalidade específica.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>7.2</PolicyClauseNumber>O site e aplicativo desde já se reserva o
            direito de, a seu exclusivo critério ou mediante solicitação de terceiros: ( a ) impedir
            ou suspender a divulgação, editar, modificar ou remover qualquer Conteúdo do Usuário
            inserido ou divulgado em sua plataforma; e/ou (b) suspender ou cancelar o acesso do
            Usuário ao site e aplicativo, caso o Usuário descumpra qualquer especificação técnica,
            norma de segurança, disposição legal ou estes Termos de Uso e/ou esteja violando
            direitos de terceiros.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>7.3</PolicyClauseNumber>O Usuário reconhece e aceita que, pela
            própria natureza do site e aplicativo e dos Serviços, não há como garantir: a) quais
            Usuários terão acesso ao site e aplicativo; b) a exatidão, veracidade, precisão ou
            legalidade do conteúdo inserido ou divulgado pelos demais Usuários no site e aplicativo;
            ou c) o funcionamento, acessibilidade ou legalidade do conteúdo dos sites de terceiros
            cujos links venham a ser divulgados no site e aplicativo.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>8. Suspensão de Acesso/Cancelamento dos Serviços</ParagraphTitle>

          <PolicyClause>
            <PolicyClauseNumber>8.1</PolicyClauseNumber>O site e aplicativo poderá suspender o
            acesso e/ou cancelar a utilização do aplicativo a qualquer tempo e independentemente de
            qualquer motivo ou razão, mediante mensagem escrita ao Usuário com 48 (quarenta e oito
            horas) horas de antecedência.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>8.2</PolicyClauseNumber>Sem prejuízo de outras medidas cabíveis, o
            site e aplicativo poderá suspender o acesso e cancelar definitivamente a conta de um
            Usuário, a qualquer tempo, mediante comunicação escrita com efeito imediato se: a ) o
            usuário solicitar falsa entrega à ou informar endereço inexistente, de forma
            reincidente, apenas com o objetivo de causar problemas; b) o site e aplicativo receber
            qualquer ordem judicial solicitando a retirada de qualquer Conteúdo do Usuário do
            aplicativo e/ou o cancelamento da conta do Usuário; c) o site e aplicativo receber
            qualquer informação ou reclamação de outro Usuário ou de terceiros reportando o uso
            indevido de dados ou informações pessoais de qualquer outro Usuário ou de terceiros; d)
            o Usuário deixar de cumprir qualquer disposição destes Termos de Uso e demais políticas
            do site e aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>8.3</PolicyClauseNumber>O Usuário poderá igualmente cancelar seu
            cadastro e, consequentemente, o acesso e a utilização do site e aplicativo, a qualquer
            tempo e independentemente de qualquer motivo ou razão. Nesta hipótese, os dados e
            informações do usuário permanecerão armazenados no sistema do site e aplicativo, a fim
            de que sejam mantidos os registros de vendas e utilização dos serviços.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>9. Limitação de Responsabilidade</ParagraphTitle>
          <PolicyClause style={{ textDecoration: 'underline' }}>
            <PolicyClauseNumber>9.1</PolicyClauseNumber>O site e aplicativo n ão se responsabiliza
            pel as descrições e informações de produtos disponibilizados e, tampouco, faz qualquer
            indicação ou recomendação dos mesmos, razão pela qual não poderá ser responsável por
            qualquer pelo mal uso destes produtos por parte do Usuário.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>9.2</PolicyClauseNumber>O Usuário será o único responsável,
            obrigando-se a isentar de responsabilidade o site e aplicativo com relação a(o): a )
            qualquer descumprimento ou inobservância da legislação aplicável ou das disposições
            destes Termos de Uso; b) acesso ou utilização do site e aplicativo pelo Usuário ou por
            terceiros a quem tenha possibilitado o acesso e uso de sua conta; c) qualquer Conteúdo
            do Usuário que vier a ser inserido ou divulgado no site e aplicativo; d) descumprimento
            de obrigações assumidas com terceiros no tocante a negócios iniciados por meio do site e
            aplicativo;
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>10. Acordo integral</ParagraphTitle>
          <PolicyClause>
            <PolicyClauseNumber>10.1</PolicyClauseNumber>Estes Termos de Uso constituem o acordo
            completo entre o Usuário e o site e aplicativo com relação ao acesso e uso do
            aplicativo.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>10.2</PolicyClauseNumber>Havendo declaração de nulidade de qualquer
            cláusula ou disposição deste Termo, tal fato não afetará as demais cláusulas ou
            disposições aqui contidas, as quais permanecerão em pleno vigor e efeito.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <ParagraphTitle>11. Legislação Aplicável e Foro de Eleição</ParagraphTitle>
          <PolicyClause>
            <PolicyClauseNumber>11.1</PolicyClauseNumber>Estes Termos de Uso são regidos pelas leis
            da República Federativa do Brasil.
          </PolicyClause>

          <PolicyClause>
            <PolicyClauseNumber>11.2</PolicyClauseNumber>As partes elegem desde já o foro onde se
            encontra estabelecida a farmácia para dirimir quaisquer dúvidas e/ou controvérsias
            relacionadas ao acesso e uso do aplicativo site e aplicativo ou às disposições destes
            Termos de Uso, com exclusão de qualquer outro por mais privilegiado que seja.
          </PolicyClause>
        </PolicyParagraph>

        <PolicyParagraph>
          <PolicyClause>
            Esta Política de Privacidade visa esclarecer as práticas que serão adotadas em relação à
            coleta, uso, armazenamento, tratamento, proteção e divulgação das informações que serão
            fornecidas por qualquer pessoa (Usuário) que utilize o site e/ou aplicativo site e
            aplicativo, especialmente dados pessoais capazes de identificar o Usuário. O Usuário
            deverá ler integralmente esta Política de Privacidade antes de utilizar ou submeter
            qualquer informação por meio do site e aplicativo.
          </PolicyClause>

          <PolicyClause>
            Esta Política de Privacidade visa esclarecer as práticas que serão adotadas em relação à
            coleta, uso, armazenamento, tratamento, proteção e divulgação das informações que serão
            fornecidas por qualquer pessoa (Usuário) que utilize o site e/ou aplicativo site e
            aplicativo, especialmente dados pessoais capazes de identificar o Usuário. O Usuário
            deverá ler integralmente esta Política de Privacidade antes de utilizar ou submeter
            qualquer informação por meio do site e aplicativo. Ao acessar ou utilizar o site e
            aplicativo, o Usuário concorda não apenas com esta Política de Privacidade, mas também
            com os Termos de Uso. Sempre que submeter informações por meio do site e aplicativo, o
            Usuário autoriza a coleta, uso, armazenamento, tratamento e divulgação de referidas
            informações de acordo com os termos desta Política de Privacidade.
          </PolicyClause>
          <PolicyClause>
            As informações fornecidas pelo Usuário serão retidas pelo prazo necessário para atender
            aos propósitos das transações objeto do site e aplicativo, observada a legislação
            aplicável. Serão adotadas todas as precauções razoáveis para resguardar as informações
            disponibilizadas pelo Usuário, as quais serão armazenadas em ambiente seguro e
            protegidas com os sistemas de segurança normalmente utilizados. O acesso às informações
            coletadas é restrito a pessoas autorizadas, as quais também estão obrigadas a observar
            esta Política de Privacidade.
          </PolicyClause>
          <PolicyClause>
            O Usuário garante a veracidade e exatidão de todas as informações fornecidas, assumindo
            a responsabilidade daí decorrente e obrigando-se a mantê-las devidamente atualizadas.
            Quando o Usuário acessa o site e aplicativo poderão ser enviados cookies para o
            equipamento utilizado no acesso com o propósito de aperfeiçoar o desempenho do
            aplicativo, bem como personalizar a experiência de acesso do Usuário. O Usuário tem toda
            liberdade para bloquear referidos cookies, sendo certo, no entanto, que tal bloqueio
            poderá impedir o fornecimento de um acesso personalizado e, eventualmente, o Usuário de
            utilizar determinadas funcionalidades do aplicativo/site.
          </PolicyClause>
          <PolicyClause>
            Em função do acesso e da utilização do site e aplicativo pelo Usuário, serão armazenadas
            algumas informações para finalidades de segurança e/ou estatísticas. Tais informações
            poderão incluir os nomes dos provedores de acesso e de serviços de internet, a forma de
            acesso ao site e aplicativ, o endereço IP do Usuário, bem como a região geográfica, data
            e horário de acesso.
          </PolicyClause>
          <PolicyClause>
            As informações coletadas serão utilizadas para interesses comerciais legítimos,
            inclusive para os seguintes propósitos: a) manter atualizado o cadastro do Usuário para
            eventual envio de informações, inclusive informativos; b) comunicação com o Usuário para
            informar a implementação de novas funcionalidades do site e aplicativo; c)
            aperfeiçoamento da usabilidade e a interatividade do site e aplicativo; d) elaboração de
            análises estatísticas, mantendo, todavia, o anonimato de cada Usuário e evitando que
            este possa ser individualizado e identificado; e ) resposta a eventuais solicitações,
            comentários ou dúvidas do Usuário; f) cumprimento das leis, regulamentos aplicáveis e
            ordens judiciais; e g) realização de campanhas de comunicação e/ou de marketing, bem
            como divulgação de ofertas especiais de parceiros. Neste último caso, as mensagens
            enviadas obrigatoriamente trarão opção de cancelamento do envio de mensagens.
          </PolicyClause>
          <PolicyClause>
            O Usuário reconhece e aceita que as informações fornecidas pelo Usuário poderão ser
            divulgadas, no todo ou em parte, para responder a ordens ou processos judiciais, bem
            como para investigar e/ou tomar quaisquer medidas contra eventual suspeita de atividade
            ilícita ou de violação a esta Política de Privacidade, aos Termos de Uso ou da
            legislação aplicável. Em qualquer outro caso, o Usuário será consultado previamente
            acerca da divulgação de qualquer das informações fornecidas.
          </PolicyClause>
          <PolicyClause>
            As informações coletadas serão utilizadas para interesses comerciais legítimos,
            inclusive para os seguintes propósitos: a) manter atualizado o cadastro do Usuário para
            eventual envio de informações, inclusive informativos; b) comunicação com o Usuário para
            informar a implementação de novas funcionalidades do site e aplicativo; c)
            aperfeiçoamento da usabilidade e a interatividade do site e aplicativo; d) elaboração de
            análises estatísticas, mantendo, todavia, o anonimato de cada Usuário e evitando que
            este possa ser individualizado e identificado; e ) resposta a eventuais solicitações,
            comentários ou dúvidas do Usuário; f) cumprimento das leis, regulamentos aplicáveis e
            ordens judiciais; e g) realização de campanhas de comunicação e/ou de marketing, bem
            como divulgação de ofertas especiais de parceiros. Neste último caso, as mensagens
            enviadas obrigatoriamente trarão opção de cancelamento do envio de mensagens. O Usuário
            reconhece e aceita que as informações fornecidas pelo Usuário poderão ser divulgadas, no
            todo ou em parte, para responder a ordens ou processos judiciais, bem como para
            investigar e/ou tomar quaisquer medidas contra eventual suspeita de atividade ilícita ou
            de violação a esta Política de Privacidade, aos Termos de Uso ou da legislação
            aplicável. Em qualquer outro caso, o Usuário será consultado previamente acerca da
            divulgação de qualquer das informações fornecidas. Esta Política de Privacidade
            aplica-se exclusivamente ao site e aplicativo, não se aplicando ao acesso de sites de
            terceiros, ainda que o Usuário tenha sido direcionado para referidos sites por meio de
            links disponibilizados no site e aplicativo. Portanto, é recomendável que o Usuário, ao
            ser redirecionado para sites externos, consulte a respectiva política de privacidade e
            os termos de uso antes de fornecer quaisquer informações.
          </PolicyClause>
          <PolicyClause>
            O site e aplicativo não será responsável por quaisquer perdas de dados do usuário,
            inclusive decorrentes de caso fortuito, força maior, ocorridas em virtude de invasores
            ao aplicativo e quebra de segurança por parte de terceiros não autorizados.
          </PolicyClause>
          <PolicyClause>
            Esta Política de Privacidade poderá ser atualizada periodicamente, caso em que será
            colocado um aviso no website e/ou no aplicativo site e aplicativo para consulta do
            Usuário.
          </PolicyClause>
          <PolicyClause>
            Caso o Usuário considere ter suas informações utilizadas indevidamente por terceiros e
            em desacordo com o presente Termo, este poderá entrar em contato com o site e aplicativo
            por meio do canal de comunicação exposto na página Contato do site. O analisará a
            reclamação e tomará as medidas que considerar cabíveis.
          </PolicyClause>
        </PolicyParagraph>
      </Stack>
    </React.Fragment>
  )
}

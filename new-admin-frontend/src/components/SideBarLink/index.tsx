import { Accordion, AccordionDetails, AccordionSummary, Box, Tooltip, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classNames from 'classnames'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import styles from './styles'
import RouteLink from '../../interfaces/routeLink'
import Plan from '../../interfaces/plan'

type Props = RouteComponentProps & {
  plan?: Plan
  link: RouteLink
  sideBarOpen?: boolean
  toggleDrawerOpen: () => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

type State = {
  selected: boolean
  expanded: boolean
  customTitle: string
  customImage: string
}

type ReplaceTitleSubMenus = {
  [key: Plan['rule']]: { path: string; title: string }[]
}

class SideBarLink extends Component<Props, State> {
  static defaultProps = {
    plan: undefined,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      selected: false,
      expanded: false,
      customTitle: 'Horário de funcionamento',
      customImage: 'clock.svg',
    }
    this.onChange = this.onChange.bind(this)
  }

  isSelected = ({ exact, path }: RouteLink) => {
    const { location } = this.props
    let is = false
    if (exact && location.pathname === path) {
      is = true
    }
    if (!exact && location.pathname.includes(path!)) {
      is = true
    }
    return is
  }

  componentDidUpdate(newProps: any) {
    const {
      link: { children },
      sideBarOpen,
    } = this.props
    const { expanded } = this.state
    if (children) {
      const anyselected = children.find((value) => this.isSelected(value))
      if (anyselected && this.state.selected === false) {
        this.setState({
          ...this.state,
          selected: true,
        })
      }
      if (!anyselected && this.state.selected === true) {
        this.setState({
          ...this.state,
          selected: false,
        })
      }
    }
    if (!sideBarOpen && newProps.sideBarOpen && expanded) {
      this.setState({
        ...this.state,
        expanded: false,
      })
    }
  }

  componentDidMount() {
    const {
      link: { children },
    } = this.props
    if (children) {
      const anyselected = children.find((value) => this.isSelected(value))
      if (anyselected && this.state.selected === false) {
        this.setState({
          ...this.state,
          selected: true,
        })
      }
      if (!anyselected && this.state.selected === true) {
        this.setState({
          ...this.state,
          selected: false,
        })
      }
    }
  }

  snippetNew() {
    const { classes } = this.props
    return (
      <Box className={classes.snippetNew}>
        <Typography className={classes.textSnippetNew}>NOVO</Typography>
      </Box>
    )
  }

  onChange(event: object, expanded: boolean, drawer?: boolean) {
    const { sideBarOpen, toggleDrawerOpen } = this.props
    if (sideBarOpen) {
      this.setState({
        ...this.state,
        expanded: !expanded,
      })
    } else {
      this.setState(
        {
          ...this.state,
          expanded: true,
        },
        () => drawer && toggleDrawerOpen()
      )
    }
  }

  render() {
    const { selected, expanded, customImage, customTitle } = this.state
    const {
      classes,
      plan,
      link: { children, path, image, title, external, isNew },
      sideBarOpen,
    } = this.props

    const planPathExceptions = ['pro', 'pro-generic', 'start', 'enterprise']
    const pathExceptions = {
      '/sales/list': '/sales',
    } as { [key: string]: string }

    const planPermissions = plan?.permissions
    const pathException = pathExceptions[path]

    const isVisibleMenuItem = planPermissions?.paths.includes(
      planPathExceptions.includes(plan?.rule as string) ? (!!pathException ? pathException : path) : path
    )

    const textTooltipLink = isVisibleMenuItem ? title : title + ' disponível no plano PRO'

    const replaceTitleSubItems = {
      institutional: [
        {
          path: '/marketing/automations',
          title: 'E-mail marketing',
        },
      ],
    } as ReplaceTitleSubMenus

    const defaultLink = (
      <Link
        to={path!}
        className={classNames(classes.link, {
          [classes.selected]: this.isSelected(this.props.link),
          [classes.disabled]: !isVisibleMenuItem,
        })}
      >
        <Tooltip title={textTooltipLink} placement="right">
          <img
            src={
              require(`../../assets/images/${plan && plan.rule === 'start' && path === '/delivery/config' ? customImage : image}`)
                .default
            }
            className={classNames({
              [classes.selectedImage]: this.isSelected(this.props.link),
            })}
            alt={title}
          />
        </Tooltip>

        {sideBarOpen && (
          <Typography className={classNames(classes.heading)}>
            {plan && plan.rule === 'start' && path === '/delivery/config' ? customTitle : title} {isNew && this.snippetNew()}
          </Typography>
        )}
      </Link>
    )

    return (
      <>
        {children && children.length > 0 ? (
          <Accordion
            classes={{
              root: classes.MuiAccordionroot,
            }}
            expanded={expanded}
            onChange={(e) => this.onChange(e, expanded, true)}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classNames(classes.link, classes.multiLink, { [classes.selected]: selected })}
              classes={{
                root: classes.summaryroot,
              }}
            >
              <Tooltip title={title} placement="right">
                <img
                  src={require(`../../assets/images/${image}`).default}
                  className={selected ? classes.selectedImage : ''}
                  alt=""
                />
              </Tooltip>

              {sideBarOpen && (
                <Typography className={classes.heading}>
                  {plan && plan.rule === 'start' && path === '/delivery/config' ? customTitle : title}{' '}
                  {isNew && this.snippetNew()}
                </Typography>
              )}
            </AccordionSummary>
            {children.map((value: RouteLink, index: number) => {
              const accordionItemIsVisible = planPermissions?.paths.includes(value.path)
              const titleItem =
                replaceTitleSubItems[plan?.rule as Plan['rule']]?.find((subItem) => value.path === subItem.path)?.title ||
                value.title
              const textTooltipAccordionItem = accordionItemIsVisible ? titleItem : titleItem + ' disponível no plano PRO'

              const accordionItem = (
                <AccordionDetails aria-disabled={!accordionItemIsVisible} key={index}>
                  <Link
                    to={value.path}
                    className={classNames(classes.subLink, {
                      [classes.selected]: this.isSelected(value),
                      [classes.disabled]: !accordionItemIsVisible,
                    })}
                  >
                    {sideBarOpen ? <Typography className={classes.heading}> {titleItem} </Typography> : ''}
                  </Link>
                </AccordionDetails>
              )

              return isVisibleMenuItem ? (
                accordionItem
              ) : (
                <Tooltip title={textTooltipAccordionItem} placement="right">
                  {accordionItem}
                </Tooltip>
              )
            })}
          </Accordion>
        ) : external && external.length > 0 ? (
          <>
            <a
              href={external}
              className={classNames(classes.link, this.isSelected(this.props.link) ? classes.selected : '', classes.heading)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip title={title} placement="right">
                <img
                  src={require(`../../assets/images/${image}`).default}
                  className={this.isSelected(this.props.link) ? classes.selectedImage : ''}
                  alt=""
                />
              </Tooltip>
              {title}
            </a>
          </>
        ) : isVisibleMenuItem ? (
          defaultLink
        ) : (
          <Tooltip title={textTooltipLink} aria-disabled placement={sideBarOpen ? 'right' : 'top-end'}>
            <div>{defaultLink}</div>
          </Tooltip>
        )}
      </>
    )
  }
}

export default withStyles(styles)(withRouter(SideBarLink))

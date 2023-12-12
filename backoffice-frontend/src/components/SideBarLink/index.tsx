import { Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classNames from 'classnames'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { ChildrenLink, SideBarLink as SidebarLinkInterface } from '../../navigation/sideBarLinks'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    sideBarOpen?: boolean
    link: SidebarLinkInterface
}

type State = {
    selected: boolean
    expanded: boolean
}

class SideBarLink extends Component<Props, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            selected: false,
            expanded: false,
        }
        this.onChange = this.onChange.bind(this)
    }

    isSelected = ({ exact, path }: SidebarLinkInterface | ChildrenLink) => {
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

    componentDidUpdate() {
        const {
            link: { children },
            sideBarOpen,
        } = this.props
        const { expanded } = this.state
        if (children) {
            const anyselected = children.find((value: ChildrenLink) => this.isSelected(value))
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
        if (!sideBarOpen && expanded) {
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
            const anyselected = children.find((value: ChildrenLink) => this.isSelected(value))
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

    onChange(event: object, expanded: boolean) {
        const { sideBarOpen } = this.props
        if (sideBarOpen) {
            this.setState({
                ...this.state,
                expanded,
            })
        } else {
            this.setState({
                ...this.state,
                expanded: false,
            })
        }
    }

    render() {
        const { selected, expanded } = this.state
        const {
            classes,
            link: { children, path, icon, title, external },
            sideBarOpen,
        } = this.props

        return (
            <>
                {children ? (
                    <Accordion
                        classes={{
                            root: classes.MuiAccordionroot,
                        }}
                        expanded={expanded}
                        disabled={!sideBarOpen}
                        onChange={this.onChange}
                        elevation={0}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className={classNames(classes.link, classes.multiLink, selected ? classes.selected : '')}
                            classes={{
                                root: classes.summaryroot,
                            }}
                        >
                            <img src={icon} className={selected ? classes.selectedImage : ''} alt="" />
                            {sideBarOpen ? <Typography className={classes.heading}>{title}</Typography> : ''}
                        </AccordionSummary>
                        {children.map((value: ChildrenLink, index: any) => (
                            <AccordionDetails key={index}>
                                <Link
                                    to={value.path}
                                    className={classNames(
                                        classes.subLink,
                                        this.isSelected(value) ? classes.selected : ''
                                    )}
                                >
                                    {sideBarOpen ? (
                                        <Typography className={classes.heading}> {value.title} </Typography>
                                    ) : (
                                        ''
                                    )}
                                </Link>
                            </AccordionDetails>
                        ))}
                    </Accordion>
                ) : external ? (
                    <>
                        <a
                            href={external}
                            className={classNames(
                                classes.link,
                                this.isSelected(this.props.link) ? classes.selected : '',
                                classes.heading
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={icon}
                                className={this.isSelected(this.props.link) ? classes.selectedImage : ''}
                                alt=""
                            />
                            {title}
                        </a>
                    </>
                ) : (
                    <Link
                        to={path!}
                        className={classNames(classes.link, this.isSelected(this.props.link) ? classes.selected : '')}
                    >
                        <img
                            src={icon}
                            className={this.isSelected(this.props.link) ? classes.selectedImage : ''}
                            alt=""
                        />
                        {sideBarOpen ? <Typography className={classes.heading}> {title} </Typography> : ''}
                    </Link>
                )}
            </>
        )
    }
}

export default withStyles(styles)(withRouter(SideBarLink))

import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import Icon from "@material-ui/core/Icon";

import CheckIcon from "@material-ui/icons/Check";
import RemoveIcon from "@material-ui/icons/Remove";

import Fade from "@material-ui/core/Fade";
const Transition = props => <Fade {...props} />;

const styles = {
    wrapperContainer: {
        height: "100%"
    },
    cardContent: {
        textAlign: "center",
        backgroundColor: "#ffffff"
    },
    list: {
        marginTop: 8
    },
    listItem: {
        paddingLeft: 0
    },
    checkbox: {
        padding: 0
    },
    formControlLabel: {
        color: "#000000"
    },
    text: {
        color: "#000000"
    }
};

class LoadingScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            redirect: false,
            loadingTypes: {
                secureKey: {
                    text: "Creating a secure key"
                },
                decryptingData: {
                    text: "Decrypting session data"
                },
                fetchingUserInfo: {
                    text: "Fetching user information"
                },
                loadingStoredData: {
                    text: "Loading stored data"
                }
            }
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ open: true });
        }, 500);
        console.log("Mounted loadingscreen");
    }

    componentWillUnmount() {
        console.log("Unmounted loadingscreen");
    }

    componentDidUpdate(prevProps) {
        const { loadingScreenLoading, loadingScreenHasLoaded } = this.props;
        const loadingTypes = this.state.loadingTypes;
        let stateChanged = false;

        if (stateChanged) {
            this.setState({
                loadingTypes: loadingTypes
            });
        }
    }

    render() {
        const { redirect, loadingTypes } = this.state;
        const { t, statusMessage, loadingScreenLoading, loadingScreenHasLoaded } = this.props;

        if (redirect) return <Redirect to="/" />;

        const loadingCount = Object.keys(loadingTypes).reduce((accumulator, item) => {
            if (!loadingScreenLoading[item]) return accumulator;
            return accumulator + 1;
        }, 0);
        const finishedCount = Object.keys(loadingTypes).reduce((accumulator, item) => {
            if (loadingScreenLoading[item]) return accumulator;

            const addedValue = loadingScreenHasLoaded[item] ? 1 : 0;
            return accumulator + addedValue;
        }, 0);

        const MIN = 0;
        const MAX = Object.keys(loadingTypes).length;
        const normalise = value => ((value - MIN) * 100) / (MAX - MIN);

        const normalizedLoadingCount = normalise(loadingCount);
        const normalizedFinishedCount = normalise(finishedCount);

        let cardContent = (
            <CardContent style={styles.cardContent}>
                <Typography variant="subheading" style={styles.text}>
                    {statusMessage}
                </Typography>

                <LinearProgress
                    variant="buffer"
                    value={normalizedFinishedCount}
                    valueBuffer={normalizedFinishedCount + normalizedLoadingCount}
                />

                <List style={styles.list} dense={true}>
                    {Object.keys(loadingTypes).map(loadingTypeKey => {
                        const loadingType = loadingTypes[loadingTypeKey];
                        const isLoading = !!loadingScreenLoading[loadingTypeKey];
                        const hasLoaded = !!loadingScreenHasLoaded[loadingTypeKey];

                        let statusComponent = null;
                        if (isLoading) {
                            statusComponent = <CircularProgress size={20} />;
                        } else if (hasLoaded) {
                            statusComponent = (
                                <Icon style={styles.checkbox} checked={true} color="primary">
                                    <CheckIcon />
                                </Icon>
                            );
                        } else {
                            statusComponent = (
                                <Icon>
                                    <RemoveIcon />
                                </Icon>
                            );
                        }
                        return (
                            <ListItem style={styles.listItem} dense={true}>
                                {statusComponent}
                                <ListItemText
                                    style={styles.text}
                                    primary={
                                        <Typography variant="body2" style={styles.text}>
                                            {loadingType.text}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </CardContent>
        );

        return (
            <Dialog fullScreen open={this.state.open} TransitionComponent={Transition} style={{ overflow: "hidden" }}>
                <Grid container justify={"center"} alignItems={"center"} style={styles.wrapperContainer}>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ zIndex: 1 }} className="login-wrapper">
                        <Card>{cardContent}</Card>
                    </Grid>

                    <img src="./images/svg/login-bg2.svg" id="login-background-image" />

                    <span className="bunqdesktop-text-wrapper">
                        <span className="bunqdesktop-text-first">bunq</span>
                        <span className="bunqdesktop-text-second">Desktop</span>
                    </span>
                </Grid>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        statusMessage: state.application.status_message,

        loadingScreenLoading: state.loading_screen.loading,
        loadingScreenHasLoaded: state.loading_screen.has_loaded,

        derivedPassword: state.registration.derivedPassword,
        registrationLoading: state.registration.loading,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        masterCardActionsLoading: state.master_card_actions.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading,

        users: state.users.users,
        user: state.user.user,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(LoadingScreen));
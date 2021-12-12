import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography } from '@material-ui/core';
import styles from './styles';
import { Add } from '@material-ui/icons';
import {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
} from '../../../../../store/actions';

class AddCinema extends Component {
  state = {
    _id: '',
    name: '',
    image: null,
    long: '',
    city: '',
    lat: '',
    seats: [],
    notification: {}
  };

  componentDidMount() {
    if (this.props.editCinema) {
      this.setState(this.props.editCinema);
    }
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onSubmitAction = async type => {
    const {
      getCinemas,
      createCinemas,
      updateCinemas,
      removeCinemas,
      handleClose
    } = this.props;
    const {
      id,
      name,
      long,
      city,
      lat,
      seats
    } = this.state;
    const cinema = { name, long: Number(long), lat: Number(lat), partnerId: "08d9b999-8afa-48de-80c6-5362e19ddd0f" };
    let notification = {};
    type === 'create'
      ? (notification = await createCinemas([cinema]))
      : type === 'update'
        ? (notification = await updateCinemas(cinema, id))
        : (notification = await removeCinemas(id));
    this.setState({ notification });
    if (notification && notification.status === 'success') getCinemas();
    handleClose()
  };

  handleSeatsChange = (index, value) => {
    if (value > 10) return;
    const { seats } = this.state;
    seats[index] = Array.from({ length: value }, () => 0);
    this.setState({
      seats
    });
  };

  onAddSeatRow = () => {
    this.setState(prevState => ({
      seats: [...prevState.seats, []]
    }));
  };

  renderSeatFields = () => {
    const { seats } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className={classes.field}>
          <Button onClick={() => this.onAddSeatRow()}>
            <Add /> add Seats
          </Button>
        </div>
        {seats.length > 0 &&
          seats.map((seat, index) => (
            <div
              className={classes.field}
              key={`seat-${index}-${seat.length}`}
            >
              <TextField
                className={classes.textField}
                inputProps={{
                  min: 0,
                  max: 10
                }}
                key={`new-seat-${index}`}
                label={
                  'Add number of seats for row : ' +
                  (index + 10).toString(36).toUpperCase()
                }
                margin="dense"
                onChange={event =>
                  this.handleSeatsChange(index, event.target.value)
                }
                required
                type="number"
                value={seat.length}
                variant="outlined"
              />
            </div>
          ))}
      </>
    );
  };

  render() {
    const { classes, className } = this.props;
    const {
      name,
      long,
      lat,
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const mainTitle = this.props.editCinema ? 'Edit Cinema' : 'Add Cinema';
    const submitButton = this.props.editCinema
      ? 'Update Cinema'
      : 'Save Details';
    const submitAction = this.props.editCinema
      ? () => this.onSubmitAction('update')
      : () => this.onSubmitAction('create');

    return (
      <div className={rootClassName}>
        <Typography
          className={classes.title}
          variant="h4"
        >
          {mainTitle}
        </Typography>
        <form
          autoComplete="off"
          noValidate
        >
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the cinema name"
              label="Name"
              margin="dense"
              onChange={event =>
                this.handleFieldChange('name', event.target.value)
              }
              required
              value={name}
              variant="outlined"
            />
          </div>

          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Long"
              margin="dense"
              onChange={event =>
                this.handleFieldChange('long', event.target.value)
              }
              type="number"
              value={long}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              label="Lat"
              margin="dense"
              onChange={event =>
                this.handleFieldChange('lat', event.target.value)
              }
              required
              value={lat}
              variant="outlined"
            />
          </div>
          {this.renderSeatFields()}
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          onClick={submitAction}
          variant="contained"
        >
          {submitButton}
        </Button>
        {this.props.editCinema && (
          <Button
            className={classes.buttonFooter}
            color="secondary"
            onClick={() => this.onSubmitAction('remove')}
            variant="contained"
          >
            Delete Cinema
          </Button>
        )}
      </div>
    );
  }
}

AddCinema.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = null;
const mapDispatchToProps = {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddCinema));

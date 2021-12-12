import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DateTimePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import styles from './styles';
import { addShowtime, updateShowtime } from '../../../../../store/actions';
import axios from 'axios';

class AddShowtime extends Component {
  state = {
    startAt: '',
    startTime: null,
    endTime: null,
    movieId: '',
    cinemaId: '',
    roomId: '',
    rooms: [],
    ticketPrice:''
  };

  componentDidMount() {
    if (this.props.selectedShowtime.length > 0) {
      const {
        startAt,
        startTime,
        endTime,
        movieId,
        cinemaId,
        ticketPrice
      } = this.props.selectedShowtime;
      this.setState({
        startAt,
        startTime,
        endTime,
        movieId,
        cinemaId,
        ticketPrice
      });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.cinemaId !== prevState.cinemaId) {
      this.getRooms();
    }
  }
  
  getRooms = async () => {
    axios.get(`https://localhost:1810/api/Cinemas/${this.state.cinemaId}`,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` } })
      .then(respone => {
        const newState = { ...this.state };
        newState.rooms = respone.data.rooms;
        this.setState(newState)
      })
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddShowtime = () => {
    const { roomId, startTime, endTime, movieId, cinemaId, ticketPrice } = this.state;
    const showtime = {
      startTime,
      endTime,
      movieId,
      cinemaId,
      roomId,
      ticketPrice: Number(ticketPrice)
    };
    this.props.addShowtime([showtime]);
    this.props.getShowtimes()
  };

  onUpdateShowtime = () => {
    const { startAt, startTime, endTime, movieId, cinemaId, ticketPrice } = this.state;
    const showtime = {
      startAt,
      startTime,
      endTime,
      movieId,
      cinemaId,
      ticketPrice
    };
    this.props.updateShowtime([showtime], this.props.selectedShowtime.id);
  };

  render() {
    const { nowShowing, cinemas, classes, className } = this.props;
    const { startAt, startTime, endTime, movieId, cinemaId, roomId, rooms, ticketPrice } = this.state;
    console.log('this.props.selectedShowtime', this.props.selectedShowtime);
    const rootClassName = classNames(classes.root, className);
    const title = this.props.selectedShowtime.length > 0
      ? 'Edit Showtime'
      : 'Add Showtime';
    const submitButton = this.props.selectedShowtime.length > 0
      ? 'Update Showtime'
      : 'Save Details';
    const submitAction = this.props.selectedShowtime.length > 0
      ? () => this.onUpdateShowtime()
      : () => this.onAddShowtime();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              label="Movie"
              margin="dense"
              required
              value={movieId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('movieId', event.target.value)
              }>
              {nowShowing.map(movie => (
                <MenuItem key={movie.id} value={movie.id}>
                  {movie.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText="Please specify the Time"
              label="Time"
              margin="dense"
              required
              value={startAt}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('startAt', event.target.value)
              }>
              {['18:00', '19:00', '20:00', '21:00', ' 22:00', '23:00'].map(
                time => (
                  <MenuItem key={`time-${time}`} value={time}>
                    {time}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              fullWidth
              className={classes.textField}
              helperText="Please specify the Time"
              label="Ticket price"
              margin="dense"
              type='number'
              required
              variant="outlined"
              value={ticketPrice}
              onChange={event =>
                this.handleFieldChange('ticketPrice', event.target.value)
              }/>
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              label="Cinema"
              margin="dense"
              required
              value={cinemaId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('cinemaId', event.target.value)
              }>
              {cinemas.map(cinema => (
                <MenuItem key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              className={classes.textField}
              label="Room"
              margin="dense"
              required
              value={roomId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('roomId', event.target.value)
              }>
              {rooms.map(room => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="start-date"
                label="Start Date"
                minDate={new Date()}
                value={startTime}
                onChange={date => this.handleFieldChange('startTime', date._d)}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />

              <DateTimePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="End Date"
                minDate={new Date(startTime)}
                value={endTime}
                onChange={date => this.handleFieldChange('endTime', date._d)}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
      </div>
    );
  }
}

AddShowtime.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ movieState, cinemaState }) => ({
  movies: movieState.movies,
  nowShowing: movieState.nowShowing,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { addShowtime, updateShowtime };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddShowtime));

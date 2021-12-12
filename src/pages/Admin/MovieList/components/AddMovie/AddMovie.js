import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';

class AddMovie extends Component {
  state = {
    name: '',
    tags: [],
    posterUrl: '',
    runningTimeInMinutes: '',
    description: '',
    director: '',
    actors: '',
    trailerUrl: ''
  };
  
  componentDidMount() {
      console.log(this.props.edit);

    if (this.props.edit) {
      const {
        name,
        posterUrl,
        tags,
        director,
        actors,
        description,
        runningTimeInMinutes,
        trailerUrl
      } = this.props.edit;
      this.setState({
        name,
        posterUrl,
        tags,
        director,
        actors,
        description,
        runningTimeInMinutes,
        trailerUrl
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie) {
      const { name, tags, posterUrl } = this.props.movie;
      this.setState({ name, tags, posterUrl });
    }
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

  onAddMovie = () => {
    const movie = this.state;
    this.props.addMovie(movie);
  };

  onUpdateMovie = () => {
    const movie = this.state;
    this.props.updateMovie(this.props.edit.id, movie);
  };

  onRemoveMovie = () => this.props.removeMovie(this.props.edit.id);

  render() {
    const { classes, className } = this.props;
    const {
      name,
      tags,
      posterUrl,
      runningTimeInMinutes,
      description,
      director,
      actors,
      trailerUrl
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Edit Movie' : 'Add Movie';
    const submitButton = this.props.edit ? 'Update Movie' : 'Save Details';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.name}>
          {subtitle}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the name"
              label="Name"
              margin="dense"
              required
              value={name}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('name', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <Select
              multiple
              displayEmpty
              className={classes.textField}
              label="Genre"
              margin="dense"
              required
              value={tags}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('tags', event.target.value)
              }>
              {genreData.map((genreItem, index) => (
                <MenuItem key={genreItem + '-' + index} value={genreItem}>
                  {genreItem}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              multiline
              className={classes.textField}
              label="Description"
              margin="dense"
              required
              variant="outlined"
              value={description}
              onChange={event =>
                this.handleFieldChange('description', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Poster Url"
              margin="dense"
              required
              value={posterUrl}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('posterUrl', event.target.value)
              }/>

            <TextField
              className={classes.textField}
              label="Duration (minutes)"
              margin="dense"
              type="string"
              value={runningTimeInMinutes}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('runningTimeInMinutes', Number(event.target.value))
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Director"
              margin="dense"
              required
              value={director}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('director', event.target.value)
              }
            />
            <TextField
              className={classes.textField}
              label="Cast"
              margin="dense"
              required
              value={actors}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('actors', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Trailer Url"
              margin="dense"
              required
              value={trailerUrl}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('trailerUrl', event.target.value)
              } />
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.edit && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={this.onRemoveMovie}>
            Delete Movie
          </Button>
        )}
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  movie: PropTypes.object
};

const mapStateToProps = ({ movieState }) => ({
  movies: movieState.movies
});

const mapDispatchToProps = { addMovie, updateMovie, removeMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
